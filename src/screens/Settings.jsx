import React, { useState } from 'react';
import { useMW } from '../theme.js';
import { MWPage, MWNavBar } from '../components/MWChrome.jsx';
import { MWSwitch } from '../components/MWPrimitives.jsx';
import MWIcon from '../components/MWIcon.jsx';
import { requestNotificationPermission, notificationStatus } from '../hooks/useReminders.js';

function SettingsGroup({ label, children }) {
  const T = useMW();
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ padding: '0 26px 6px', fontSize: 12, color: T.muted, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: '"Geist Mono", monospace' }}>
        {label}
      </div>
      <div style={{
        margin: '0 22px',
        background: T.paperRaised, borderRadius: 14,
        border: `1px solid ${T.hairline}55`,
        overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

function SettingsRow({ icon, label, right }) {
  const T = useMW();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px',
      borderBottom: `1px dashed ${T.hairline}55`,
    }}>
      <MWIcon name={icon} size={18} stroke={T.inkSoft} sw={1.5} />
      <div style={{ flex: 1, fontSize: 15 }}>{label}</div>
      <div>{right}</div>
    </div>
  );
}

/**
 * Full-row action button for the settings list. Real <button> so keyboard
 * (Tab + Enter/Space) works out of the box; destructive rows get a red
 * color AND a text warning (never color alone).
 */
function SettingsActionRow({ icon, label, sub, danger, onClick }) {
  const T = useMW();
  const dangerColor = T.isDark ? '#e5715a' : '#c0432a';
  const color = danger ? dangerColor : T.ink;
  return (
    <button
      type="button"
      onClick={onClick}
      className="mw-settings-action"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', minHeight: 48, padding: '12px 14px',
        background: 'transparent', border: 'none',
        borderBottom: `1px dashed ${T.hairline}55`,
        color, textAlign: 'left', cursor: 'pointer',
        fontFamily: 'Huninn, sans-serif',
      }}
    >
      <MWIcon name={icon} size={18} stroke={danger ? dangerColor : T.inkSoft} sw={1.5} />
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 15 }}>{label}</span>
        {sub && (
          <span style={{ display: 'block', fontSize: 11, color: danger ? dangerColor : T.muted, marginTop: 2 }}>
            {sub}
          </span>
        )}
      </span>
      <MWIcon name="chevR" size={14} stroke={T.muted} />
    </button>
  );
}

export default function Settings({ dark, setDark, store, notify, setNotify }) {
  const T = useMW();
  const s = store?.stats || { total: 0, done: 0, doing: 0 };
  const stats = [
    { label: '總任務', value: s.total },
    { label: '已完成', value: s.done },
    { label: '進行中', value: s.doing },
  ];
  const [dataFeedback, setDataFeedback] = useState('');
  const resetDemo = () => {
    if (!window.confirm('重設示範資料？\n\n現有的所有任務會被刪除，並重新載入以今天為基準的示範任務。')) return;
    store.resetDemo();
    setDataFeedback('已重新載入示範資料');
  };
  const clearAll = () => {
    if (!window.confirm('清空所有資料？\n\n所有任務將被永久刪除，此操作無法復原。')) return;
    store.clearAll();
    setDataFeedback('已清空所有資料');
  };
  const permStatus = notificationStatus();
  const toggleNotify = async (on) => {
    if (!on) { setNotify(false); return; }
    const perm = await requestNotificationPermission();
    if (perm === 'granted') setNotify(true);
    else setNotify(false);
  };
  return (
    <MWPage scrollKey="settings">
      <MWNavBar eyebrow="PROFILE" title="設定" />

      <div style={{ margin: '4px 22px 18px', padding: '20px 18px',
        background: T.paperRaised, borderRadius: 18,
        border: `1px solid ${T.hairline}55`,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: T.accent + '33',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Caveat, cursive', fontSize: 28, color: T.accent, fontWeight: 700,
        }}>YL</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18 }}>YL · 早起的人</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: '"Geist Mono", monospace', marginTop: 2 }}>
            joined 2025.11
          </div>
        </div>
        <button style={{
          padding: '6px 12px', borderRadius: 99,
          background: 'transparent', color: T.ink,
          border: `1px solid ${T.hairline}88`,
          fontSize: 12, fontFamily: 'Huninn, sans-serif', cursor: 'pointer',
        }}>編輯</button>
      </div>

      <div style={{ padding: '0 22px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            padding: '12px 8px', textAlign: 'center',
            background: T.paperRaised, borderRadius: 12,
            border: `1px solid ${T.hairline}55`,
          }}>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 26, color: T.accent, fontWeight: 600, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <SettingsGroup label="外觀">
        <SettingsRow icon="moon" label="深色模式"
          right={<MWSwitch on={dark} onChange={setDark} label="深色模式" />} />
        <SettingsRow icon="edit" label="主題顏色" right={
          <div style={{ display: 'flex', gap: 6 }}>
            {['#c46a4a','#7a8c5e','#b88a3e','#5b8aa8'].map(c => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 99, background: c,
                outline: c === T.accent ? `2px solid ${T.ink}` : 'none', outlineOffset: 2 }}/>
            ))}
          </div>
        } />
      </SettingsGroup>

      <SettingsGroup label="通知">
        <SettingsRow
          icon="bell"
          label={permStatus === 'denied' ? '提醒通知（瀏覽器已拒絕）' :
                 permStatus === 'unsupported' ? '提醒通知（此裝置不支援）' : '提醒通知'}
          right={
            <MWSwitch
              on={!!notify && permStatus === 'granted'}
              onChange={toggleNotify}
              label="提醒通知"
            />
          }
        />
        {notify && permStatus === 'granted' && (
          <div style={{
            padding: '8px 14px', fontSize: 11, color: T.muted,
            borderTop: `1px dashed ${T.hairline}55`, lineHeight: 1.5,
          }}>
            需保持 app 開啟（或加入主畫面以 standalone 啟動，iOS 16.4+）才能收到提醒
          </div>
        )}
      </SettingsGroup>

      <SettingsGroup label="資料">
        <SettingsActionRow
          icon="calendar"
          label="重設示範資料"
          sub="以今天為基準重新載入示範任務（會取代現有任務）"
          onClick={resetDemo}
        />
        <SettingsActionRow
          icon="trash"
          label="清空所有資料"
          sub="永久刪除所有任務，無法復原"
          danger
          onClick={clearAll}
        />
        {/* Announce the outcome to screen readers (and sighted users) */}
        <div role="status" aria-live="polite" style={{
          padding: dataFeedback ? '8px 14px' : 0, fontSize: 11, color: T.muted,
          lineHeight: 1.5,
        }}>
          {dataFeedback}
        </div>
      </SettingsGroup>

      <SettingsGroup label="其他">
        <SettingsRow icon="folder" label="管理分類與標籤" right={<MWIcon name="chevR" size={14} stroke={T.muted}/>} />
        <SettingsRow icon="archive" label="清理已完成" right={<MWIcon name="chevR" size={14} stroke={T.muted}/>} />
        <SettingsRow icon="user" label="關於 與 反饋" right={<MWIcon name="chevR" size={14} stroke={T.muted}/>} />
      </SettingsGroup>

      <div style={{ padding: '20px 22px 30px', textAlign: 'center', color: T.muted, fontFamily: 'Caveat, cursive', fontSize: 16 }}>
        made with care · v0.1
      </div>
    </MWPage>
  );
}
