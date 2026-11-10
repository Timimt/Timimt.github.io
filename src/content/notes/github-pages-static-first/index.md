---
title: "從 HashRouter 到靜態優先的思考"
description: "為什麼公開內容優先選擇靜態輸出、HashRouter 的 SEO 代價，以及 build-time 資料與 runtime 資料的界線。"
pubDate: 2026-11-10
tags: ["github-pages", "astro", "seo", "靜態網站"]
course: "開發實務"
relatedKnowledge: "https://timimt.github.io/cs-daily-knowledge-content/"
---

## 這次學到什麼

CS Daily Knowledge 第一版用 React Router 的 HashRouter 部署到 GitHub Pages。它能動，但網址帶著 `#/`，對搜尋引擎不友好，也不太像一個長期累積內容的網站該有的樣貌。

## 三個關鍵體會

1. 公開閱讀的內容，愈早在 build time 定案愈好；runtime 才需要的東西才放進瀏覽器。
2. HashRouter 適合工具型介面，不適合以文章為主的站；SEO 導向的內容應該有乾淨的靜態路徑。
3. GitHub Pages 沒有伺服器，所以路由、sitemap、RSS 都要在建置階段生成。

## 下一步

這個 Blog 用 Astro，預設就是靜態輸出：文章路徑、sitemap、RSS、Open Graph 全部在建置時產生。CS Daily Knowledge 本身繼續維持現況，未來再決定是否逐步調整路由。
