import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI, authAPI } from '../api';
import { cacheGet, cacheSet, CACHE_DURATION } from '../localDb';

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  time: number; // epoch ms
  read: boolean;
  category?: 'system' | 'billing' | 'user' | 'security' | 'other';
};

const CACHE_KEY = 'notifications:list:v1';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async (): Promise<NotificationItem[]> => {
      // Try cache first
      const cached = await cacheGet<NotificationItem[]>(CACHE_KEY);
      if (Array.isArray(cached) && cached.length) {
        return cached;
      }

      // Determine scope
      let scopeParams: any = {};
      try {
        const prof = await authAPI.getProfile();
        const role = (prof as any)?.data?.role;
        const id = (prof as any)?.data?.id;
        if (role && role.toString().toUpperCase().includes('ADMIN')) {
          scopeParams.scope = 'admin';
          scopeParams.ownerId = id;
        }
      } catch (err) {
        console.error('Notifications hooks: profile fetch failed for scope', err);
      }

      // Fetch from API
      const res = await notificationsAPI.list({ ...scopeParams, page: 1, limit: 100 });
      const mapped: NotificationItem[] = (res?.data?.items || []).map((n: any) => ({
        id: n._id,
        title: n.title,
        description: n.description,
        time: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
        read: !!n.read,
        category: n.category,
      })).sort((a: NotificationItem, b: NotificationItem) => b.time - a.time);

      // Save to cache
      await cacheSet(CACHE_KEY, mapped, CACHE_DURATION.STUDENTS);
      return mapped;
    },
    staleTime: CACHE_DURATION.STUDENTS,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useNotificationActions() {
  const qc = useQueryClient();
  const setCache = async (updater: (list: NotificationItem[]) => NotificationItem[]) => {
    const current = (qc.getQueryData(['notifications', 'list']) as NotificationItem[]) || [];
    const next = updater(current);
    qc.setQueryData(['notifications', 'list'], next);
    await cacheSet(CACHE_KEY, next, CACHE_DURATION.STUDENTS);
  };

  const markRead = useMutation({
    mutationFn: async (ids: string[]) => {
      await setCache(list => list.map(i => ids.includes(i.id) ? { ...i, read: true } : i));
      try { await notificationsAPI.markRead(ids); } catch (err) { console.error('Notifications hooks: markRead failed', err); }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); }
  });

  const markUnread = useMutation({
    mutationFn: async (ids: string[]) => {
      await setCache(list => list.map(i => ids.includes(i.id) ? { ...i, read: false } : i));
      try { await notificationsAPI.markUnread(ids); } catch (err) { console.error('Notifications hooks: markUnread failed', err); }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); }
  });

  const remove = useMutation({
    mutationFn: async (ids: string[]) => {
      await setCache(list => list.filter(i => !ids.includes(i.id)));
      try { await notificationsAPI.remove(ids); } catch (err) { console.error('Notifications hooks: remove failed', err); }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); }
  });

  return { markRead, markUnread, remove };
} 