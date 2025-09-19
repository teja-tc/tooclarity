"use client";

let socketInstance: any | null = null;

export async function getSocket(origin?: string) {
  if (socketInstance && socketInstance.connected) return socketInstance;
  const { io } = await import('socket.io-client');
  const url = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  socketInstance = io(url, { withCredentials: true, transports: ['websocket'] });
  return socketInstance;
} 