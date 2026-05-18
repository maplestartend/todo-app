import React, { useState } from 'react';
import { useMW } from '../theme.js';
import { CATEGORIES, PRIORITY, REPEAT_OPTIONS, REMIND_OPTIONS } from '../data.js';
import { MWPage, MWNavBar } from '../components/MWChrome.jsx';
import { SectionHead, inputBase } from '../components/MWPrimitives.jsx';
import { getCategoryColor } from '../utils/categoryColor.js';

function Segmented({ options, value, onChange, getKey, getLabel, color }) {
  const T = useMW();
  return (
    <div
      role="radiogroup"
      style={{
        display: 'flex', gap: 6,
        // Horizontal scroll keeps the row visually intact at 393px instead
        // of wrapping "1 天前" alone onto a second line.
        overflowX: 'auto', overflowY: 'visible',
        paddingBottom: 4, scrollbarWidth: 'none',
      }}
    >
      {options.map(opt => {
        const k = getKey(opt);
        const sel = k === value;
        return (
          <button
            key={String(k)}
            onClick={() => onChange(k)}
            role="radio"
            aria-checked={sel}
            style={{
              flexShrink: 0,
              padding: '8px 14px', minHeight: 36,
              borderRadius: 99,
              background: sel ? (color || T.ink) : 'transparent',
              color: sel ? T.paper : T.ink,
              border: `1px solid ${sel ? (color || T.ink) : T.hairline + '88'}`,
              fontSize: 13, fontFamily: 'Huninn, sans-serif',
              cursor: 'pointer', transition: 'all 160ms',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {getLabel(opt)}
          </button>
        );
      })}
    </div>
  );
}

export default function Edit({ store, nav, params }) {
  const T = useMW();
  const isEdit = params.mode === 'edit';
  const existing = isEdit ? store.todos.find(t => t.id === params.id) : null;
  const [title, setTitle] = useState(existing?.title || '');
  const [cat, setCat] = useState(existing?.cat || 'work');
  const [prio, setPrio] = useState(existing?.prio || 'mid');
  const [dueDate, setDueDate] = useState(existing?.dueDate || '');
  const [dueTime, setDueTime] = useState(existing?.dueTime || '');
  const [repeat, setRepeat] = useState(existing?.repeat || 'none');
  const [remindBefore, setRemindBefore] = useState(
    existing && 'remindBefore' in existing ? existing.remindBefore : null
  );
  const [note, setNote] = useState(existing?.note || '');

  const canSave = title.trim().length > 0;

  // Dirty-check: only prompt on close when user actually changed something.
  const dirty = (
    title !== (existing?.title || '') ||
    cat !== (existing?.cat || 'work') ||
    prio !== (existing?.prio || 'mid') ||
    dueDate !== (existing?.dueDate || '') ||
    dueTime !== (existing?.dueTime || '') ||
    repeat !== (existing?.repeat || 'none') ||
    remindBefore !== (existing && 'remindBefore' in existing ? existing.remindBefore : null) ||
    note !== (existing?.note || '')
  );
  const handleClose = () => {
    if (dirty && !window.confirm('未儲存的變更會被丟棄，確定離開？')) return;
    nav.back();
  };

  const save = () => {
    if (!canSave) return;
    // Only re-arm the reminder when something that actually affects the
    // notification (due time or how-early-to-remind) changes. Editing note
    // alone used to silently re-fire the reminder on the next poll.
    const dueOrRemindChanged = isEdit && (
      dueDate !== existing.dueDate ||
      dueTime !== existing.dueTime ||
      remindBefore !== (('remindBefore' in existing) ? existing.remindBefore : null)
    );
    const patch = {
      title: title.trim(),
      cat, prio,
      // Keep legacy free-text `time` in sync with dueTime for backward compat.
      time: dueTime || existing?.time || '今天',
      dueDate, dueTime, repeat,
      remindBefore: remindBefore ?? null,
      note,
      ...(isEdit
        ? (dueOrRemindChanged ? { lastNotifiedAt: null } : {})
        : { lastNotifiedAt: null }),
    };
    if (isEdit) {
      store.update(existing.id, patch);
      nav.back();
    } else {
      store.add(patch);
      // Return to whichever tab the user invoked + from (home or folders).
      nav.set(params.returnTo || 'home');
    }
  };

  return (
    <MWPage withTabBar={false}>
      <MWNavBar
        eyebrow={isEdit ? 'EDIT TASK' : 'NEW TASK'}
        title={isEdit ? '編輯任務' : '新增一件事'}
        leftIcon="close" onLeft={handleClose}
        rightAction={(
          <button
            onClick={save}
            disabled={!canSave}
            aria-label={isEdit ? '儲存變更' : '加進清單'}
            style={{
              alignSelf: 'center',
              padding: '8px 14px', minHeight: 36,
              border: 'none', borderRadius: 99,
              background: canSave ? T.ink : T.hairline + '88',
              color: canSave ? T.paper : T.muted,
              fontFamily: 'Huninn, sans-serif', fontSize: 14,
              cursor: canSave ? 'pointer' : 'not-allowed',
              transition: 'background 180ms, color 180ms',
            }}
          >
            {isEdit ? '儲存' : '加入'}
          </button>
        )}
      />

      <div style={{ padding: '4px 22px 12px' }}>
        <input
          autoFocus value={title} onChange={e => setTitle(e.target.value)}
          placeholder="想做什麼？"
          style={{
            width: '100%', boxSizing: 'border-box',
            border: 'none', borderBottom: `1.5px dashed ${T.hairline}`,
            background: 'transparent', outline: 'none',
            fontSize: 22, padding: '14px 0',
            fontFamily: 'Huninn, sans-serif', color: T.ink,
          }}
        />
      </div>

      <div style={{ padding: '12px 26px 6px' }}>
        <SectionHead icon="folder" title="分類" />
      </div>
      <div style={{ padding: '0 22px', display: 'flex', gap: 8 }}>
        {Object.entries(CATEGORIES).map(([k, v]) => {
          const col = getCategoryColor(k, T);
          const sel = cat === k;
          return (
            <button key={k} onClick={() => setCat(k)} aria-pressed={sel} style={{
              flex: 1, padding: '12px 10px', minHeight: 44,
              background: sel ? col : 'transparent',
              color: sel ? '#fff' : T.ink,
              border: `1px solid ${sel ? col : T.hairline + '88'}`,
              borderRadius: 12, cursor: 'pointer', fontSize: 15,
              fontFamily: 'Huninn, sans-serif', transition: 'all 160ms',
            }}>{v.label}</button>
          );
        })}
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="flag" title="優先順序" />
      </div>
      <div style={{ padding: '0 22px', display: 'flex', gap: 8 }}>
        {Object.entries(PRIORITY).map(([k, v]) => {
          const sel = prio === k;
          return (
            <button key={k} onClick={() => setPrio(k)} aria-pressed={sel} style={{
              flex: 1, padding: '12px 10px', minHeight: 44,
              background: sel ? v.color : 'transparent',
              color: sel ? '#fff' : T.ink,
              border: `1px solid ${sel ? v.color : T.hairline + '88'}`,
              borderRadius: 12, cursor: 'pointer', fontSize: 15,
              fontFamily: 'Huninn, sans-serif', transition: 'all 160ms',
            }}>{v.label}</button>
          );
        })}
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="calendar" title="截止" />
      </div>
      <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
        <input
          type="date" value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          aria-label="截止日期"
          style={inputBase(T)}
        />
        <input
          type="time" value={dueTime}
          onChange={e => setDueTime(e.target.value)}
          aria-label="截止時間"
          style={inputBase(T)}
        />
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="bell" title="提醒" />
      </div>
      <div style={{ padding: '0 22px' }}>
        <Segmented
          options={REMIND_OPTIONS}
          value={remindBefore}
          onChange={setRemindBefore}
          getKey={(o) => o.value}
          getLabel={(o) => o.label}
          color={T.accent}
        />
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="archive" title="重複" />
      </div>
      <div style={{ padding: '0 22px' }}>
        <Segmented
          options={REPEAT_OPTIONS}
          value={repeat}
          onChange={setRepeat}
          getKey={(o) => o.value}
          getLabel={(o) => o.label}
          color={T.accent}
        />
      </div>

      <div style={{ padding: '20px 26px 6px' }}>
        <SectionHead icon="note" title="備註" />
      </div>
      <div style={{ padding: '0 22px' }}>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="加上一些細節..."
          style={{ ...inputBase(T), minHeight: 80, resize: 'none', fontSize: 16, lineHeight: 1.5 }}/>
      </div>

      <div style={{ flex: 1, minHeight: 12 }}/>
      {isEdit && (
        <div style={{ padding: '8px 22px 24px' }}>
          <button
            onClick={() => {
              if (!window.confirm(`刪除「${existing.title}」？`)) return;
              store.remove(existing.id);
              // Pop both Edit and the now-stale Detail so the user doesn't
              // land on a "找不到任務" placeholder.
              nav.back(2);
            }}
            style={{
              width: '100%', padding: '12px', minHeight: 44,
              border: `1px dashed ${T.accent}66`, borderRadius: 12,
              background: 'transparent', color: T.accent,
              fontFamily: 'Huninn, sans-serif', fontSize: 14,
              cursor: 'pointer',
            }}
          >刪除任務</button>
        </div>
      )}
    </MWPage>
  );
}
