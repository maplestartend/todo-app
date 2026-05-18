import { useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_TODOS } from './data.js';

const STORAGE_KEY = 'mw_todos';
const SCHEMA_VERSION = 2;
const WRITE_DEBOUNCE_MS = 400;

/**
 * Storage payload shape: `{ version: number, todos: Todo[] }`.
 *
 * v1 was the bare array under key `mw_todos_v1`. v2 wraps it so future
 * field additions / renames can run a migration without losing data.
 */

function migrateFromV1() {
  try {
    const legacy = localStorage.getItem('mw_todos_v1');
    if (!legacy) return null;
    const parsed = JSON.parse(legacy);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.todos)) return parsed.todos;
    }
    const legacy = migrateFromV1();
    if (legacy) return legacy;
  } catch (err) {
    console.warn('[useStore] load failed', err);
  }
  return INITIAL_TODOS;
}

function writePayload(todos) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: SCHEMA_VERSION, todos })
    );
  } catch (err) {
    console.warn('[useStore] write failed (quota / private mode?)', err);
  }
}

export function useStore() {
  const [todos, setTodos] = useState(loadInitial);
  const writeTimer = useRef(null);
  const latestTodos = useRef(todos);
  latestTodos.current = todos;

  // Debounce writes so toggle/add bursts don't pay JSON.stringify each time.
  useEffect(() => {
    clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => writePayload(todos), WRITE_DEBOUNCE_MS);
    return () => clearTimeout(writeTimer.current);
  }, [todos]);

  // Flush pending write on unload (refresh / close) so debounced changes
  // are never lost.
  useEffect(() => {
    const flush = () => {
      if (writeTimer.current) {
        clearTimeout(writeTimer.current);
        writePayload(latestTodos.current);
      }
    };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  // Cross-tab sync: when another tab writes the storage key, mirror it here.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && Array.isArray(parsed.todos)) setTodos(parsed.todos);
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
    const doing = todos.filter(t => t.state === 'doing').length;
    return { total, done, doing, undone: total - done };
  }, [todos]);

  return { todos, cycleState, setState, add, update, remove, stats };
}
