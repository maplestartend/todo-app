import { useEffect, useRef } from 'react';
import { parseDue, reminderAt } from '../utils/dueDate.js';

const POLL_MS = 60_000;

const supported = typeof window !== 'undefined' && 'Notification' in window;

export function notificationStatus() {
  if (!supported) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
}

/**
 * Request the user grant notification permission. Must be triggered by a
 * user gesture (button click). Returns the resulting permission state.
 */
export async function requestNotificationPermission() {
  if (!supported) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

/**
 * Fires a Notification when a Todo's reminderAt() time is reached. Updates
 * the Todo's lastNotifiedAt so it doesn't re-fire on next poll / refresh.
 *
 * Foreground-only: relies on `new Notification(...)` (works while the PWA
 * is open / focused). True background reminders need a Service Worker push
 * channel, which is out of scope for this phase.
 */
export function useReminders(store, enabled) {
  const tickRef = useRef(null);
  const lastRef = useRef(store);
  lastRef.current = store;

  useEffect(() => {
    if (!enabled || !supported || Notification.permission !== 'granted') return;

    const tick = () => {
      const now = new Date();
      const todos = lastRef.current.todos;
      for (const t of todos) {
        if (t.state === 'done' || t.remindBefore == null) continue;
        const fireAt = reminderAt(t);
        if (!fireAt) continue;
        const fireMs = fireAt.getTime();
        if (fireMs > now.getTime()) continue; // future
        // Skip if already notified for this due instance (compare with current
        // dueDate to allow re-fire after recurring advance).
        const stamp = `${t.dueDate}T${t.dueTime || ''}`;
        if (t.lastNotifiedAt === stamp) continue;
        // Don't fire ancient overdue reminders (> 24h late) to avoid spam on
        // a fresh app open.
        if (now.getTime() - fireMs > 24 * 60 * 60_000) {
          lastRef.current.update(t.id, { lastNotifiedAt: stamp });
          continue;
        }
        const due = parseDue(t);
        const body = due
          ? `預定 ${due.getHours().toString().padStart(2, '0')}:${due.getMinutes().toString().padStart(2, '0')}`
          : '';
        try {
          new Notification(t.title, { body, tag: `mw-${t.id}`, silent: false });
          lastRef.current.update(t.id, { lastNotifiedAt: stamp });
        } catch {}
      }
    };

    tick();
    tickRef.current = setInterval(tick, POLL_MS);
    return () => clearInterval(tickRef.current);
  }, [enabled]);
}
