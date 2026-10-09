# Excel／CSV 轉 SQL UAT 測試檔案

請在工具頁選擇檔案後，分別測試以下情境：

| 檔案 | 測試重點 | 建議設定 |
| --- | --- | --- |
| `uat-basic-utf8.csv` | 引號、逗號、多行儲存格、NULL、前導零、日期與布林值 | 編碼選「自動偵測 BOM」；Header 開啟 |
| `uat-big5-cp950.csv` | Big5／CP950 繁體中文檔案 | 編碼選「Big5／CP950」；Header 開啟 |
| `uat-utf16le.csv` | UTF-16 Little Endian | 編碼選「自動偵測 BOM」；Header 開啟 |
| `uat-utf16be.csv` | UTF-16 Big Endian | 編碼選「自動偵測 BOM」；Header 開啟 |
| `uat-no-header-utf8.tsv` | Tab 分隔且沒有欄位標題 | 編碼選「UTF-8」；欄位名稱模式選「自動產生欄位名稱」 |

也請測試「啟用自訂欄位名稱」：勾選後輸入 `member_id, city, postal_code, score`，再按「套用自訂欄位名稱」載入無標題 TSV，確認欄位數量一致時可正常產生 SQL，數量不一致時會顯示錯誤。此選項預設不啟用。

建議將資料表名稱設為 `uat_import_test`，並依序切換 PostgreSQL、MySQL、SQL Server、Oracle、SQLite，確認 DDL、DML、複製與下載內容均正常。
