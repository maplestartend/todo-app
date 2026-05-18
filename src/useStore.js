import { useMemo, useState } from 'react';
import { INITIAL_TODOS } from './data.js';

export function useStore() {
  const [todos, setTodos] = useState(INITIAL_TODOS);

  const cycleState = (id) => setTodos(ts => ts.map(t => t.id === id
    ? { ...t, state: t.state === 'todo' ? 'doing' : t.state === 'doing' ? 'done' : 'todo' }
    : t));

  const setState = (id, state) => setTodos(ts => ts.map(t => t.id === id ? { ...t, state } : t));

  const add = (todo) => setTodos(ts => [
    { id: Date.now(), state: 'todo', sub: 0, subDone: 0, ...todo },
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
