import React, { useState } from 'react';
import { useMW } from '../theme.js';
import { MWPage, MWNavBar } from '../components/MWChrome.jsx';
import { MWRow, MWEmpty, SectionHead } from '../components/MWPrimitives.jsx';
import MWIcon from '../components/MWIcon.jsx';

export default function Search({ store, nav }) {
  const T = useMW();
  const [q, setQ] = useState('');
  const RECENT = ['會議', '報告', '日文', '牙醫'];
  const SUGG = [
    { label: '今天到期', icon: 'calendar' },
    { label: '高優先', icon: 'flag' },
    { label: '進行中', icon: 'bell' },
  ];
  const results = q.trim() ? store.todos.filter(t => t.title.includes(q.trim())) : [];

  return (
    <MWPage>
      <MWNavBar eyebrow="SEARCH" title="搜尋" />
      <div style={{ padding: '4px 22px 14px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px',
          background: T.paperRaised, border: `1px solid ${T.hairline}55`,
          borderRadius: 14,
        }}>
          <MWIcon name="search" size={18} stroke={T.muted} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="搜尋任務、備註、分類..."
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'Huninn, sans-serif', fontSize: 16, color: T.ink,
            }}/>
          {q && (
            <button onClick={() => setQ('')} style={{
              border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
            }}>
              <MWIcon name="close" size={16} stroke={T.muted} sw={1.4}/>
            </button>
          )}
        </div>
      </div>

      {!q.trim() && (
        <>
          <div style={{ padding: '4px 26px 8px' }}>
            <SectionHead icon="bell" title="快速篩選" />
          </div>
          <div style={{ padding: '0 22px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUGG.map((s, i) => (
              <button key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 99,
                background: T.paperRaised, color: T.ink,
                border: `1px solid ${T.hairline}55`,
                fontFamily: 'Huninn, sans-serif', fontSize: 13,
                cursor: 'pointer',
              }}>
                <MWIcon name={s.icon} size={14} stroke={T.ink} sw={1.5}/>
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '4px 26px 8px' }}>
            <SectionHead icon="note" title="最近搜尋" />
          </div>
          <div style={{ padding: '0 22px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {RECENT.map(r => (
              <button key={r} onClick={() => setQ(r)} style={{
                padding: '6px 12px', borderRadius: 99,
                background: 'transparent', color: T.muted,
                border: `1px dashed ${T.hairline}88`,
                fontFamily: 'Caveat, cursive', fontSize: 16, cursor: 'pointer',
              }}>{r}</button>
            ))}
          </div>
        </>
      )}

      {q.trim() && (
        <div className="mw-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ padding: '4px 26px 8px' }}>
            <div style={{ fontSize: 12, color: T.muted, fontFamily: '"Geist Mono", monospace', letterSpacing: 1 }}>
              {results.length} RESULTS · "{q}"
            </div>
          </div>
          {results.map(t => (
            <MWRow key={t.id} todo={t} onToggle={() => store.cycleState(t.id)} onOpen={() => nav.go('detail', { id: t.id })} />
          ))}
          {results.length === 0 && <MWEmpty caption="什麼都沒找到" sub="換個關鍵字試試" />}
        </div>
      )}
    </MWPage>
  );
}
