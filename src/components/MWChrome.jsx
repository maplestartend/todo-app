import React from 'react';
import { useMW } from '../theme.js';
import MWIcon from './MWIcon.jsx';

export const iconBtn = (T) => ({
  width: 38, height: 38, borderRadius: 12,
  background: 'transparent', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: T.ink, padding: 0, flexShrink: 0,
});

export function MWNavBar({ title, eyebrow, leftIcon, onLeft, rightIcon, onRight, large = false }) {
  const T = useMW();
  return (
    <div style={{
      paddingTop: 54, paddingLeft: 22, paddingRight: 22, paddingBottom: large ? 6 : 12,
      display: 'flex', alignItems: 'flex-start', gap: 8,
      color: T.ink,
    }}>
      {leftIcon && (
        <button onClick={onLeft} aria-label="back" style={iconBtn(T)}>
          <MWIcon name={leftIcon} size={22} stroke={T.ink} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div style={{
            fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: 2,
            color: T.muted, textTransform: 'uppercase', marginBottom: 2,
          }}>{eyebrow}</div>
        )}
        <div style={{
          fontSize: large ? 28 : 19, fontWeight: 400, letterSpacing: 0.5,
          lineHeight: 1.2, fontFamily: 'Huninn, sans-serif',
        }}>{title}</div>
      </div>
      {rightIcon && (
        <button onClick={onRight} aria-label="action" style={iconBtn(T)}>
          <MWIcon name={rightIcon} size={22} stroke={T.ink} />
        </button>
      )}
    </div>
  );
}

export function MWTabBar({ active, onChange }) {
  const T = useMW();
  const tabs = [
    { id: 'home',     icon: 'home',     label: '今天' },
    { id: 'folders',  icon: 'folder',   label: '分類' },
    { id: 'search',   icon: 'search',   label: '搜尋' },
    { id: 'archive',  icon: 'archive',  label: '完成' },
    { id: 'settings', icon: 'settings', label: '設定' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 26, paddingTop: 8, paddingLeft: 8, paddingRight: 8,
      background: T.paper + 'ee',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: `1px solid ${T.hairline}55`,
      display: 'flex', justifyContent: 'space-around',
      zIndex: 20,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 4px',
            color: isActive ? T.accent : T.muted,
            transition: 'color 200ms',
          }}>
            <MWIcon name={t.icon} size={22} stroke={isActive ? T.accent : T.muted} sw={isActive ? 1.9 : 1.5} />
            <span style={{
              fontSize: 10, letterSpacing: 0.5,
              fontWeight: isActive ? 500 : 400,
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function MWPage({ children, withTabBar = true, scroll = true }) {
  const T = useMW();
  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.paper, color: T.ink,
      position: 'relative', overflow: 'hidden',
      fontFamily: 'Huninn, "Noto Sans TC", sans-serif',
      transition: 'background 240ms, color 240ms',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: T.isDark ? 0.5 : 0.32,
        pointerEvents: 'none', mixBlendMode: T.isDark ? 'screen' : 'multiply',
        backgroundImage: T.isDark
          ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractal' baseFrequency='1.0' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.04 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`
          : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractal' baseFrequency='1.0' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0 0.25  0 0 0 0.04 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }} />
      <div className={scroll ? 'mw-scroll' : undefined} style={{
        position: 'relative', height: '100%',
        display: 'flex', flexDirection: 'column',
        overflow: scroll ? 'auto' : 'hidden',
        paddingBottom: withTabBar ? 78 : 0,
      }}>
        {children}
      </div>
    </div>
  );
}

export function MWHairline({ dashed = true, mx = 0 }) {
  const T = useMW();
  return <div style={{
    margin: `0 ${mx}px`,
    borderTop: `1px ${dashed ? 'dashed' : 'solid'} ${T.hairline}66`,
  }} />;
}
