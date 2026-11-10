---
title: "CS Daily Knowledge"
description: "從本機 SQLite 學習平台，演進成 GitHub-driven 的公開資安知識庫；記錄架構決策、踩過的坑與最後的靜態化。"
pubDate: 2026-11-06
updatedDate: 2026-11-10
status: active
tags: ["react", "vite", "typescript", "sqlite", "github-pages", "資安"]
stack: ["React 19", "Vite 8", "TypeScript", "Express", "SQLite", "GitHub Actions"]
links:
  - label: "GitHub Repository"
    url: "https://github.com/Timimt/cs-daily-knowledge-content"
  - label: "正式網站"
    url: "https://timimt.github.io/cs-daily-knowledge-content/"
---

## 開發目的

把每天學到的資安與資工觀念整理成可長期累積的教材，同時練習前端、後端、資料庫與部署的完整流程。

## 使用技術

前端是 React + Vite + TypeScript，後端曾是 Node.js + Express + SQLite，教材同步到 GitHub。最終公開站改成純靜態：GitHub Repository 是教材權威來源，GitHub Actions 建置，GitHub Pages 託管。

## 系統架構

```text
GitHub Repository (Markdown + metadata + 測驗)
        │  GitHub Actions build
        ▼
GitHub Pages 靜態站
        │
        ├─ 首頁、知識庫、搜尋
        ├─ 教材閱讀、SVG 圖解
        └─ localStorage 進度與測驗
```

## 開發過程

第一版以 SQLite 保存教材與學習紀錄，接著加入單人登入、CSRF 與 GitHub 同步 outbox。真實同步驗證後，決定讓 GitHub 成為內容唯一來源，把公開站改為 build-time 生成資料、前端批改測驗、localStorage 保存進度，讓網站完全不依賴後端也能運作。

## 遇到的挑戰

- Windows PowerShell 執行原則擋住 pnpm 指令碼。
- GitHub Fine-grained PAT 權限不足，無法推送 workflow。
- GitHub Pages 需要手動從分支發布切換成 GitHub Actions。
- SQLite 的學習紀錄不能直接丟棄，要先匯出成可匯入的 JSON。

## 成果與後續規劃

目前有 23 篇已發布教材，每篇都有原創 SVG 圖與測驗。下一步規劃加入 DeepSeek 問答、每日教材生成與 Telegram 通知。
