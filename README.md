# 待辦事項 — Minimal Warm

暖極簡風格的待辦事項 APP，七個畫面、深色模式、手繪感 UI。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 打包到 dist/
npm run preview  # 預覽打包結果
```

## 畫面

1. **今天 Home** — 三個進度環 + 清單
2. **任務詳情 Detail** — 子任務、進度、提醒、備註
3. **新增 / 編輯 Edit** — 全屏表單
4. **分類 Categories** — 工作 / 生活 / 學習
5. **搜尋 Search** — 快速篩選 + 最近搜尋
6. **完成 Archive** — 累積數 + 14 天打卡長條圖
7. **設定 Settings** — 個人卡片、深色模式開關

## 互動

- 點清單任一項 → 詳情頁
- 詳情頁 ✎ → 編輯頁
- 任一頁 + → 新增表單
- 底部 5 個分頁可互跳
- 點 checkbox 切換 未開始 → 進行中 → 已完成

## 技術

- Vite + React 18
- 字型：Huninn（繁中手寫）、Noto Sans TC、Caveat、Geist Mono
- 深色模式偏好寫入 localStorage
- 響應式：iPhone frame 在窄螢幕會自動縮放

## 來源

從 Claude Design 設計稿實作。
