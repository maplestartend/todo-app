import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'mw_todos';

// Local YYYY-MM-DD — matches the app's own local-date formatting.
const isoLocal = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const makeTodo = (over = {}) => ({
  id: 100, title: '買牛奶', cat: 'life', prio: 'mid', state: 'todo',
  time: '', dueDate: '', dueTime: '', repeat: 'none',
  remindBefore: null, lastNotifiedAt: null, subtasks: [], note: '',
  ...over,
});

/**
 * Pre-seed the v2 storage payload before the app boots. Init scripts re-run
 * on every navigation, so only seed when the key is still absent — reloads
 * must observe what the app itself persisted.
 */
async function seedV2(page, todos) {
  await page.addInitScript(([key, payload]) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, payload);
  }, [STORAGE_KEY, JSON.stringify({ version: 2, todos })]);
}

test('首次開啟（localStorage 空）：載入示範任務且沒有任何逾期', async ({ page }) => {
  await page.goto('/');

  // Demo seed is visible…
  await expect(page.getByText('完成季度報告草稿')).toBeVisible();
  // …and nothing anywhere reads as overdue (header, chips, or row labels).
  await expect(page.getByText(/逾期/)).toHaveCount(0);
});

test('新增任務：出現在清單，重新整理後仍在', async ({ page }) => {
  await seedV2(page, []);
  await page.goto('/');
  await expect(page.getByText('all clear')).toBeVisible();

  await page.getByRole('button', { name: '新增任務' }).click();
  await page.getByPlaceholder('想做什麼？').fill('寫 Playwright 測試');
  await page.getByRole('button', { name: '加進清單' }).click();

  const row = page.getByRole('button', { name: '寫 Playwright 測試 · 工作 · 未開始', exact: true });
  await expect(row).toBeVisible();

  // Survives a reload (persisted to localStorage).
  await page.reload();
  await expect(row).toBeVisible();
});

test('完成任務：點兩下 checkbox 走完 未開始→進行中→已完成', async ({ page }) => {
  await seedV2(page, [makeTodo()]);
  await page.goto('/');

  await page.getByRole('button', { name: '買牛奶 · 未開始', exact: true }).click();
  await page.getByRole('button', { name: '買牛奶 · 進行中', exact: true }).click();

  const checkbox = page.getByRole('button', { name: '買牛奶 · 已完成', exact: true });
  await expect(checkbox).toHaveAttribute('aria-pressed', 'true');
  // The "已完成" stat ring reflects the completion.
  await expect(page.getByRole('button', { name: '已完成 1', exact: true })).toBeVisible();
});

test('重複任務：完成後自動 spawn 下一筆（明天）', async ({ page }) => {
  await seedV2(page, [makeTodo({
    id: 200, title: '晨跑 30 分鐘', repeat: 'daily', dueDate: isoLocal(new Date()),
  })]);
  await page.goto('/');

  await page.getByRole('button', { name: '晨跑 30 分鐘 · 未開始', exact: true }).click();
  await page.getByRole('button', { name: '晨跑 30 分鐘 · 進行中', exact: true }).click();

  // Both the completed instance and the freshly spawned one are in the list.
  await expect(page.getByRole('button', { name: '晨跑 30 分鐘 · 生活 · 已完成', exact: true })).toBeVisible();
  const spawned = page.getByRole('button', { name: '晨跑 30 分鐘 · 生活 · 未開始', exact: true });
  await expect(spawned).toBeVisible();
  // The next instance is due tomorrow, not overdue.
  await expect(spawned.getByText('明天')).toBeVisible();
});

test('v1 裸陣列資料：自動 migrate 成 v2 並保留任務', async ({ page }) => {
  await page.addInitScript(() => {
    // Only on the very first load — after migration the v2 key exists and
    // the reload below must run against untouched storage.
    if (!localStorage.getItem('mw_todos') && !localStorage.getItem('mw_todos_v1')) {
      localStorage.setItem('mw_todos_v1', JSON.stringify([
        { id: 1, title: '舊版任務：升級 schema', cat: 'work', prio: 'mid', state: 'todo', time: '下午' },
      ]));
    }
  });
  await page.goto('/');

  // Migrated task shows up instead of the demo seed.
  await expect(page.getByText('舊版任務：升級 schema')).toBeVisible();
  await expect(page.getByText('完成季度報告草稿')).toHaveCount(0);

  // Storage now holds the documented v2 payload shape.
  const payload = await page.evaluate(() => JSON.parse(localStorage.getItem('mw_todos')));
  expect(payload.version).toBe(2);
  expect(payload.todos).toHaveLength(1);
  expect(payload.todos[0].title).toBe('舊版任務：升級 schema');

  // And the app keeps the data across a reload.
  await page.reload();
  await expect(page.getByText('舊版任務：升級 schema')).toBeVisible();
});

test('設定：重設示範資料會重新載入以今天為基準的種子', async ({ page }) => {
  await seedV2(page, []);
  await page.goto('/');
  await expect(page.getByText('all clear')).toBeVisible();

  await page.getByRole('button', { name: '設定' }).click();
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toContain('重設示範資料');
    dialog.accept();
  });
  await page.getByRole('button', { name: /重設示範資料/ }).click();
  await expect(page.getByText('已重新載入示範資料')).toBeVisible();

  // Back on Home: demo tasks are there and none of them is overdue.
  await page.getByRole('button', { name: '今天', exact: true }).click();
  await expect(page.getByText('完成季度報告草稿')).toBeVisible();
  await expect(page.getByText(/逾期/)).toHaveCount(0);
});

test('設定：清空所有資料需確認，取消不動、確認後清空', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('完成季度報告草稿')).toBeVisible();
  await page.getByRole('button', { name: '設定' }).click();

  // Cancel keeps everything.
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: /清空所有資料/ }).click();
  await page.getByRole('button', { name: '今天', exact: true }).click();
  await expect(page.getByText('完成季度報告草稿')).toBeVisible();

  // Accept wipes the list.
  await page.getByRole('button', { name: '設定' }).click();
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toContain('清空所有資料');
    dialog.accept();
  });
  await page.getByRole('button', { name: /清空所有資料/ }).click();
  await expect(page.getByText('已清空所有資料')).toBeVisible();

  await page.getByRole('button', { name: '今天', exact: true }).click();
  await expect(page.getByText('all clear')).toBeVisible();
});
