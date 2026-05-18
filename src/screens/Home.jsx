import React, { useState } from 'react';
import { useMW } from '../theme.js';
import { MWPage } from '../components/MWChrome.jsx';
import { MWRow, MWEmpty } from '../components/MWPrimitives.jsx';

function MWStat({ label, value, total, active, onClick, color }) {
  const T = useMW();
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = 22, c = 2 * Math.PI * r;
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '14px 10px 12px',
      background: active ? T.paperRaised : 'transparent',
      border: `1px solid ${active ? color + '44' : T.hairline + '55'}`,
      borderRadius: 14, cursor: 'pointer',
      transition: 'all 200ms',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      color: T.ink,
    }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="28" cy="28" r={r} stroke={T.muted} strokeOpacity="0.25" strokeWidth="2" fill="none" />
          <circle cx="28" cy="28" r={r} stroke={color} strokeWidth="2.4" fill="none"
                  strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
                  style={{ transition: 'stroke-dashoffset 400ms ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Caveat, cursive', fontSize: 26, color, fontWeight: 600,
        }}>{value}</div>
      </div>
      <div style={{ fontSize: 12, color: T.muted, letterSpacing: 1 }}>{label}</div>
    </button>
  );
}

export default function Home({ store, nav }) {
  const T = useMW();
  const { todos, cycleState, stats } = store;
  const [filter, setFilter] = useState('all');
  const filtered = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'undone' ? t.state !== 'done' :
    t.state === 'done'
  );

  return (
    <MWPage>
      <div style={{ paddingTop: 'var(--mw-nav-pad-top)', paddingLeft: 26, paddingRight: 26 }}>
        <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: 2, color: T.muted }}>
          APR · 28 · TUE
        </div>
        <div style={{ fontSize: 28, fontWeight: 400, marginTop: 6, letterSpacing: 0.5, lineHeight: 1.25 }}>
          早安，今天有 <span style={{ fontFamily: 'Caveat, cursive', color: T.accent, fontSize: 36, fontWeight: 600 }}>{stats.undone}</span> 件事
        </div>
      </div>

      <div style={{ padding: '20px 22px 6px', display: 'flex', gap: 8 }}>
        <MWStat label="總共"   value={stats.total}  total={stats.total} active={filter==='all'}    onClick={()=>setFilter('all')}    color={T.ink} />
        <MWStat label="未完成" value={stats.undone} total={stats.total} active={filter==='undone'} onClick={()=>setFilter('undone')} color={T.accent} />
        <MWStat label="已完成" value={stats.done}   total={stats.total} active={filter==='done'}   onClick={()=>setFilter('done')}   color={T.green} />
      </div>

      <div style={{ padding: '8px 26px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: T.muted, fontFamily: '"Geist Mono", monospace', letterSpacing: 1 }}>
          {filtered.length} ITEMS
        </div>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: T.muted }}>
          sort by time ↓
        </div>
      </div>

      <div>
        {filtered.map(t => (
          <MWRow key={t.id} todo={t} onToggle={() => cycleState(t.id)} onOpen={() => nav.go('detail', { id: t.id })} />
        ))}
        {filtered.length === 0 && (
          <MWEmpty caption={filter === 'done' ? 'still no completed tasks' : 'all clear ✶'} sub="點右下 + 開始新增" />
        )}
      </div>

    </MWPage>
  );
}
