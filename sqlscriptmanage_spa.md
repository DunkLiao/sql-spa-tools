# SQLScriptManage 單機離線單一檔案 (Single-File SPA) 規格書

## 1. 專案概述 (Overview)

### 1.1 目的
將原本分散於多個檔案（多頁 HTML、獨立 CSS、ES 模組 JS）的 `SQLScriptManage` 系統，重構成**單一 HTML 檔案 (`index.html`)**。
使用者無需架設 Web Server 或安裝伺服器環境，直接以本機瀏覽器（支援 `file://` 協定）點擊開啟即可使用，並具備 100% 離線運作能力。

### 1.2 範疇精簡說明（移除 Diff 比較模組）
本規格書**已完全剔除「版本差異比對（Diff Engine / diff.html / diffWorker.js）」**。
系統核心聚焦於：
1. **專案管理 (Project Management)**
2. **SQL 腳本管理 (Script Management)**
3. **版本歷程與分支樹 (Version Tree & History)**
4. **本機持久化與備份匯出入 (Local Storage & Backup / Export)**
5. **內建指引與說明 (Help Modal)**

---

## 2. 系統架構與技術約束 (Architecture & Constraints)

### 2.1 單一檔案約束 (Single-File Mandate)
* **單檔封裝**：所有 HTML 標籤結構、CSS 樣式（包含佈局、主題、元件樣式）、JavaScript 程式碼全部濃縮於單一 `.html` 檔案中。
* **零外部網路依賴**：不載入外部 CDN（如 Google Fonts、FontAwesome 或外部 JS 庫），圖示統一採用內嵌 Inline SVG，避免離線時畫面破圖或載入失敗。
* **相容本機協定 (`file://`)**：
  * 禁止使用 ES6 模組引用語法（如 `<script type="module" src="...">` 或動態 `import()`），避免觸發瀏覽器在 `file://` 下的 CORS 阻擋。
  * 採用傳統 JavaScript 函式、IIFE 或物件命名空間（Namespaces）方式組織程式碼。

### 2.2 資料儲存架構 (Storage Strategy)
* **核心資料庫**：採用瀏覽器原生 **IndexedDB**（資料庫名稱：`SQLScriptManageDB`）。
  * 支援大容量 SQL 腳本儲存（不受限於 `localStorage` 的 5MB 限制）。
  * 若瀏覽器不支援或遭遇特殊隱私模式，以記憶體模式（In-Memory Fallback）輔助並跳出警示。
* **資料表 (Object Stores) 規劃**：
  * `projects`：儲存專案資訊。
  * `scripts`：儲存 SQL 腳本元資料（所屬專案、名稱、描述、目前啟動版本等）。
  * `versions`：儲存腳本的歷史版本內容（版本號、作者、提交備註、父版本 ID、SQL 內容、建立時間）。
  * `app_settings`：儲存使用者偏好（目前選擇的專案、UI 展開狀態、主題顏色等）。

---

## 3. 功能規格詳細說明 (Functional Specifications)

### 3.1 專案管理 (Project Management)
* **新增專案**：設定專案名稱、代碼、描述。
* **專案切換**：下拉選單快速切換當前工作專案。
* **編輯 / 刪除專案**：可修改專案名稱，或級聯刪除（Cascade Delete）專案下所有腳本與版本紀錄（需二次確認對話框）。
* **專案元資料**：顯示專案建立時間、最後更新時間、腳本數量統計。

### 3.2 SQL 腳本管理 (Script Management)
* **腳本列表檢視**：
  * 左側/側邊欄樹狀或清單列表，顯示所屬專案下的所有 SQL 腳本。
  * 支援快速即時搜尋（依腳本名稱、標籤或描述進行即時過濾）。
* **腳本建立與編輯**：
  * 新增空白 SQL 腳本或由本機 `.sql` 檔案直接匯入。
  * 內建 SQL 編輯器區域：
    * 支援等寬字體（Monospace）、Tab 鍵縮排支援、行號顯示或自動換行。
    * 顯示字數、行數與即時儲存狀態指示。
* **標籤與分類**：支援自訂 Tag（如 `DDL`、`DML`、`Migration`、`Report`），便於分類檢索。

### 3.3 版本歷程與版本樹 (Version & History Tracking)
* **建立新版本 (Commit / Save Version)**：
  * 編輯完成後，可點選「儲存新版本」。
  * 彈出對話框要求填寫：**版本代碼/名稱**、**變更備註 (Changelog / Note)**、**標籤 (可選)**。
  * 自動記錄時間戳記、並將當前版本的 `parentId` 指向基底版本。
* **版本樹狀圖 (Version Tree)**：
  * 視覺化渲染該腳本的所有歷史版本節點（包含直系延伸或分支）。
  * 節點顯示：版本標籤、建立時間、變更摘要。
* **版本切換與回滾 (Checkout / Rollback)**：
  * 點擊任一版本節點，即可將編輯器內容載入為該歷史版本。
  * 可基於過去的某個歷史版本繼續修改並派生新版本（建立分支歷程）。

### 3.4 匯入與匯出 (Import / Export)
* **全系統備份 (JSON Backup)**：
  * 一鍵將整個 IndexedDB 內容（所有專案、腳本、完整版本歷程、系統設定）匯出為單一 `.json` 檔案。
  * 提供「匯入 JSON 備份」功能，支援覆蓋或合併模式，並於匯入前進行結構校驗。
* **單一 SQL 匯入/匯出**：
  * **匯出**：將當前選中腳本（或特定版本）直接下載為 `.sql` 檔案。
  * **匯入**：支援由本機選取 `.sql` 檔案，自動解析檔案名稱與內容並建立新腳本。

### 3.5 說明與使用導覽 (Help Modal)
* 取代原本的 `help.html`，以純 CSS + DOM 彈窗方式內建於單一頁面中。
* 包含快速上手指南、鍵盤快捷鍵、版本分支管理觀念說明、以及資料備份注意事項。

---

## 4. UI 佈局與使用者體驗 (UI/UX Layout)

採用經典的三欄/二欄式開發者工作台佈局：

```
+-----------------------------------------------------------------------+
|  Header: [Logo] SQLScriptManage | Project Selector: [ Project A v ]   |
|  Actions: [+ New Script] [Import/Export] [Help (?)]                   |
+-------------------+----------------------------------+----------------+
| Sidebar (250px)   | Main Editor Area (Flex-1)        | Inspector /    |
|                   |                                  | Version Tree   |
| [Search Scripts]  | Script: migrate_user.sql (v1.2)  | (280px)        |
| - script_01.sql   | -------------------------------- |                |
| > script_02.sql   | 1 | CREATE TABLE users (         | [Version Tree] |
| - script_03.sql   | 2 |   id INT PRIMARY KEY,        |  (v1.0) Init   |
|                   | 3 |   name VARCHAR(100)          |    |           |
|                   | 4 | );                           |  (v1.1) AddIdx |
|                   |                                  |    |           |
|                   | [Save as New Version] [Download] |  (v1.2) *Cur   |
+-------------------+----------------------------------+----------------+
| Footer: Storage Usage: 1.2MB / IndexedDB Ready | Status: Idle         |
+-----------------------------------------------------------------------+
```

1. **頂部導覽列 (Header)**：專案切換、全域操作按鈕（匯入/匯出備份、說明面板）。
2. **左側側邊欄 (Sidebar)**：腳本過濾搜尋、腳本列表、新增腳本按鈕。
3. **中央主工作區 (Main Editor)**：
   * 當前腳本資訊（名稱、目前載入版本）。
   * 內建 SQL 編輯文字區塊。
   * 下方動作列：建立新版本、另存、下載 SQL。
4. **右側資訊與版本樹 (Version Inspector)**：
   * 版本詳細資訊（建立時間、變更說明）。
   * 版本歷史時間軸 / 樹狀圖節點列表，可點擊切換版本。

---

## 5. 資料結構規格 (Data Schema)

### 5.1 Project (專案)
```typescript
interface Project {
  id: string;          // UUID 或時間戳字串，如 "proj_1700000000"
  name: string;        // 專案名稱
  description: string; // 專案說明
  createdAt: number;   // 建立時間戳 (ms)
  updatedAt: number;   // 最後更新時間戳 (ms)
}
```

### 5.2 Script (SQL 腳本)
```typescript
interface Script {
  id: string;          // 腳本 ID，如 "script_1700000000"
  projectId: string;   // 所屬專案 ID
  name: string;        // 腳本檔名，如 "V1_init_schema.sql"
  description: string; // 功能說明
  tags: string[];      // 標籤陣列，如 ["DDL", "UserModule"]
  activeVersionId: string; // 當前編輯器關聯或最新版本 ID
  createdAt: number;   // 建立時間戳 (ms)
  updatedAt: number;   // 最後更新時間戳 (ms)
}
```

### 5.3 Version (版本記錄)
```typescript
interface ScriptVersion {
  id: string;          // 版本 ID，如 "ver_1700000000"
  scriptId: string;    // 所屬腳本 ID
  versionNumber: string; // 語意版本或流水號，如 "1.0.0" 或 "v2"
  parentId: string | null; // 父版本 ID（用於追蹤分支歷程，根節點為 null）
  changeLog: string;   // 變更說明 / 備註
  sqlContent: string;  // 完整的 SQL 內容字串
  createdAt: number;   // 提交時間戳 (ms)
}
```

---

## 6. 單檔整合交付標準 (Deliverable Criteria)

1. **單一檔案發行**：最終輸出僅為單一檔案 `index.html`，大小宜小於 500KB。
2. **免安裝即用**：以任何主流瀏覽器（Chrome、Edge、Firefox、Safari）透過雙擊開啟（`file:///.../index.html`）即可直接操作所有功能。
3. **無損備份驗證**：產生的備份 JSON 檔案在跨電腦、跨瀏覽器重新載入時，資料完整度達 100%。