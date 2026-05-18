/**
 * Single resolver for category → theme color. Was previously inlined as a
 * three-way ternary in five different places.
 */
export function getCategoryColor(cat, T) {
  if (cat === 'work') return T.workCat;
  if (cat === 'life') return T.lifeCat;
  if (cat === 'study') return T.studyCat;
  return T.muted;
}

export const STATE_LABEL = { todo: '未開始', doing: '進行中', done: '已完成' };
