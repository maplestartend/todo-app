/**
 * Helpers for the dueDate / dueTime / repeat / remindBefore Todo fields.
 * All dates here are *local* Date objects — server-side sync is out of
 * scope for the current personal-use phase.
 */

export function parseDue(todo) {
  if (!todo.dueDate) return null;
  const [y, m, d] = todo.dueDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  if (todo.dueTime) {
    const [hh, mm] = todo.dueTime.split(':').map(Number);
    return new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0);
  }
  // Date-only: treat as end of day so it doesn't read as "overdue at midnight"
  return new Date(y, m - 1, d, 23, 59, 0, 0);
}

const MS = { day: 86400000, hour: 3600000, min: 60000 };

export function formatRelative(date, now = new Date()) {
  if (!date) return '';
  const diff = date.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const sign = diff >= 0 ? '' : '-';
  if (abs < MS.hour) {
    const mins = Math.max(1, Math.round(abs / MS.min));
    return diff >= 0 ? `${mins} 分內` : `逾期 ${mins} 分`;
  }
  if (abs < MS.day) {
    const hrs = Math.round(abs / MS.hour);
    return diff >= 0 ? `${hrs} 小時內` : `逾期 ${hrs} 小時`;
  }
  const days = Math.round(abs / MS.day);
  if (diff >= 0 && days === 0) return '今天';
  if (diff >= 0 && days === 1) return '明天';
  return diff >= 0 ? `${days} 天內` : `逾期 ${days} 天`;
}

export function formatDueLabel(todo) {
  if (!todo.dueDate) return '';
  const [y, m, d] = todo.dueDate.split('-');
  const head = `${y}.${m}.${d}`;
  return todo.dueTime ? `${head} · ${todo.dueTime}` : head;
}

export function isOverdue(todo, now = new Date()) {
  if (todo.state === 'done' || !todo.dueDate) return false;
  const due = parseDue(todo);
  return due && due.getTime() < now.getTime();
}

export function isDueToday(todo, now = new Date()) {
  if (!todo.dueDate) return false;
  const due = parseDue(todo);
  if (!due) return false;
  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  );
}

/**
 * Given a Todo with `repeat !== 'none'`, return the next dueDate (YYYY-MM-DD)
 * after both its current dueDate AND today. Returns '' if `repeat === 'none'`.
 *
 * Iterates the cadence until past today so completing an overdue recurring
 * task doesn't immediately spawn another already-overdue instance.
 */
export function nextDueDate(todo, from = null) {
  if (!todo.repeat || todo.repeat === 'none') return '';
  const base = from || (todo.dueDate ? parseDue(todo) : new Date());
  if (!base) return '';
  const d = new Date(base);
  // Strip time; only the date part advances.
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const step = () => {
    if (todo.repeat === 'daily') d.setDate(d.getDate() + 1);
    else if (todo.repeat === 'weekly') d.setDate(d.getDate() + 7);
    else if (todo.repeat === 'monthly') d.setMonth(d.getMonth() + 1);
  };
  // Always advance at least once, then keep advancing until past today.
  step();
  while (d.getTime() <= today.getTime()) step();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Compute when the reminder notification should fire for a Todo.
 * Returns a Date (in the future or past) or null when reminders are off.
 */
export function reminderAt(todo) {
  if (todo.remindBefore == null) return null;
  const due = parseDue(todo);
  if (!due) return null;
  return new Date(due.getTime() - todo.remindBefore * MS.min);
}
