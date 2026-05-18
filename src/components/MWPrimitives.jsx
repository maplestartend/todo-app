import React, { useRef } from 'react';
import { useMW } from '../theme.js';
import { CATEGORIES, PRIORITY } from '../data.js';
import { getCategoryColor, STATE_LABEL } from '../utils/categoryColor.js';
import { isOverdue, isDueToday, parseDue } from '../utils/dueDate.js';
import MWIcon from './MWIcon.jsx';

// Compact "when" label for a list row. Prefers dueDate over the legacy
// free-text `time` field so a 7-day-away task no longer reads as just "14:30".
function formatRowWhen(todo, now) {
  if (todo.dueDate) {
    const due = parseDue(todo);
    if (!due) return todo.time || '';
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((dueDay - today) / 86400000);
    const t = todo.dueTime ? ` ${todo.dueTime}` : '';
    if (dayDiff < -1) return `逾期 ${-dayDiff} 天`;
    if (dayDiff === -1) return `昨天${t}`;
    if (dayDiff === 0) return `今天${t}`;
    if (dayDiff === 1) return `明天${t}`;
    if (dayDiff < 7) return `${dayDiff} 天內${t}`;
    return `${due.getMonth() + 1}/${due.getDate()}${t}`;
  }
  return todo.time || '';
}

export function MWCheck({ state, onClick, size = 24, label }) {
  const T = useMW();
  const checked = state === 'done';
  const doing = state === 'doing';
  const aria = [label, STATE_LABEL[state]].filter(Boolean).join(' · ');
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      aria-label={aria || STATE_LABEL[state]}
      aria-pressed={checked}
      style={{
        width: 44, height: 44,
        background: 'transparent', border: 'none', padding: 0,
        cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ overflow: 'visible' }}>
        <path
          d="M5.2 4.5 C 4.6 9 4.4 18 5.0 27.5 C 11 28.1 22 28.0 27.6 27.3 C 28.1 21 28.2 11 27.4 4.6 C 21 4.0 11 4.1 5.2 4.5 Z"
          fill={checked ? T.ink : 'transparent'}
          stroke={T.ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
          style={{ transition: 'fill 200ms' }}
        />
        {doing && (
          <g>
            <line x1="9" y1="22" x2="22" y2="9" stroke={T.ink} strokeWidth="1.4" strokeLinecap="round" />
            <line x1="14" y1="24" x2="24" y2="14" stroke={T.ink} strokeWidth="1.4" strokeLinecap="round" />
            <line x1="8" y1="17" x2="17" y2="8" stroke={T.ink} strokeWidth="1.4" strokeLinecap="round" />
          </g>
        )}
        {checked && (
          <g style={{ animation: 'mwCheckPop 340ms cubic-bezier(0.32, 0.72, 0, 1)', transformOrigin: '16px 16px' }}>
            <path d="M9 16.5 L 14 21 L 24 10" fill="none" stroke={T.paper}
                  strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </button>
  );
}

export function MWStrike({ children, done }) {
  const T = useMW();
  // In dark mode the ink is light cream — the strike is far more readable
  // when drawn in the accent color than in ink (which used to be black in light
  // mode but light in dark mode and so vanished against the dark paper).
  const strokeColor = T.isDark ? T.accent : T.ink;
  return (
    <span style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
      {children}
      {done && (
        <svg style={{ position: 'absolute', left: -2, right: -2, top: '52%', width: 'calc(100% + 4px)' }}
             height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
          <path d="M 0 2 C 20 0.5 40 3 60 1.5 C 80 0.5 95 3 100 2"
                stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export function MWRow({ todo, onToggle, onOpen, overdue, today, now }) {
  const T = useMW();
  const cat = CATEGORIES[todo.cat];
  const prio = PRIORITY[todo.prio];
  const catColor = getCategoryColor(todo.cat, T);
  const isDone = todo.state === 'done';
  // Accept memoized flags from parent; fall back to per-row compute so
  // standalone uses still work.
  const ov = overdue != null ? overdue : (!isDone && isOverdue(todo));
  const td = today   != null ? today   : (!isDone && !ov && isDueToday(todo));
  const whenLabel = formatRowWhen(todo, now || new Date());

  // Track touch start so horizontal pan / long press does not fire onOpen.
  const press = useRef({ x: 0, y: 0, t: 0, valid: false });
  const onPointerDown = (e) => {
    press.current = {
      x: e.clientX, y: e.clientY, t: Date.now(), valid: true,
    };
  };
  const onPointerMove = (e) => {
    if (!press.current.valid) return;
    const dx = Math.abs(e.clientX - press.current.x);
    const dy = Math.abs(e.clientY - press.current.y);
    if (dx > 8 || dy > 12) press.current.valid = false;
  };
  const onPointerCancel = () => { press.current.valid = false; };
  const onClick = () => {
    const dt = Date.now() - press.current.t;
    if (!press.current.valid || dt > 600) return;
    onOpen && onOpen();
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen && onOpen();
    }
  };

  const stateLabelExtra = ov ? '逾期' : td ? '今天' : '';
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerCancel={onPointerCancel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={[todo.title, cat.label, STATE_LABEL[todo.state], stateLabelExtra].filter(Boolean).join(' · ')}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px 14px 22px', cursor: 'pointer',
        borderBottom: `1px dashed ${T.hairline}55`,
        animation: 'mwIn 280ms ease both',
        opacity: isDone ? 0.55 : 1, transition: 'opacity 240ms',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      <MWCheck state={todo.state} onClick={onToggle} size={22} label={todo.title} />
      <div style={{
        width: 3, alignSelf: 'stretch', borderRadius: 2,
        background: prio.color,
        opacity: todo.prio === 'high' ? 0.9 : todo.prio === 'mid' ? 0.55 : 0.25,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          color: T.ink,
        }}>
          <MWStrike done={isDone}>{todo.title}</MWStrike>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2, flexWrap: 'nowrap', minWidth: 0 }}>
          <span style={{ fontSize: 11, color: catColor, letterSpacing: 0.5, flexShrink: 0 }}>{cat.label}</span>
          {whenLabel && (
            <>
              <span style={{ fontSize: 11, color: T.muted, flexShrink: 0 }}>·</span>
              <span
                style={{
                  fontSize: 11, fontFamily: '"Geist Mono", monospace', flexShrink: 0,
                  color: ov ? T.accent : td ? T.green : T.muted,
                  fontWeight: (ov || td) ? 600 : 400,
                }}
              >{whenLabel}</span>
            </>
          )}
          {todo.subtasks && todo.subtasks.length > 0 && (
            <span style={{ color: T.muted, fontFamily: 'Caveat, cursive', fontSize: 14, flexShrink: 0 }}>
              {todo.subtasks.filter(s => s.done).length}/{todo.subtasks.length}
            </span>
          )}
          {todo.state === 'doing' && (
            <span style={{
              fontSize: 10, color: T.accent,
              padding: '1px 7px', borderRadius: 99, flexShrink: 0,
              border: `1px solid ${T.accent}66`,
            }}>進行中</span>
          )}
          {todo.repeat && todo.repeat !== 'none' && (
            <span aria-label="重複任務" style={{ display: 'inline-flex', flexShrink: 0 }}>
              <MWIcon name="archive" size={11} stroke={T.muted} sw={1.6} />
            </span>
          )}
        </div>
      </div>
      <MWIcon name="chevR" size={16} stroke={T.muted} sw={1.4} />
    </div>
  );
}

export function MWFab({ onClick, label = '新增任務' }) {
  const T = useMW();
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position: 'absolute', right: 22, bottom: 'var(--mw-fab-bottom)', zIndex: 30,
        width: 58, height: 58, borderRadius: '50%',
        border: 'none', cursor: 'pointer',
        background: T.ink, color: T.paper,
        boxShadow: T.shadow,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 180ms',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06) rotate(8deg)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
    >
      <MWIcon name="plus" size={26} stroke={T.paper} sw={2} />
    </button>
  );
}

export function MWEmpty({ caption, sub }) {
  const T = useMW();
  return (
    <div style={{ padding: '60px 22px', textAlign: 'center' }}>
      <svg width="120" height="80" viewBox="0 0 120 80" style={{ marginBottom: 12 }}>
        <path d="M20 60 C 30 30, 90 30, 100 60" stroke={T.muted} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 4" opacity="0.6"/>
        <circle cx="60" cy="35" r="14" stroke={T.muted} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M54 35 L 58 39 L 66 31" stroke={T.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontFamily: 'Caveat, cursive', fontSize: 24, color: T.muted }}>{caption}</div>
      {sub && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function SectionHead({ icon, title, right }) {
  const T = useMW();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <MWIcon name={icon} size={16} stroke={T.muted} sw={1.6}/>
      <div style={{ fontSize: 12, color: T.muted, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: '"Geist Mono", monospace' }}>{title}</div>
      <div style={{ flex: 1 }}/>
      {right && <div style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: T.muted }}>{right}</div>}
    </div>
  );
}

export function MWSwitch({ on, onChange, label }) {
  const T = useMW();
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={!!on}
      aria-label={label}
      style={{
        width: 44, height: 26, borderRadius: 99,
        background: on ? T.accent : T.hairline + '88',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 200ms',
        padding: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: 99,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        transition: 'left 220ms',
      }}/>
    </button>
  );
}

export const inputBase = (T) => ({
  width: '100%', boxSizing: 'border-box',
  background: T.paperRaised, border: `1px solid ${T.hairline}55`,
  borderRadius: 12, padding: 12, color: T.ink, outline: 'none',
  fontFamily: 'Huninn, sans-serif', fontSize: 16,
});
