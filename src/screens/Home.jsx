import React, { useMemo, useState } from 'react';
import { useMW } from '../theme.js';
import { MWPage } from '../components/MWChrome.jsx';
import { MWRow, MWEmpty } from '../components/MWPrimitives.jsx';
import { isOverdue, isDueToday, parseDue } from '../utils/dueDate.js';

function MWStat({ label, value, total, active, onClick, color }) {
  const T = useMW();
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = 22, c = 2 * Math.PI * r;
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label} ${value}`}
      style={{
        flex: 1, padding: '14px 10px 12px',
        background: active ? color + '14' : 'transparent',
        border: `1.5px solid ${active ? color : T.hairline + '55'}`,
        borderRadius: 14, cursor: 'pointer',
        transition: 'background 200ms, border-color 200ms, transform 200ms',
        transform: active ? 'translateY(-1px)' : 'translateY(0)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        color: T.ink, minHeight: 48,
      }}
    >
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
      <div style={{
        fontSize: 12, letterSpacing: 1,
        color: active ? color : T.muted,
        fontWeight: active ? 600 : 400,
        transition: 'color 200ms',
      }}>{label}</div>
    </button>
  );
}

function FocusChip({ label, count, color, active, onClick }) {
  const T = useMW();
  if (count === 0 && !active) return null;
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label} ${count} 件`}
      style={{
        flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', minHeight: 32, borderRadius: 99,
        background: active ? color : color + '18',
        color: active ? T.paper : color,
        border: `1px solid ${active ? color : color + '44'}`,
        fontSize: 12, fontFamily: 'Huninn, sans-serif', fontWeight: 600,
        letterSpacing: 0.5, cursor: 'pointer',
        transition: 'all 160ms',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span>{label}</span>
      <span style={{
        fontFamily: '"Geist Mono", monospace', fontSize: 11,
        padding: '0 6px', borderRadius: 99,
        background: active ? color + '88' : T.paper + '88',
        color: active ? T.paper : color,
        minWidth: 16, textAlign: 'center',
      }}>{count}</span>
    </button>
  );
}

const WEEK = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTH = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function GreetingDate({ now }) {
  return `${MONTH[now.getMonth()]} · ${now.getDate()} · ${WEEK[now.getDay()]}`;
}

export default function Home({ store, nav }) {
  const T = useMW();
  const { todos, cycleState, stats } = store;
  const [filter, setFilter] = useState('all'); // all | undone | done | today | overdue

  // Single now / per-row status computation per render — was previously
  // calling new Date() ~4× per row.
  const { now, decorated, todayCount, overdueCount } = useMemo(() => {
    const n = new Date();
    let today = 0, overdue = 0;
    const dec = todos.map(t => {
      const isDone = t.state === 'done';
      const ov = !isDone && isOverdue(t, n);
      const td = !isDone && !ov && isDueToday(t, n);
      if (ov) overdue++;
      else if (td) today++;
      return { t, ov, td };
    });
    return { now: n, decorated: dec, todayCount: today, overdueCount: overdue };
  }, [todos]);

  // Filter then sort. Sort: overdue oldest first → today by time → future by
  // dueDate → undated last. Stable for items with no dueDate so they keep
  // insertion order.
  const visible = useMemo(() => {
    const match = (entry) => {
      const { t, ov, td } = entry;
      if (filter === 'all')     return true;
      if (filter === 'undone')  return t.state !== 'done';
      if (filter === 'done')    return t.state === 'done';
      if (filter === 'today')   return td || ov; // "今天 + 逾期" both deserve attention
      if (filter === 'overdue') return ov;
      return true;
    };
    const out = decorated.filter(match);
    out.sort((a, b) => {
      const da = parseDue(a.t)?.getTime();
      const db = parseDue(b.t)?.getTime();
      if (da == null && db == null) return 0;
      if (da == null) return 1;
      if (db == null) return -1;
      return da - db;
    });
    return out;
  }, [decorated, filter]);

  const showChips =
    todayCount > 0 || overdueCount > 0 ||
    filter === 'today' || filter === 'overdue';

  const header = (
    <>
      <div style={{ paddingTop: 'var(--mw-nav-pad-top)', paddingLeft: 26, paddingRight: 26 }}>
        <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: 2, color: T.muted }}>
          <GreetingDate now={now} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 400, marginTop: 6, letterSpacing: 0.5, lineHeight: 1.25 }}>
          {overdueCount > 0
            ? <>有 <span style={{ fontFamily: 'Caveat, cursive', color: T.accent, fontSize: 36, fontWeight: 600 }}>{overdueCount}</span> 件逾期了</>
            : todayCount > 0
              ? <>今天有 <span style={{ fontFamily: 'Caveat, cursive', color: T.accent, fontSize: 36, fontWeight: 600 }}>{todayCount}</span> 件要做</>
              : <>今天有 <span style={{ fontFamily: 'Caveat, cursive', color: T.accent, fontSize: 36, fontWeight: 600 }}>{stats.undone}</span> 件事</>}
        </div>
      </div>

      <div style={{ padding: '20px 22px 6px', display: 'flex', gap: 8 }}>
        <MWStat label="總共"   value={stats.total}  total={stats.total} active={filter==='all'}    onClick={()=>setFilter('all')}    color={T.ink} />
        <MWStat label="未完成" value={stats.undone} total={stats.total} active={filter==='undone'} onClick={()=>setFilter('undone')} color={T.accent} />
        <MWStat label="已完成" value={stats.done}   total={stats.total} active={filter==='done'}   onClick={()=>setFilter('done')}   color={T.green} />
      </div>

      {showChips && (
        <div style={{
          padding: '4px 22px 12px', display: 'flex', gap: 6,
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <FocusChip
            label="逾期"
            count={overdueCount}
            color={T.accent}
            active={filter === 'overdue'}
            onClick={() => setFilter(filter === 'overdue' ? 'all' : 'overdue')}
          />
          <FocusChip
            label="今天"
            count={todayCount + overdueCount}
            color={T.green}
            active={filter === 'today'}
            onClick={() => setFilter(filter === 'today' ? 'all' : 'today')}
          />
        </div>
      )}
    </>
  );

  return (
    <MWPage scrollKey="home" header={header}>
      <div style={{ padding: '8px 26px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: T.muted, fontFamily: '"Geist Mono", monospace', letterSpacing: 1 }}>
          {visible.length} ITEMS
        </div>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: T.muted }}>
          sort by due ↑
        </div>
      </div>

      <div>
        {visible.map(({ t, ov, td }) => (
          <MWRow
            key={t.id}
            todo={t}
            onToggle={() => cycleState(t.id)}
            onOpen={() => nav.go('detail', { id: t.id })}
            overdue={ov}
            today={td}
            now={now}
          />
        ))}
        {visible.length === 0 && (
          <MWEmpty
            caption={
              filter === 'done'    ? 'still no completed tasks' :
              filter === 'overdue' ? '沒有逾期的任務 ✶' :
              filter === 'today'   ? '今天沒有要做的事 ✶' :
                                     'all clear ✶'
            }
            sub="點右下 + 開始新增"
          />
        )}
      </div>
    </MWPage>
  );
}
