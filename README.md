# Planting Combination Checker MVP
# 植栽搭配初步檢查工具

Planting Combination Checker 是一個以 React + TypeScript + Vite 建立的前端 MVP，主要探索如何將植栽搭配中的季節亮點、全年綠量穩定度與空間層次，轉換成較容易被理解與討論的視覺化檢查工具。

此工具適合景觀初學者、非景觀背景設計者，以及想初步理解植栽搭配邏輯的使用者。它不是要取代專業景觀設計，而是作為植栽配置初期的理解、檢查與溝通輔助。

## Scoring Method｜檢查邏輯

本工具目前以三個面向檢查植栽搭配：

### 1. 季節亮點

季節亮點會依使用者選擇的「想看的花季」計算。  
每個目標月份會加總當月開花植物的 `flower_impact`，用來判斷該月是否具有明顯開花亮點。

- 花量影響值 ≥ 3：表現明顯
- 花量影響值 ≥ 1：基本支撐
- 無開花表現：建議補強

### 2. 全年綠量穩定度

全年綠量穩定度用來判斷非花期時是否仍有穩定背景綠量。

`leaf_coverage = leaf_count / selectedPlantCount`

- 覆蓋率 ≥ 80%：表現明顯
- 覆蓋率 ≥ 60%：基本支撐
- 覆蓋率 < 60%：建議補強

### 3. 空間層次完整度

系統依據植物類型判斷高、中、低層：

- 喬木：高層
- 灌木：中層
- 草本 / 地被：低層

每一層依照植物數量給分：

- 2 種以上：1 分
- 1 種：0.7 分
- 0 種：0 分


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
