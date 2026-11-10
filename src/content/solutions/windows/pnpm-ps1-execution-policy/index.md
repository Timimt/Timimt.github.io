---
title: "pnpm.ps1 被 PowerShell 執行原則擋住"
description: "Windows 上執行 pnpm 時出現「因為這個系統上已停用指令碼執行」的錯誤，記錄完整的排查思路與最小可行的解法。"
pubDate: 2026-11-08
updatedDate: 2026-11-10
category: windows
tags: ["powershell", "pnpm", "execution-policy", "指令碼執行"]
errorSummary: "pnpm : 因為這個系統上已停用指令碼執行，所以無法載入 pnpm.ps1"
sources:
  - "https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies"
  - "https://learn.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy"
---

## 問題背景

在 Windows 使用 pnpm 時，終端機沒有直接執行 pnpm 程式本身，而是嘗試載入 pnpm 提供的 PowerShell 腳本 `pnpm.ps1`。同一台電腦上，其他 Node 指令都正常，只有 pnpm 被擋住。

## 錯誤現象

```text
pnpm : 因為這個系統上已停用指令碼執行，所以無法載入
C:\Users\...\pnpm.ps1 檔案。
SecurityError: (:) [], PSSecurityException
```

## 原因分析

PowerShell 的執行原則限制本機指令碼載入。這不是 pnpm 壞掉，也不是 Node 壞掉，而是 PowerShell 不允許執行這個 `.ps1` 檔。

## 解決過程

1. 確認錯誤來源是 PowerShell 執行原則，不是 PATH 或版本問題。
2. 檢查目前原則。
3. 把範圍限縮在 CurrentUser，而不是全域或 LocalMachine。
4. 用 `pnpm.cmd` 驗證：`.cmd` 批次檔不受 `.ps1` 執行原則限制，能立刻確認 pnpm 本身可用。

## 最終解法

在 PowerShell 中執行：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

之後重新執行 `pnpm`。如果只想立即繞過而不改系統設定，也可以用 `pnpm.cmd`，但這只是替代路徑，不是修正執行原則。

## 延伸知識

執行原則不是安全邊界，它主要是防止使用者無意間執行來路不明的腳本。真正防禦惡意指令碼，要靠來源確認、簽章與良好的下載習慣。改變設定前，先確認自己了解影響範圍。
