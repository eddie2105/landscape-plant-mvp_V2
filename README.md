# Landscape Seasonal Planting Analyzer

景觀植物季相分析工具 MVP，使用 React + TypeScript + Vite 建立，專注於前端資料分析體驗。此工具會從 `public/data/` 讀取植物資料 CSV，讓景觀設計師可在單頁式 Dashboard 中搜尋植物、勾選植栽組合，並立即查看每月花期、葉相與景觀熱度分析。

## 安裝方式

1. 進入專案資料夾：

```bash
cd landscape-plant-mvp
```

2. 安裝套件：

```bash
npm install
```

## 如何執行

啟動本地開發伺服器：

```bash
npm run dev
```

如果要先確認正式建置是否成功，可執行：

```bash
npm run build
```

## CSV 檔案放置位置

請將 CSV 檔案放在以下位置：

```text
landscape-plant-mvp/public/data/plants.csv
landscape-plant-mvp/public/data/display_matrix.csv
```

## plants.csv 欄位說明

- `plant_id`：植物編號，請保留字串格式，例如 `001`
- `chinese_name`：中文名稱
- `scientific_name`：學名
- `plant_type`：植物類型
- `light_condition`：光照條件
- `flower_color`：花色
- `leaf_color`：葉色
- `display_type`：景觀表現類型

## display_matrix.csv 欄位說明

- `plant_id`：植物編號，需與 `plants.csv` 對應
- `flower_jan` ~ `flower_dec`：每月花期矩陣，建議用 `0` 或 `1`
- `leaf_jan` ~ `leaf_dec`：每月葉相矩陣，建議用 `0` 或 `1`

## 如何從 Excel 另存成 CSV

1. 用 Excel 開啟原始資料檔。
2. 確認第一列是欄位名稱，且不要有合併儲存格。
3. 點選「另存新檔」。
4. 檔案格式選擇 `CSV UTF-8 (逗號分隔)(*.csv)`。
5. 檔名請分別存成 `plants.csv` 與 `display_matrix.csv`。
6. 將檔案放入 `public/data/` 資料夾。

## 常見錯誤與解法

- 畫面顯示 CSV 載入失敗：
  請確認 `public/data/` 內的檔案名稱完全正確，並重新啟動 `npm run dev`。

- `plant_id` 變成 `1` 而不是 `001`：
  請在 Excel 中先把 `plant_id` 欄位格式改成文字，再匯出 CSV。

- 有些植物沒有出現在分析結果：
  代表該筆 `plant_id` 在 `display_matrix.csv` 找不到對應矩陣，系統會略過並在瀏覽器 console 顯示警告。

- 篩選不到多值欄位：
  請確認 CSV 中的值有正常填寫，例如 `白、粉紅`。系統採用 contains 邏輯，只要包含關鍵字就能找到。

- `npm install` 失敗：
  請先確認網路連線，或檢查公司內網是否限制 npm registry 存取。
