---
title: "Fine-grained PAT 無法推送 GitHub Actions workflow"
description: "推送 .github/workflows 時被 GitHub 拒絕，原因是 Fine-grained Token 沒有 Workflows 權限；記錄實際錯誤與解法。"
pubDate: 2026-11-09
updatedDate: 2026-11-10
category: github
tags: ["github", "personal-access-token", "actions", "workflow", "pages"]
errorSummary: "refusing to allow a Personal Access Token to create or update workflow"
sources:
  - "https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
  - "https://docs.github.com/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site"
---

## 問題背景

為 GitHub Pages 建立自動部署時，需要在 Repository 加入 `.github/workflows/pages.yml`。本機推送 main 時，遠端直接拒絕。

## 錯誤現象

```text
! [remote rejected] main -> main
(refusing to allow a Personal Access Token to create or update
workflow `.github/workflows/pages.yml` without `workflow` scope)
```

## 原因分析

當時使用的 Fine-grained PAT 只授權了 Contents 與 Metadata。修改 workflow 檔案需要額外的 Workflows 權限；即使 Contents 可以寫一般檔案，GitHub 仍會攔截 workflow 的變更，避免無意間改動 CI 設定。

## 解決過程

1. 用 GitHub API 確認 workflow 檔案確實是造成拒絕的原因。
2. 到 Fine-grained PAT 的設定頁，為該 Token 增加 Repository permissions 中的 Workflows: Read and write。
3. 儲存後重新推送，push 通過。
4. 接著發現 Pages 本身尚未啟用：workflow 內 `configure-pages` 回傳 `Resource not accessible by integration`。
5. 到 Repository 的 Settings → Pages，把 Build and deployment 的 Source 設為 GitHub Actions。
6. 再次推送空 commit 觸發 workflow，部署成功。

## 最終解法

對 Fine-grained PAT 授予 Workflows Read and write，並在 Repository 設定 Pages 為 GitHub Actions。兩者都完成後，每次 push 到 main 都會自動建置並發布。

## 延伸知識

Fine-grained PAT 的每個權限都是獨立的。Contents 能寫檔，不代表能改 workflow；Pages 也需要在 Repository 設定裡啟用。自動化流程失敗時，先看錯誤訊息對應哪一個權限或設定，不要一次改動所有權限。
