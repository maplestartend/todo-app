import React, { useState } from 'react';
import { useMW } from '../theme.js';
import { CATEGORIES } from '../data.js';
import { MWPage, MWNavBar } from '../components/MWChrome.jsx';
import { MWRow, MWEmpty } from '../components/MWPrimitives.jsx';
import { getCategoryColor } from '../utils/categoryColor.js';

export default function Categories({ store, nav }) {
  const T = useMW();
  const [tab, setTab] = useState('work');
  const items = store.todos.filter(t => t.cat === tab);
  const catColor = getCategoryColor(tab, T);

  const header = (
    <>
      <MWNavBar eyebrow="CATEGORIES" title="分類" sticky={false} />

      <div style={{ padding: '4px 22px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {Object.entries(CATEGORIES).map(([k, v]) => {
          const col = getCategoryColor(k, T);
          const cnt = store.todos.filter(t => t.cat === k).length;
          const undone = store.todos.filter(t => t.cat === k && t.state !== 'done').length;
          const sel = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              aria-pressed={sel}
              aria-label={`${v.label} 分類，${cnt} 件任務${undone > 0 ? `，${undone} 件未完成` : ''}`}
              style={{
                padding: '14px 12px', textAlign: 'left', minHeight: 48,
                background: sel ? col : T.paperRaised,
                color: sel ? '#fff' : T.ink,
                border: `1px solid ${sel ? col : T.hairline + '55'}`,
                borderRadius: 14, cursor: 'pointer',
                transition: 'all 200ms',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2,
                  background: sel ? '#fff' : col }}/>
                <span style={{ fontSize: 13, opacity: sel ? 0.95 : 0.85 }}>{v.label}</span>
              </div>
              <div style={{ fontFamily: 'Caveat, cursive', fontSize: 32, fontWeight: 600, lineHeight: 1 }}>
                {cnt}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, fontFamily: '"Geist Mono", monospace' }}>
                {undone} OPEN
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <MWPage scrollKey={`folders-${tab}`} header={header}>
      <div style={{ padding: '8px 26px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: catColor }}/>
        <span style={{ fontSize: 12, color: T.muted, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: '"Geist Mono", monospace' }}>
          {CATEGORIES[tab].label} · {items.length} ITEMS
        </span>
      </div>

      <div>
        {items.map(t => (
          <MWRow key={t.id} todo={t} onToggle={() => store.cycleState(t.id)} onOpen={() => nav.go('detail', { id: t.id })} />
        ))}
        {items.length === 0 && <MWEmpty caption="這個分類還是空的" sub="按 + 新增第一件事" />}
      </div>
    </MWPage>
  );
}
