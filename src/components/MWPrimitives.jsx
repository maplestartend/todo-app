import React from 'react';
import { useMW } from '../theme.js';
import { CATEGORIES, PRIORITY } from '../data.js';
import MWIcon from './MWIcon.jsx';

export function MWCheck({ state, onClick, size = 24 }) {
  const T = useMW();
  const checked = state === 'done';
  const doing = state === 'doing';
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      style={{
        width: size + 8, height: size + 8,
        background: 'transparent', border: 'none', padding: 4,
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
          <path d="M9 16.5 L 14 21 L 24 10" fill="none" stroke={T.paper}
                strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
                style={{ animation: 'mwDraw 320ms ease-out' }} />
        )}
      </svg>
    </button>
  );
}

export function MWStrike({ children, done }) {
  const T = useMW();
  return (
    <span style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
      {children}
      {done && (
        <svg style={{ position: 'absolute', left: -2, right: -2, top: '52%', width: 'calc(100% + 4px)' }}
             height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
          <path d="M 0 2 C 20 0.5 40 3 60 1.5 C 80 0.5 95 3 100 2"
                stroke={T.ink} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export function MWRow({ todo, onToggle, onOpen }) {
  const T = useMW();
  const cat = CATEGORIES[todo.cat];
  const prio = PRIORITY[todo.prio];
  const catColor = todo.cat === 'work' ? T.workCat : todo.cat === 'life' ? T.lifeCat : T.studyCat;
  const isDone = todo.state === 'done';
  return (
    <div onClick={onOpen} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 26px', cursor: 'pointer',
      borderBottom: `1px dashed ${T.hairline}55`,
      animation: 'mwIn 280ms ease both',
      opacity: isDone ? 0.5 : 1, transition: 'opacity 240ms',
    }}>
      <MWCheck state={todo.state} onClick={onToggle} size={22} />
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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 2 }}>
          <span style={{ fontSize: 11, color: catColor, letterSpacing: 0.5 }}>{cat.label}</span>
          <span style={{ fontSize: 11, color: T.muted, fontFamily: '"Geist Mono", monospace' }}>·</span>
          <span style={{ fontSize: 11, color: T.muted, fontFamily: '"Geist Mono", monospace' }}>{todo.time}</span>
          {todo.subtasks && todo.subtasks.length > 0 && (
            <span style={{ color: T.muted, fontFamily: 'Caveat, cursive', fontSize: 14 }}>
              {todo.subtasks.filter(s => s.done).length}/{todo.subtasks.length}
            </span>
          )}
          {todo.state === 'doing' && (
            <span style={{
              fontSize: 10, color: T.accent,
              padding: '1px 7px', borderRadius: 99,
              border: `1px solid ${T.accent}66`,
            }}>進行中</span>
          )}
        </div>
      </div>
      <MWIcon name="chevR" size={16} stroke={T.muted} sw={1.4} />
    </div>
  );
}

export function MWFab({ onClick }) {
  const T = useMW();
  return (
    <button onClick={onClick} style={{
      position: 'absolute', right: 22, bottom: 'var(--mw-fab-bottom)', zIndex: 30,
      width: 58, height: 58, borderRadius: '50%',
      border: 'none', cursor: 'pointer',
      background: T.ink, color: T.paper,
      boxShadow: T.shadow,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'transform 180ms',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06) rotate(8deg)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0)'}>
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

export function MWSwitch({ on, onChange }) {
  const T = useMW();
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 99,
      background: on ? T.accent : T.hairline + '88',
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background 200ms',
      padding: 0,
    }}>
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
  fontFamily: 'Huninn, sans-serif', fontSize: 15,
});
