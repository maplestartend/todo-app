export const CATEGORIES = {
  work:  { label: '工作', color: '#c46a4a', dot: '●' },
  life:  { label: '生活', color: '#7a8c5e', dot: '●' },
  study: { label: '學習', color: '#b88a3e', dot: '●' },
};

export const PRIORITY = {
  high: { label: '高', color: '#c0432a' },
  mid:  { label: '中', color: '#b88a3e' },
  low:  { label: '低', color: '#7a8c5e' },
};

export const REPEAT_OPTIONS = [
  { value: 'none',    label: '一次' },
  { value: 'daily',   label: '每日' },
  { value: 'weekly',  label: '每週' },
  { value: 'monthly', label: '每月' },
];

export const REMIND_OPTIONS = [
  { value: null, label: '關閉' },
  { value: 0,    label: '準時' },
  { value: 30,   label: '30 分前' },
  { value: 60,   label: '1 小時前' },
  { value: 1440, label: '1 天前' },
];

/**
 * Todo shape (v2+):
 *   id, title, cat, prio, state, time (legacy free-text)
 *   dueDate: 'YYYY-MM-DD' | ''
 *   dueTime: 'HH:MM' | ''
 *   repeat:  'none' | 'daily' | 'weekly' | 'monthly'
 *   remindBefore: number | null  (minutes before due)
 *   lastNotifiedAt: ISO string | null  (so we don't refire after reload)
 *   subtasks: [{id, title, done}]
 *   note: string
 */
const today = new Date('2026-05-18');
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };

export const INITIAL_TODOS = [
  {
    id: 1, title: '完成季度報告草稿', cat: 'work', prio: 'high', state: 'doing',
    time: '14:30', dueDate: iso(today), dueTime: '14:30',
    repeat: 'none', remindBefore: 30, lastNotifiedAt: null,
    subtasks: [
      { id: 1, title: '收集資料來源', done: true },
      { id: 2, title: '撰寫摘要與重點', done: false },
      { id: 3, title: '請主管 review', done: false },
    ],
    note: '記得引用上季度的 KPI 對照圖；如果時間夠的話加上 Q3 的趨勢分析。',
  },
  {
    id: 2, title: '準備明天會議簡報', cat: 'work', prio: 'high', state: 'todo',
    time: '今晚', dueDate: iso(today), dueTime: '21:00',
    repeat: 'none', remindBefore: 60, lastNotifiedAt: null,
    subtasks: [], note: '',
  },
  {
    id: 3, title: '回覆 Anna 的 email', cat: 'work', prio: 'mid', state: 'todo',
    time: '下午', dueDate: iso(addDays(1)), dueTime: '',
    repeat: 'none', remindBefore: null, lastNotifiedAt: null,
    subtasks: [], note: '',
  },
  {
    id: 4, title: '買菜:番茄、雞蛋、橄欖油', cat: 'life', prio: 'mid', state: 'todo',
    time: '傍晚', dueDate: iso(addDays(1)), dueTime: '18:30',
    repeat: 'none', remindBefore: 30, lastNotifiedAt: null,
    subtasks: [], note: '',
  },
  {
    id: 5, title: '晨跑 30 分鐘', cat: 'life', prio: 'low', state: 'done',
    time: '07:00', dueDate: iso(today), dueTime: '07:00',
    repeat: 'daily', remindBefore: null, lastNotifiedAt: null,
    subtasks: [], note: '',
  },
  {
    id: 6, title: '讀完《設計的心理學》第三章', cat: 'study', prio: 'mid', state: 'doing',
    time: '21:00', dueDate: iso(addDays(3)), dueTime: '21:00',
    repeat: 'none', remindBefore: null, lastNotifiedAt: null,
    subtasks: [], note: '',
  },
  {
    id: 7, title: '複習日文單字 50 個', cat: 'study', prio: 'low', state: 'done',
    time: '已完成', dueDate: iso(addDays(-1)), dueTime: '',
    repeat: 'daily', remindBefore: null, lastNotifiedAt: null,
    subtasks: [], note: '',
  },
  {
    id: 8, title: '預約牙醫', cat: 'life', prio: 'low', state: 'todo',
    time: '本週', dueDate: iso(addDays(5)), dueTime: '',
    repeat: 'none', remindBefore: 1440, lastNotifiedAt: null,
    subtasks: [], note: '',
  },
];
