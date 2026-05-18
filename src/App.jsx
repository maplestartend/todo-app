import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MWThemeCtx, MW_LIGHT, MW_DARK } from './theme.js';
import { useStore } from './useStore.js';
import { useReminders } from './hooks/useReminders.js';
import IOSDevice from './components/IOSDevice.jsx';
import { MWTabBar } from './components/MWChrome.jsx';
import { MWFab } from './components/MWPrimitives.jsx';
import Home from './screens/Home.jsx';
import Detail from './screens/Detail.jsx';
import Edit from './screens/Edit.jsx';
import Categories from './screens/Categories.jsx';
import Search from './screens/Search.jsx';
import Archive from './screens/Archive.jsx';
import Settings from './screens/Settings.jsx';

const PHONE_W = 402;
const PHONE_H = 874;
const MOBILE_MAX_WIDTH = 500;
const TAB_SCREENS = ['home', 'folders', 'search', 'archive', 'settings'];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      const v = localStorage.getItem('mw_dark');
      if (v != null) return v === '1';
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });
  useEffect(() => {
    try { localStorage.setItem('mw_dark', dark ? '1' : '0'); } catch {}
  }, [dark]);
  return [dark, setDark];
}

function useNotificationsEnabled() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('mw_notify') === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('mw_notify', enabled ? '1' : '0'); } catch {}
  }, [enabled]);
  return [enabled, setEnabled];
}

function useScaleToFit(targetW, targetH) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const margin = 24;
      const sx = (window.innerWidth - margin) / targetW;
      const sy = (window.innerHeight - margin) / targetH;
      setScale(Math.min(1, sx, sy));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [targetW, targetH]);
  return scale;
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

function PhoneApp({ store, dark, setDark, notify, setNotify, mobile = false }) {
  const [route, setRoute] = useState({ screen: 'home', params: {} });
  const [dir, setDir] = useState('push'); // 'push' | 'pop' | 'tab'
  const stack = useRef([{ screen: 'home', params: {} }]);

  const nav = useMemo(() => ({
    go: (screen, params = {}) => {
      stack.current.push({ screen, params });
      setDir('push');
      setRoute({ screen, params });
    },
    // back(n) pops n frames so callers can skip over an interim screen
    // (e.g. delete-from-Edit must skip the now-stale Detail underneath).
    back: (n = 1) => {
      for (let i = 0; i < n; i++) {
        if (stack.current.length > 1) stack.current.pop();
      }
      const top = stack.current[stack.current.length - 1] || { screen: 'home', params: {} };
      setDir('pop');
      setRoute(top);
    },
    set: (screen, params = {}) => {
      stack.current = [{ screen, params }];
      setDir('tab');
      setRoute({ screen, params });
    },
  }), []);

  const isTab = TAB_SCREENS.includes(route.screen);
  const onTab = (id) => nav.set(id);

  let body;
  switch (route.screen) {
    case 'home':     body = <Home store={store} nav={nav} />; break;
    case 'detail':   body = <Detail store={store} nav={nav} params={route.params} />; break;
    case 'edit':     body = <Edit store={store} nav={nav} params={route.params} />; break;
    case 'folders':  body = <Categories store={store} nav={nav} />; break;
    case 'search':   body = <Search store={store} nav={nav} />; break;
    case 'archive':  body = <Archive store={store} nav={nav} />; break;
    case 'settings': body = <Settings dark={dark} setDark={setDark} store={store} notify={notify} setNotify={setNotify} />; break;
    default:         body = <Home store={store} nav={nav} />;
  }

  const anim =
    dir === 'pop'  ? 'mwPushBack 320ms cubic-bezier(0.32, 0.72, 0, 1) both' :
    dir === 'push' ? 'mwPush 320ms cubic-bezier(0.32, 0.72, 0, 1) both' :
                     'mwIn 260ms cubic-bezier(0.22, 0.61, 0.36, 1) both';

  const inner = (
    <div style={{ height: '100%', position: 'relative' }}>
      <div
        key={route.screen + JSON.stringify(route.params)}
        style={{ height: '100%', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ animation: anim, height: '100%' }}>
          {body}
        </div>
      </div>
      {(route.screen === 'home' || route.screen === 'folders') && (
        <MWFab onClick={() => nav.go('edit', { mode: 'new', returnTo: route.screen })} />
      )}
      {isTab && <MWTabBar active={route.screen} onChange={onTab} />}
    </div>
  );

  if (mobile) {
    return <div style={{ width: '100%', height: '100%' }}>{inner}</div>;
  }

  return (
    <IOSDevice width={PHONE_W} height={PHONE_H} dark={dark}>
      {inner}
    </IOSDevice>
  );
}

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [notify, setNotify] = useNotificationsEnabled();
  const store = useStore();
  useReminders(store, notify);
  const theme = dark ? MW_DARK : MW_LIGHT;
  const isMobile = useIsMobileViewport();
  const scale = useScaleToFit(PHONE_W, PHONE_H);

  useEffect(() => {
    document.body.classList.toggle('mw-mobile', isMobile);
    document.body.style.background = isMobile
      ? (dark ? '#1d160f' : '#faf3e3')
      : (dark ? '#0e0a07' : '#2a221b');
  }, [isMobile, dark]);

  if (isMobile) {
    return (
      <MWThemeCtx.Provider value={theme}>
        <div style={{
          position: 'fixed', inset: 0,
          background: theme.paper,
          overflow: 'hidden',
        }}>
          <PhoneApp store={store} dark={dark} setDark={setDark} notify={notify} setNotify={setNotify} mobile />
        </div>
      </MWThemeCtx.Provider>
    );
  }

  return (
    <MWThemeCtx.Provider value={theme}>
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: dark ? '#0e0a07' : '#2a221b',
        transition: 'background 240ms',
        padding: 12, boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        <div style={{
          width: PHONE_W * scale,
          height: PHONE_H * scale,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: PHONE_W, height: PHONE_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}>
            <PhoneApp store={store} dark={dark} setDark={setDark} notify={notify} setNotify={setNotify} />
          </div>
        </div>
      </div>
    </MWThemeCtx.Provider>
  );
}
