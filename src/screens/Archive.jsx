import React from 'react';
import { useMW } from '../theme.js';
import { MWPage, MWNavBar } from '../components/MWChrome.jsx';
import { MWRow, MWEmpty } from '../components/MWPrimitives.jsx';

export default function Archive({ store, nav }) {
  const T = useMW();
  const done = store.todos.filter(t => t.state === 'done');

  const groups = [
    { label: '本週', items: done },
  ];

  const streak = [1,1,1,0,1,1,0,1,1,1,1,1,0,1];

  return (
    <MWPage scrollKey="archive">
      <MWNavBar eyebrow="DONE" title="完成的事" />

      <div style={{ margin: '4px 22px 12px', padding: '14px 16px',
        background: T.paperRaised, borderRadius: 16,
        border: `1px solid ${T.hairline}55`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 36, fontWeight: 600, color: T.accent }}>
            {done.length}
          </span>
          <span style={{ fontSize: 13, color: T.muted }}>件已歸檔</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, color: T.muted, letterSpacing: 1 }}>
            LAST 14 DAYS
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 12, alignItems: 'flex-end', height: 36 }}>
          {streak.map((s, i) => (
            <div key={i} style={{
              flex: 1, height: Math.max(8, s * 28),
              background: s ? T.accent : T.hairline + '55',
              borderRadius: 3,
              opacity: s ? 0.4 + (i / streak.length) * 0.6 : 0.4,
            }}/>
          ))}
        </div>
      </div>

      <div>
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ padding: '8px 26px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: T.muted, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: '"Geist Mono", monospace' }}>
                {g.label} · {g.items.length}
              </span>
              <div style={{ flex: 1, borderTop: `1px dashed ${T.hairline}66` }}/>
            </div>
            {g.items.map(t => (
              <MWRow key={t.id} todo={t} onToggle={() => store.cycleState(t.id)} onOpen={() => nav.go('detail', { id: t.id })} />
            ))}
          </div>
        ))}
        {done.length === 0 && <MWEmpty caption="還沒歸檔任何事" sub="完成一件事就會出現在這裡" />}
      </div>
    </MWPage>
  );
}
