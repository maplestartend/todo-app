import { useEffect, useMemo, useState } from 'react';
import { INITIAL_TODOS } from './data.js';

const STORAGE_KEY = 'mw_todos_v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return INITIAL_TODOS;
}

export function useStore() {
  const [todos, setTodos] = useState(loadInitial);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); } catch {}
  }, [todos]);

  const cycleState = (id) => setTodos(ts => ts.map(t => t.id === id
    ? { ...t, state: t.state === 'todo' ? 'doing' : t.state === 'doing' ? 'done' : 'todo' }
    : t));

  const setState = (id, state) => setTodos(ts => ts.map(t => t.id === id ? { ...t, state } : t));

  const add = (todo) => setTodos(ts => [
    { id: Date.now(), state: 'todo', subtasks: [], note: '', ...todo },
    ...ts,
  ]);

  const update = (id, patch) => setTodos(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));

  const remove = (id) => setTodos(ts => ts.filter(t => t.id !== id));

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter(t => t.state === 'done').length;
    return { total, done, undone: total - done };
  }, [todos]);

  return { todos, cycleState, setState, add, update, remove, stats };
}
