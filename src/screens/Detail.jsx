import React from 'react';
import { useMW } from '../theme.js';
import { CATEGORIES, PRIORITY } from '../data.js';
import { MWPage, MWNavBar } from '../components/MWChrome.jsx';
import { MWCheck, MWStrike, SectionHead } from '../components/MWPrimitives.jsx';
import MWIcon from '../components/MWIcon.jsx';

export default function Detail({ store, nav, params }) {
  const T = useMW();
  const todo = store.todos.find(t => t.id === params.id);
  if (!todo) return <MWPage><div style={{padding:60}}>找不到任務</div></MWPage>;

  const subtasks = todo.subtasks || [];
  const note = todo.note || '';

  const writeSubtasks = (updater) => {
    const next = typeof updater === 'function' ? updater(subtasks) : updater;
    store.update(todo.id, { subtasks: next });
  };
  const writeNote = (value) => store.update(todo.id, { note: value });

  const cat = CATEGORIES[todo.cat];
  const prio = PRIORITY[todo.prio];
  const catColor = todo.cat === 'work' ? T.workCat : todo.cat === 'life' ? T.lifeCat : T.studyCat;
  const subDone = subtasks.filter(s => s.done).length;
  const pct = subtasks.length
    ? subDone / subtasks.length
    : (todo.state === 'done' ? 1 : todo.state === 'doing' ? 0.5 : 0);

  return (
    <MWPage withTabBar={false}>
      <MWNavBar
        eyebrow={cat.label.toUpperCase()}
        title={todo.title}
        leftIcon="back" onLeft={() => nav.back()}
        rightIcon="edit" onRight={() => nav.go('edit', { mode: 'edit', id: todo.id })}
      />

      <div style={{ margin: '4px 22px 0', padding: '18px 18px 16px',
        background: T.paperRaised, borderRadius: 18,
        border: `1px solid ${T.hairline}55`,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 99,
            background: catColor + '22', color: catColor,
            fontSize: 12, letterSpacing: 0.5,
          }}>{cat.label}</span>
          <span style={{
            padding: '3px 10px', borderRadius: 99,
            background: prio.color + '22', color: prio.color,
            fontSize: 12, letterSpacing: 0.5,
          }}>{todo.prio === 'high' ? '高' : todo.prio === 'mid' ? '中' : '低'}優先</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: T.muted }}>{todo.time}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 8, borderRadius: 99, background: T.hairline + '33', overflow: 'hidden' }}>
            <div style={{ width: `${pct*100}%`, height: '100%', background: T.accent,
              transition: 'width 400ms', borderRadius: 99 }}/>
          </div>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: T.accent, fontWeight: 600 }}>
            {Math.round(pct*100)}%
          </span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          {['todo','doing','done'].map(s => (
            <button key={s} onClick={() => store.setState(todo.id, s)} style={{
              flex: 1, padding: '8px 0',
              border: `1px solid ${todo.state === s ? T.ink : T.hairline + '66'}`,
              background: todo.state === s ? T.ink : 'transparent',
              color: todo.state === s ? T.paper : T.ink,
              borderRadius: 10, cursor: 'pointer', fontSize: 13,
              fontFamily: 'Huninn, sans-serif',
              transition: 'all 180ms',
            }}>
              {s === 'todo' ? '未開始' : s === 'doing' ? '進行中' : '已完成'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="flag" title="子任務" right={`${subDone}/${subtasks.length}`} />
      </div>
      <div style={{ padding: '0 22px' }}>
        {subtasks.map(s => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 6px',
            borderBottom: `1px dashed ${T.hairline}55`,
          }}>
            <MWCheck state={s.done ? 'done' : 'todo'} size={20}
              onClick={() => writeSubtasks(ss => ss.map(x => x.id===s.id ? {...x, done: !x.done} : x))}
            />
            <div style={{ flex: 1, fontSize: 15, opacity: s.done ? 0.5 : 1 }}>
              <MWStrike done={s.done}>{s.title}</MWStrike>
            </div>
          </div>
        ))}
        <button style={{
          marginTop: 8, padding: '8px 6px', background: 'transparent', border: 'none',
          color: T.muted, fontSize: 14, cursor: 'pointer',
          fontFamily: 'Huninn, sans-serif',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
        onClick={() => writeSubtasks(ss => [...ss, { id: Date.now(), title: '新的子項目', done: false }])}>
          <MWIcon name="plus" size={14} stroke={T.muted} sw={1.6} />
          加上子項目
        </button>
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="bell" title="提醒" />
      </div>
      <div style={{ padding: '0 22px' }}>
        <div style={{
          padding: '12px 14px',
          background: T.paperRaised, borderRadius: 12,
          border: `1px solid ${T.hairline}55`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <MWIcon name="calendar" size={20} stroke={T.muted} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14 }}>2026.04.28 · {todo.time}</div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: '"Geist Mono", monospace' }}>30 分鐘前提醒</div>
          </div>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: T.accent }}>edit</span>
        </div>
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="note" title="備註" />
      </div>
      <div style={{ padding: '0 22px 30px' }}>
        <textarea value={note} onChange={e => writeNote(e.target.value)} placeholder="加上一些細節..."
          style={{
            width: '100%', minHeight: 84, boxSizing: 'border-box',
            background: T.paperRaised, border: `1px solid ${T.hairline}55`,
            borderRadius: 12, padding: 14, color: T.ink, outline: 'none',
            fontFamily: 'Huninn, sans-serif', fontSize: 16, lineHeight: 1.5,
            resize: 'none',
          }}/>
      </div>
    </MWPage>
  );
}
