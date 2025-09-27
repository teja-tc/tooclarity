"use client";

let socketInstance: any | null = null;

export async function getSocket(origin?: string) {
  if (socketInstance && socketInstance.connected) return socketInstance;
  const { io } = await import('socket.io-client');
  const url = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  socketInstance = io(url, { withCredentials: true, transports: ['websocket'] });
  return socketInstance;
} 

// ------- Production-grade Socket Manager -------

type EventHandler = (...args: any[]) => void;

type RoomKey = string; // e.g., institutionAdmin:<id>, institution:<id>

type BackoffConfig = {
  baseMs: number;
  maxMs: number;
};

class SocketManager {
  private socket: any | null = null;
  private isConnecting = false;
  private refCount = 0;
  private roomRefCounts: Map<RoomKey, number> = new Map();
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private idleTimer: number | null = null;
  private hiddenTimer: number | null = null;
  private backoffCfg: BackoffConfig = { baseMs: 1000, maxMs: 30000 };
  private backoffAttempts = 0;
  private origin = "";

  constructor() {
    if (typeof window !== 'undefined') {
      this.origin = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api','') || window.location.origin;
      window.addEventListener('online', this.onOnline);
      window.addEventListener('offline', this.onOffline);
      document.addEventListener('visibilitychange', this.onVisibility);
    }
  }

  private onOnline = () => {
    if (this.refCount > 0) {
      this.connect();
    }
  };

  private onOffline = () => {
    this.safeDisconnect();
  };

  private onVisibility = () => {
    if (document.visibilityState === 'hidden') {
      this.clearHiddenTimer();
      this.hiddenTimer = window.setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          this.safeDisconnect();
        }
      }, 90_000);
    } else {
      this.clearHiddenTimer();
      if (this.refCount > 0 && !this.socket) this.connect();
    }
  };

  private clearHiddenTimer() {
    if (this.hiddenTimer !== null) {
      clearTimeout(this.hiddenTimer);
      this.hiddenTimer = null;
    }
  }

  private async connect() {
    if (this.socket || this.isConnecting) return;
    if (!navigator.onLine) return;
    this.isConnecting = true;
    try {
      this.socket = await getSocket(this.origin);
      this.isConnecting = false;
      this.backoffAttempts = 0;
      this.bindBaseEvents();
      this.rejoinAllRooms();
      this.rebindAllHandlers();
    } catch (e) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.refCount <= 0) return;
    const delay = Math.min(this.backoffCfg.maxMs, this.backoffCfg.baseMs * Math.pow(2, this.backoffAttempts)) + Math.round(Math.random() * 500);
    this.backoffAttempts = Math.min(this.backoffAttempts + 1, 10);
    window.setTimeout(() => {
      if (this.refCount > 0 && !this.socket) this.connect();
    }, delay);
  }

  private bindBaseEvents() {
    if (!this.socket) return;
    this.socket.on('disconnect', () => {
      this.socket = null;
      this.scheduleReconnect();
    });
    this.socket.on('connect_error', () => {
      try { this.socket?.disconnect(); } catch (err) { console.error('socketManager: disconnect on connect_error failed', err); }
      this.socket = null;
      this.scheduleReconnect();
    });
  }

  private rejoinAllRooms() {
    if (!this.socket) return;
    for (const room of this.roomRefCounts.keys()) {
      this.socket.emit('join', room);
    }
  }

  private rebindAllHandlers() {
    if (!this.socket) return;
    for (const [event, handlers] of this.eventHandlers.entries()) {
      for (const h of handlers) {
        this.socket.on(event, h);
      }
    }
  }

  private startIdleTimer() {
    if (this.idleTimer !== null) return;
    this.idleTimer = window.setTimeout(() => {
      if (this.refCount <= 0) {
        this.safeDisconnect();
      }
    }, 60_000);
  }

  private clearIdleTimer() {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  private safeDisconnect() {
    this.clearIdleTimer();
    if (this.socket) {
      try { this.socket.disconnect(); } catch (err) { console.error('socketManager: safeDisconnect failed', err); }
      this.socket = null;
    }
  }

  public retain() {
    this.refCount += 1;
    this.clearIdleTimer();
    if (!this.socket) this.connect();
  }

  public release() {
    this.refCount = Math.max(0, this.refCount - 1);
    if (this.refCount === 0) {
      this.startIdleTimer();
    }
  }

  public subscribeRoom(room: RoomKey) {
    const next = (this.roomRefCounts.get(room) || 0) + 1;
    this.roomRefCounts.set(room, next);
    if (this.socket && next === 1) {
      this.socket.emit('join', room);
    }
  }

  public unsubscribeRoom(room: RoomKey) {
    const cur = this.roomRefCounts.get(room) || 0;
    const next = Math.max(0, cur - 1);
    if (next === 0) {
      this.roomRefCounts.delete(room);
      if (this.socket) this.socket.emit('leave', room);
    } else {
      this.roomRefCounts.set(room, next);
    }
  }

  public addListener(event: string, handler: EventHandler) {
    if (!this.eventHandlers.has(event)) this.eventHandlers.set(event, new Set());
    this.eventHandlers.get(event)!.add(handler);
    if (this.socket) this.socket.on(event, handler);
  }

  public removeListener(event: string, handler: EventHandler) {
    const set = this.eventHandlers.get(event);
    if (set && set.has(handler)) {
      set.delete(handler);
      if (this.socket) this.socket.off(event, handler);
      if (set.size === 0) this.eventHandlers.delete(event);
    }
  }
}

export const socketManager = new SocketManager();
export type { RoomKey }; 