# SQL SPA Tools 配色規範與引用說明

本文件定義 SQL SPA Tools 全站共用的莫蘭迪淺色系主題。所有工具頁面應使用根目錄的 [`theme.css`](../theme.css)，避免各頁重新建立不同的背景、文字、按鈕與狀態色。

## 適用頁面

目前以下頁面共用同一份主題：

- `index.html`
- `sql-spa-tools-catalog.html`
- `sql-spa-tools-column-lineage.html`
- `sql-spa-tools-oracle-formatter.html`
- `sql-spa-tools-pii-cleaner.html`
- `sql-spa-tools-sql-compare.html`

頁面與 `theme.css` 必須位於同一個資料夾，才能支援直接以瀏覽器開啟 HTML 的離線使用方式。

## 設計原則

1. 以暖灰米白作為頁面基底，搭配灰綠、灰藍與低飽和土色。
2. 背景、面板、表單、按鈕與邊框應使用共用 token，不直接寫死新的色碼。
3. 成功、警告、錯誤與資訊仍保留可辨識的語意色，但降低飽和度。
4. 不使用純黑作為一般文字，也不以高飽和紅、黃、藍作為主要 UI 色。
5. 匯出報表、列印頁與 SVG 等離開主頁面的輸出，必須使用相同的主題色。
6. 顏色變更不應影響既有版面、互動流程或資料處理行為。

## 深／淺色模式

- 預設模式為深色，頁面未設定 `data-theme` 時即使用深色 token。
- 每個頁面都有 `#themeToggle` 按鈕，可在深色與淺色之間切換。
- 使用者選擇會寫入 `localStorage` 的 `sql_spa_tools_theme`。
- 只有儲存值為 `light` 時使用淺色；其他值與首次開啟均回到深色。
- 切換行為由共用 [`theme.js`](../theme.js) 管理，不得在個別頁面重複實作。

深色模式的核心 token 定義在 `theme.css` 的 `:root:not([data-theme='light'])`；淺色模式則使用 `:root[data-theme='light']` 的基準配色。

## 核心色彩 token

以下 token 定義於 `theme.css`。新元件應優先使用這些 `--theme-*` token；表格中的色碼是淺色模式基準值，深色模式會由同一 token 自動覆寫。

| Token | 色碼 | 用途 |
| --- | --- | --- |
| `--theme-page` | `#f1eee9` | 全頁背景 |
| `--theme-surface` | `#fbfaf7` | 卡片、面板、輸入框 |
| `--theme-surface-alt` | `#e8e5df` | 表頭、工具列、次級區塊 |
| `--theme-surface-soft` | `#f5f2ee` | hover、程式碼區、柔和底色 |
| `--theme-text` | `#4a4946` | 主要文字 |
| `--theme-muted` | `#797771` | 輔助文字、說明文字 |
| `--theme-border` | `#d7d2ca` | 主要邊框與分隔線 |
| `--theme-border-soft` | `#e5e1db` | 表格細線、次要分隔線 |
| `--theme-primary` | `#82938b` | 主要操作、頁首、選取重點 |
| `--theme-primary-hover` | `#6f8279` | 主要操作 hover、強調邊框 |
| `--theme-secondary` | `#9aa9b8` | 輔助操作、focus、灰藍重點 |
| `--theme-secondary-soft` | `#e4eaee` | 灰藍背景、選取狀態 |
| `--theme-purple` | `#a697ac` | 血緣／分類等次要識別 |
| `--theme-purple-soft` | `#ebe5ed` | 紫灰背景 |
| `--theme-shadow` | `0 8px 24px rgb(74 69 62 / 11%)` | 浮動面板陰影 |

## 語意色規範

語意色只用來表達狀態，不用作一般裝飾或頁面主色。

| 狀態 | 文字／邊框 | 背景 | 使用情境 |
| --- | --- | --- | --- |
| 成功 | `--theme-success` `#78917d` | `--theme-success-soft` `#e3ecdf` | 完成、通過、已寫回、增加 |
| 警告 | `--theme-warning` `#aa8d62` | `--theme-warning-soft` `#f1e8d7` | 注意、待確認、修改 |
| 錯誤 | `--theme-danger` `#ad7774` | `--theme-danger-soft` `#f1dfdc` | 失敗、刪除、錯誤、危險操作 |
| 資訊 | `--theme-info` `#8197a8` | `--theme-info-soft` `#e3eaf0` | 提示、說明、資訊摘要 |

範例：

```css
.message-success {
  color: var(--theme-success);
  background: var(--theme-success-soft);
}

.message-error {
  color: var(--theme-danger);
  background: var(--theme-danger-soft);
}
```

## HTML 引用方式

每個頁面應在 `<head>` 中引用共用樣式：

```html
<link rel="stylesheet" href="theme.css">
<script src="theme.js"></script>
```

引用規則：

- `theme.css` 與 HTML 必須位於同一層目錄。
- `theme.js` 與 HTML 必須位於同一層目錄。
- 新頁面不可複製另一頁的完整 `:root` 色彩設定。
- 新增元件時，先使用 `--theme-*` token；只有既有元件相容需求才使用舊別名。
- 頁面專屬 CSS 可以保留布局與元件細節，但不得重新定義全站基礎色彩。
- 新增頁面時必須提供 `id="themeToggle"` 的按鈕，並引用 `theme.js`。
- 工具頁面必須提供回首頁連結，使用 `class="home-link"` 並指向 `index.html`：

  ```html
  <a class="home-link" href="index.html">⌂ 工具入口</a>
  ```

- `index.html` 本身是入口頁，不需要連結回自己。

## 既有相容別名

為了讓現有頁面逐步共用主題，`theme.css` 也提供 `--bg`、`--panel`、`--text`、`--muted`、`--pri`、`--ok`、`--warn`、`--err`、`--info` 等相容別名。

新程式碼不應再增加相容別名；請直接使用 `--theme-*` token。若修改既有元件，建議同步將舊別名替換為核心 token。

## 元件使用規範

### 按鈕

- 一般按鈕：`--theme-surface` 背景、`--theme-border` 邊框。
- 主要按鈕：`--theme-primary` 背景、淺色文字。
- 輔助按鈕：`--theme-secondary-soft` 背景。
- 危險按鈕：`--theme-danger-soft` 背景、`--theme-danger` 系列文字。
- disabled 狀態應降低透明度，但仍需保留文字辨識度。

### 表單與表格

- 表單控制項使用 `--theme-surface` 背景與 `--theme-border` 邊框。
- focus 使用 `--theme-primary` 邊框或 `--theme-secondary-soft` 外框。
- 表頭使用 `--theme-surface-alt`。
- hover 使用 `--theme-surface-soft`。
- 表格分隔線使用 `--theme-border-soft`。

### Header、Toolbar 與 Footer

- Header 使用 `--theme-primary`，文字使用淺色。
- Toolbar、Footer、次級導覽使用 `--theme-surface` 或 `--theme-surface-alt`。
- 不應在不同頁面重新引入深藍、酒紅、金色等高對比品牌色。

## CSP 與離線引用

`sql-spa-tools-catalog.html` 與 `sql-spa-tools-pii-cleaner.html` 有 Content Security Policy。因為頁面要載入同目錄的 `theme.css`，CSP 必須包含：

```text
style-src 'self' 'unsafe-inline'
script-src 'self' 'unsafe-inline'
```

若新增具有 CSP 的頁面，也要確認瀏覽器 Network／Console 沒有封鎖 `theme.css` 的錯誤。

## 動態報表與匯出

動態產生的 HTML 報表可能被下載到不同位置，不能假設使用者仍能取得根目錄的 `theme.css`。因此：

- 報表內嵌 CSS 應使用與主題相同的固定色碼。
- SVG 節點、連線與標記應使用主題對應色。
- 匯出樣式不得恢復成原本的深色、金色或高飽和色盤。
- 修改主題色時，應同步搜尋各 HTML 內的報表模板與 SVG 色彩設定。

## 驗證方式

在專案根目錄執行：

```powershell
node '.\tests\test-theme.js'
& '.\tests\validate-theme.ps1'
```

驗證內容包括：

- `theme.css` 是否存在且包含核心 token。
- `theme.js` 是否存在且使用 `sql_spa_tools_theme` 儲存模式。
- 6 個 HTML 是否引用 `theme.css`。
- 6 個 HTML 是否都包含 `themeToggle` 與 `theme.js`。
- 5 個工具頁面是否都包含 `home-link` 並指向 `index.html`。
- 未設定主題時是否以深色 token 為預設。
- 具有 CSP 的頁面是否允許同目錄樣式檔。
- Formatter、Catalog、SQL Compare 的動態報表是否包含共用主題色。

完成樣式調整後，仍應在瀏覽器實際開啟入口頁與 5 個工具頁面，確認一般狀態、hover、focus、disabled、成功、警告、錯誤與匯出畫面均維持一致。
