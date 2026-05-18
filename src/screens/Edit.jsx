import React, { useState } from 'react';
import { useMW } from '../theme.js';
import { CATEGORIES, PRIORITY } from '../data.js';
import { MWPage, MWNavBar } from '../components/MWChrome.jsx';
import { SectionHead, inputBase } from '../components/MWPrimitives.jsx';

export default function Edit({ store, nav, params }) {
  const T = useMW();
  const isEdit = params.mode === 'edit';
  const existing = isEdit ? store.todos.find(t => t.id === params.id) : null;
  const [title, setTitle] = useState(existing?.title || '');
  const [cat, setCat] = useState(existing?.cat || 'work');
  const [prio, setPrio] = useState(existing?.prio || 'mid');
  const [time, setTime] = useState(existing?.time || '');
  const [date, setDate] = useState('2026.04.28');
  const [note, setNote] = useState('');

  const save = () => {
    if (!title.trim()) return;
    if (isEdit) {
      store.update(existing.id, { title: title.trim(), cat, prio, time: time || '今天' });
      nav.back();
    } else {
      store.add({ title: title.trim(), cat, prio, time: time || '今天' });
      nav.set('home');
    }
  };

  return (
    <MWPage withTabBar={false}>
      <MWNavBar
        eyebrow={isEdit ? 'EDIT TASK' : 'NEW TASK'}
        title={isEdit ? '編輯任務' : '新增一件事'}
        leftIcon="close" onLeft={() => nav.back()}
      />

      <div style={{ padding: '4px 22px 12px' }}>
        <input
          autoFocus value={title} onChange={e => setTitle(e.target.value)}
          placeholder="想做什麼？"
          style={{
            width: '100%', boxSizing: 'border-box',
            border: 'none', borderBottom: `1.5px dashed ${T.hairline}`,
            background: 'transparent', outline: 'none',
            fontSize: 22, padding: '14px 0',
            fontFamily: 'Huninn, sans-serif', color: T.ink,
          }}
        />
      </div>

      <div style={{ padding: '12px 26px 6px' }}>
        <SectionHead icon="folder" title="分類" />
      </div>
      <div style={{ padding: '0 22px', display: 'flex', gap: 8 }}>
        {Object.entries(CATEGORIES).map(([k, v]) => {
          const col = k === 'work' ? T.workCat : k === 'life' ? T.lifeCat : T.studyCat;
          const sel = cat === k;
          return (
            <button key={k} onClick={() => setCat(k)} style={{
              flex: 1, padding: '12px 10px',
              background: sel ? col : 'transparent',
              color: sel ? '#fff' : T.ink,
              border: `1px solid ${sel ? col : T.hairline + '88'}`,
              borderRadius: 12, cursor: 'pointer', fontSize: 15,
              fontFamily: 'Huninn, sans-serif', transition: 'all 160ms',
            }}>{v.label}</button>
          );
        })}
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="flag" title="優先順序" />
      </div>
      <div style={{ padding: '0 22px', display: 'flex', gap: 8 }}>
        {Object.entries(PRIORITY).map(([k, v]) => {
          const sel = prio === k;
          return (
            <button key={k} onClick={() => setPrio(k)} style={{
              flex: 1, padding: '12px 10px',
              background: sel ? v.color : 'transparent',
              color: sel ? '#fff' : T.ink,
              border: `1px solid ${sel ? v.color : T.hairline + '88'}`,
              borderRadius: 12, cursor: 'pointer', fontSize: 15,
              fontFamily: 'Huninn, sans-serif', transition: 'all 160ms',
            }}>{v.label}</button>
          );
        })}
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="bell" title="提醒" />
      </div>
      <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input value={date} onChange={e => setDate(e.target.value)} placeholder="日期" style={inputBase(T)} />
        <input value={time} onChange={e => setTime(e.target.value)} placeholder="時間" style={inputBase(T)} />
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="note" title="備註" />
      </div>
      <div style={{ padding: '0 22px' }}>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="加上一些細節..."
          style={{ ...inputBase(T), minHeight: 80, resize: 'none', fontSize: 14, lineHeight: 1.5 }}/>
      </div>

      <div style={{ flex: 1 }}/>
      <div style={{ padding: '16px 22px 32px' }}>
        <button onClick={save} style={{
          width: '100%', padding: '16px',
          border: 'none', borderRadius: 14,
          background: T.ink, color: T.paper,
          fontFamily: 'Huninn, sans-serif', fontSize: 17,
          cursor: 'pointer', boxShadow: T.shadow,
        }}>
          {isEdit ? '儲存變更' : '加進清單 ✦'}
        </button>
        {isEdit && (
          <button onClick={() => { store.remove(existing.id); nav.back(); }} style={{
            width: '100%', padding: '12px', marginTop: 8,
            border: 'none', borderRadius: 12,
            background: 'transparent', color: T.accent,
            fontFamily: 'Huninn, sans-serif', fontSize: 14,
            cursor: 'pointer',
          }}>刪除任務</button>
        )}
      </div>
    </MWPage>
  );
}
