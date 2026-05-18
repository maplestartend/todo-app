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

export const INITIAL_TODOS = [
  { id: 1, title: '完成季度報告草稿', cat: 'work',  prio: 'high', state: 'doing', time: '14:30', sub: 3, subDone: 1 },
  { id: 2, title: '準備明天會議簡報',  cat: 'work',  prio: 'high', state: 'todo',  time: '今晚', sub: 0, subDone: 0 },
  { id: 3, title: '回覆 Anna 的 email', cat: 'work',  prio: 'mid', state: 'todo',  time: '下午', sub: 0, subDone: 0 },
  { id: 4, title: '買菜：番茄、雞蛋、橄欖油', cat: 'life',  prio: 'mid', state: 'todo',  time: '傍晚', sub: 0, subDone: 0 },
  { id: 5, title: '晨跑 30 分鐘',        cat: 'life',  prio: 'low', state: 'done',  time: '07:00', sub: 0, subDone: 0 },
  { id: 6, title: '讀完《設計的心理學》第三章', cat: 'study', prio: 'mid', state: 'doing', time: '21:00', sub: 0, subDone: 0 },
  { id: 7, title: '複習日文單字 50 個',   cat: 'study', prio: 'low', state: 'done',  time: '已完成', sub: 0, subDone: 0 },
  { id: 8, title: '預約牙醫', cat: 'life', prio: 'low', state: 'todo', time: '本週', sub: 0, subDone: 0 },
];
