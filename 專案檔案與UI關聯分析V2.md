# 專案檔案與 UI 關聯分析 V2：左右對應資料結構分層版

這份 V2 的閱讀方式和 V1 不同。

V1 偏「整體檔案導覽」，V2 偏「畫面左邊看到什麼，右邊對應到哪個資料結構、哪個狀態、哪個函式、哪個來源檔」。

你可以把它當成一張拆解圖：

```text
網站畫面 UI
  -> React 元件 props
    -> App.tsx state / derived data
      -> utils 計算函式
        -> TypeScript 型別
          -> CSV 原始欄位
```

---

## 1. 最上層：網站畫面與資料分層總覽

| UI 畫面層 | React 元件層 | App 狀態/衍生資料層 | 工具函式層 | 型別層 | 原始資料層 |
| --- | --- | --- | --- | --- | --- |
| 整個網站外框 | `App.tsx` | `plants`, `loading`, `error`, `filters`, `selectedPlantIds` | `loadPlantData`, `filterPlants`, `getMonthlyAnalysis` 等 | `PlantWithMatrix`, `PlantFilters`, `MonthlyAnalysis` | `public/data/plants.csv`, `public/data/display_matrix.csv` |
| 頁首統計 | `Header.tsx` | `plants.length`, `selectedPlants.length` | `getSelectedPlants` | `PlantWithMatrix[]` | 兩份 CSV 合併後資料 |
| 左側篩選面板 | `FilterPanel.tsx` | `filters`, `filterOptions` | `getUniqueOptions` | `PlantFilters` | `plants.csv` 的分類欄位 |
| 左側植物表格 | `PlantTable.tsx` | `filteredPlants`, `selectedPlantIds` | `filterPlants` | `PlantWithMatrix[]` | 合併後植物資料 |
| 右側已選摘要 | `SelectedPlants.tsx` | `selectedPlants`, `monthlyAnalysis`, `averageHeatScore`, `weakestMonth`, `peakMonth` | `getSelectedPlants`, `getAverageHeatScore`, `getWeakestMonth`, `getPeakMonth` | `PlantWithMatrix[]`, `MonthlyAnalysis[]` | 合併後植物資料 |
| 右側每月分析表 | `MonthlyAnalysisTable.tsx` | `monthlyAnalysis` | `getMonthlyAnalysis`, `getStatusColor` | `MonthlyAnalysis[]` | `display_matrix.csv` 的月份矩陣 |
| 右側圖表 | `AnalysisCharts.tsx` | `monthlyAnalysis` | `getMonthlyAnalysis` | `MonthlyAnalysis[]` | `display_matrix.csv` 的月份矩陣 |
| 右側開花/觀葉矩陣 | `MatrixTable.tsx` | `selectedPlants` | `getMatrixValue` | `PlantWithMatrix[]`, `MonthCode` | `flower_*`, `leaf_*` 欄位 |
| 方法說明 | `MethodNote.tsx` | 無動態狀態 | 無 | 無 | 無 |

---

## 2. 左右畫面對應：網站 UI 區塊 vs 資料結構

目前 `App.tsx` 把主畫面切成兩欄：

```text
Header

Grid
  左欄 lg=4
    FilterPanel
    PlantTable

  右欄 lg=8
    SelectedPlants
    MonthlyAnalysisTable
    AnalysisCharts
    MatrixTable flower
    MatrixTable leaf
    MethodNote
```

### 2.1 左欄 UI 對應資料結構

| 左欄 UI | 元件檔案 | 接收 props | props 來自 App 哪裡 | 對應型別 | 對應 CSV 欄位 |
| --- | --- | --- | --- | --- | --- |
| 中文名搜尋框 | `src/components/FilterPanel.tsx` | `filters.chinese_name` | `filters` state | `PlantFilters.chinese_name` | `plants.csv -> chinese_name` |
| 學名搜尋框 | `FilterPanel.tsx` | `filters.scientific_name` | `filters` state | `PlantFilters.scientific_name` | `plants.csv -> scientific_name` |
| 植物類型下拉 | `FilterPanel.tsx` | `options.plant_type` | `filterOptions` | `PlantFilters.plant_type` | `plants.csv -> plant_type` |
| 光照條件下拉 | `FilterPanel.tsx` | `options.light_condition` | `filterOptions` | `PlantFilters.light_condition` | `plants.csv -> light_condition` |
| 花色下拉 | `FilterPanel.tsx` | `options.flower_color` | `filterOptions` | `PlantFilters.flower_color` | `plants.csv -> flower_color` |
| 葉色下拉 | `FilterPanel.tsx` | `options.leaf_color` | `filterOptions` | `PlantFilters.leaf_color` | `plants.csv -> leaf_color` |
| 展示類型下拉 | `FilterPanel.tsx` | `options.display_type` | `filterOptions` | `PlantFilters.display_type` | `plants.csv -> display_type` |
| 重設按鈕 | `FilterPanel.tsx` | `onReset` | `handleResetFilters()` | `PlantFilters` | 無，重設為 `defaultFilters` |
| 植物清單表格 | `src/components/PlantTable.tsx` | `plants` | `filteredPlants` | `PlantWithMatrix[]` | `plants.csv` + `display_matrix.csv` |
| 植物 checkbox | `PlantTable.tsx` | `selectedPlantIds`, `onTogglePlant` | `selectedPlantIds` state, `handleTogglePlant()` | `string[]` | `plant_id` |

左欄的核心資料流：

```text
plants
  + filters
    -> filterPlants(plants, filters)
      -> filteredPlants
        -> PlantTable 顯示

plants
  -> getUniqueOptions(plants, 欄位名稱)
    -> filterOptions
      -> FilterPanel 下拉選單

PlantTable checkbox
  -> handleTogglePlant(plantId)
    -> selectedPlantIds
```

---

### 2.2 右欄 UI 對應資料結構

| 右欄 UI | 元件檔案 | 接收 props | props 來自 App 哪裡 | 對應型別 | 對應資料來源 |
| --- | --- | --- | --- | --- | --- |
| 已選植物 chip | `src/components/SelectedPlants.tsx` | `selectedPlants` | `getSelectedPlants(plants, selectedPlantIds)` | `PlantWithMatrix[]` | 使用者勾選的 `plant_id` |
| 最弱月份 | `SelectedPlants.tsx` | `weakestMonthLabel` | `getWeakestMonth(monthlyAnalysis)` | `MonthlyAnalysis \| null` | 分析後月份資料 |
| 高峰月份 | `SelectedPlants.tsx` | `peakMonthLabel` | `getPeakMonth(monthlyAnalysis)` | `MonthlyAnalysis \| null` | 分析後月份資料 |
| 平均 heat_score | `SelectedPlants.tsx` | `averageHeatScore` | `getAverageHeatScore(monthlyAnalysis)` | `number` | 分析後月份資料 |
| 分析月份數 | `SelectedPlants.tsx` | `analysis.length` | `monthlyAnalysis` | `MonthlyAnalysis[]` | `months.ts` 固定 12 個月 |
| 每月分析表 | `src/components/MonthlyAnalysisTable.tsx` | `analysis` | `monthlyAnalysis` | `MonthlyAnalysis[]` | `selectedPlants` 的月份矩陣 |
| 開花長條圖 | `src/components/AnalysisCharts.tsx` | `analysis` | `monthlyAnalysis` | `MonthlyAnalysis[]` | `flower_count` |
| 葉片長條圖 | `AnalysisCharts.tsx` | `analysis` | `monthlyAnalysis` | `MonthlyAnalysis[]` | `leaf_count` |
| heat_score 折線圖 | `AnalysisCharts.tsx` | `analysis` | `monthlyAnalysis` | `MonthlyAnalysis[]` | `heat_score` |
| 開花月份矩陣 | `src/components/MatrixTable.tsx` | `plants`, `type="flower"` | `selectedPlants` | `PlantWithMatrix[]` | `flower_jan` ~ `flower_dec` |
| 觀葉月份矩陣 | `MatrixTable.tsx` | `plants`, `type="leaf"` | `selectedPlants` | `PlantWithMatrix[]` | `leaf_jan` ~ `leaf_dec` |
| 方法說明 | `src/components/MethodNote.tsx` | 無 | 無 | 無 | 靜態文案 |

右欄的核心資料流：

```text
selectedPlantIds
  + plants
    -> getSelectedPlants(plants, selectedPlantIds)
      -> selectedPlants

selectedPlants
  -> getMonthlyAnalysis(selectedPlants)
    -> monthlyAnalysis
      -> SelectedPlants 摘要
      -> MonthlyAnalysisTable 表格
      -> AnalysisCharts 圖表

selectedPlants
  -> MatrixTable
    -> getMatrixValue(plant, "flower" 或 "leaf", month)
```

---

## 3. 資料結構分層：從 CSV 到畫面

### Layer 0：CSV 原始資料層

檔案：

- `public/data/plants.csv`
- `public/data/display_matrix.csv`

`plants.csv` 的概念結構：

```ts
{
  plant_id: string;
  chinese_name: string;
  scientific_name: string;
  plant_type: string;
  light_condition: string;
  flower_color: string;
  leaf_color: string;
  display_type: string;
}
```

`display_matrix.csv` 的概念結構：

```ts
{
  plant_id: string;
  flower_jan: number;
  flower_feb: number;
  flower_mar: number;
  flower_apr: number;
  flower_may: number;
  flower_jun: number;
  flower_jul: number;
  flower_aug: number;
  flower_sep: number;
  flower_oct: number;
  flower_nov: number;
  flower_dec: number;
  leaf_jan: number;
  leaf_feb: number;
  leaf_mar: number;
  leaf_apr: number;
  leaf_may: number;
  leaf_jun: number;
  leaf_jul: number;
  leaf_aug: number;
  leaf_sep: number;
  leaf_oct: number;
  leaf_nov: number;
  leaf_dec: number;
}
```

兩份 CSV 的連接鍵是：

```text
plant_id
```

---

### Layer 1：TypeScript 型別層

檔案：`src/types/plant.ts`

這層定義「程式裡承認的資料形狀」。

| 型別 | 用途 | 對應 UI |
| --- | --- | --- |
| `MonthCode` | 限制月份代碼只能是 `jan` 到 `dec` | 分析表、圖表、矩陣表 |
| `FlowerMonthKey` | 產生 `flower_jan` 這種 key | 開花矩陣 |
| `LeafMonthKey` | 產生 `leaf_jan` 這種 key | 觀葉矩陣 |
| `Plant` | 一株植物的基本資料 | 篩選面板、植物清單 |
| `DisplayMatrix` | 一株植物的月份矩陣 | 月分析、矩陣表、圖表 |
| `PlantWithMatrix` | `Plant` + `DisplayMatrix` 合併後完整資料 | 幾乎所有主要 UI |
| `MonthlyAnalysis` | 每個月的統計結果 | 右側摘要、表格、圖表 |
| `PlantFilters` | 左側篩選條件 | `FilterPanel` |

最重要的是這個合併型別：

```ts
export interface PlantWithMatrix extends Plant, DisplayMatrix {}
```

意思是：

```text
植物基本資料 + 月份開花/觀葉矩陣 = UI 實際主要使用的植物資料
```

---

### Layer 2：資料載入與清洗層

檔案：`src/utils/loadData.ts`

核心函式：

```ts
loadPlantData(): Promise<PlantWithMatrix[]>
```

它做的事：

1. 讀 `public/data/plants.csv`
2. 讀 `public/data/display_matrix.csv`
3. 用 `Papa.parse` 解析 CSV
4. 清理文字欄位
5. 把數字欄位轉成 number
6. 用 `plant_id` 合併兩份資料
7. 回傳 `PlantWithMatrix[]`

這層輸出的資料會進入 `App.tsx` 的：

```ts
const [plants, setPlants] = useState<PlantWithMatrix[]>([]);
```

因此：

```text
loadData.ts 的輸出 = App.tsx 裡 plants state 的內容
```

---

### Layer 3：App 狀態層

檔案：`src/App.tsx`

`App.tsx` 內有 5 個主要 state：

| state | 型別 | 代表什麼 | 主要影響哪裡 |
| --- | --- | --- | --- |
| `plants` | `PlantWithMatrix[]` | 全部載入完成的植物資料 | 全站資料基礎 |
| `loading` | `boolean` | CSV 是否載入中 | 載入 spinner |
| `error` | `string` | 載入錯誤訊息 | 錯誤 Alert |
| `filters` | `PlantFilters` | 左側目前篩選條件 | `FilterPanel`, `PlantTable` |
| `selectedPlantIds` | `string[]` | 使用者已勾選的植物 ID | 右側所有分析區 |

這層是 UI 的「狀態中心」。

---

### Layer 4：衍生資料與分析層

檔案：

- `src/App.tsx`
- `src/utils/analysis.ts`

`App.tsx` 用 `useMemo` 算出多個衍生資料。

| 衍生資料 | 來源 | 計算函式 | 給誰使用 |
| --- | --- | --- | --- |
| `filteredPlants` | `plants`, `filters` | `filterPlants` | `PlantTable` |
| `selectedPlants` | `plants`, `selectedPlantIds` | `getSelectedPlants` | 右側摘要、表格、圖表、矩陣 |
| `monthlyAnalysis` | `selectedPlants` | `getMonthlyAnalysis` | 右側摘要、每月表、圖表 |
| `averageHeatScore` | `monthlyAnalysis` | `getAverageHeatScore` | `SelectedPlants` |
| `weakestMonth` | `monthlyAnalysis` | `getWeakestMonth` | `SelectedPlants` |
| `peakMonth` | `monthlyAnalysis` | `getPeakMonth` | `SelectedPlants` |
| `filterOptions` | `plants` | `getUniqueOptions` | `FilterPanel` |

這層的目的不是儲存資料，而是把「原始資料」整理成「畫面剛好需要的形狀」。

---

### Layer 5：元件 props 層

這層是 `App.tsx` 把資料分配給 UI 元件的地方。

```tsx
<Header
  totalPlants={plants.length}
  selectedCount={selectedPlants.length}
/>
```

```tsx
<FilterPanel
  filters={filters}
  options={filterOptions}
  onFilterChange={handleFilterChange}
  onReset={handleResetFilters}
/>
```

```tsx
<PlantTable
  plants={filteredPlants}
  selectedPlantIds={selectedPlantIds}
  onTogglePlant={handleTogglePlant}
/>
```

```tsx
<SelectedPlants
  selectedPlants={selectedPlants}
  analysis={monthlyAnalysis}
  averageHeatScore={averageHeatScore}
  weakestMonthLabel={...}
  peakMonthLabel={...}
/>
```

```tsx
<MonthlyAnalysisTable analysis={monthlyAnalysis} />
<AnalysisCharts analysis={monthlyAnalysis} />
<MatrixTable plants={selectedPlants} type="flower" />
<MatrixTable plants={selectedPlants} type="leaf" />
```

這表示：

```text
元件本身大多只負責顯示
真正的資料狀態與分析計算集中在 App.tsx + utils
```

---

## 4. 左側篩選資料結構詳細對照

左側篩選面板的資料型別是：

```ts
export interface PlantFilters {
  chinese_name: string;
  scientific_name: string;
  plant_type: string;
  light_condition: string;
  flower_color: string;
  leaf_color: string;
  display_type: string;
}
```

初始值在 `src/utils/analysis.ts`：

```ts
export const defaultFilters: PlantFilters = {
  chinese_name: '',
  scientific_name: '',
  plant_type: '',
  light_condition: '',
  flower_color: '',
  leaf_color: '',
  display_type: '',
};
```

左側欄位與資料對應：

| UI 控制項 | `filters` 欄位 | 篩選方式 | 資料來源欄位 |
| --- | --- | --- | --- |
| 中文名文字輸入 | `chinese_name` | contains 模糊比對 | `plant.chinese_name` |
| 學名文字輸入 | `scientific_name` | contains 模糊比對 | `plant.scientific_name` |
| 植物類型下拉 | `plant_type` | contains 模糊比對 | `plant.plant_type` |
| 光照下拉 | `light_condition` | contains 模糊比對 | `plant.light_condition` |
| 花色下拉 | `flower_color` | contains 模糊比對 | `plant.flower_color` |
| 葉色下拉 | `leaf_color` | contains 模糊比對 | `plant.leaf_color` |
| 展示類型下拉 | `display_type` | contains 模糊比對 | `plant.display_type` |

篩選後的結果是：

```ts
const filteredPlants = filterPlants(plants, filters);
```

再傳入：

```tsx
<PlantTable plants={filteredPlants} />
```

---

## 5. 右側分析資料結構詳細對照

右側主要依賴 `MonthlyAnalysis`：

```ts
export interface MonthlyAnalysis {
  month: MonthCode;
  monthLabel: string;
  flower_count: number;
  leaf_count: number;
  heat_score: number;
  status: '...';
  suggestion: string;
}
```

它是由：

```ts
getMonthlyAnalysis(selectedPlants)
```

產生的。

每個月的計算邏輯：

```text
flower_count = 所有已選植物在該月 flower_xxx 的總和
leaf_count = 所有已選植物在該月 leaf_xxx 的總和
heat_score = flower_count * 2 + leaf_count
```

右側 UI 與 `MonthlyAnalysis` 欄位對應：

| 右側 UI | 使用欄位 |
| --- | --- |
| 每月分析表的月份 | `monthLabel` |
| 每月分析表的開花數 | `flower_count` |
| 每月分析表的觀葉數 | `leaf_count` |
| 每月分析表的分數 | `heat_score` |
| 每月分析表的狀態 chip | `status` |
| 每月分析表的建議 | `suggestion` |
| 開花長條圖 | `flower_count` |
| 葉片長條圖 | `leaf_count` |
| heat_score 折線圖 | `heat_score` |
| 最弱月份 | `heat_score` 最低的那筆 |
| 高峰月份 | `heat_score` 最高的那筆 |
| 平均 heat_score | 12 個月 `heat_score` 平均 |

---

## 6. 矩陣表資料結構：開花與觀葉如何對應月份

月份定義在：

```text
src/utils/months.ts
```

內容概念：

```ts
[
  { code: 'jan', label: 'Jan' },
  { code: 'feb', label: 'Feb' },
  ...
  { code: 'dec', label: 'Dec' },
]
```

`MatrixTable` 會依 `type` 決定要讀哪一組欄位：

| `MatrixTable` type | 讀取欄位模式 | 顯示內容 |
| --- | --- | --- |
| `flower` | `flower_${month}` | 開花月份矩陣 |
| `leaf` | `leaf_${month}` | 觀葉月份矩陣 |

實際取值函式：

```ts
getMatrixValue(plant, type, month)
```

概念上等於：

```ts
plant[`${type}_${month}`]
```

例如：

```text
type = flower, month = apr -> plant.flower_apr
type = leaf, month = sep -> plant.leaf_sep
```

---

## 7. 一張完整的資料流向圖

```text
public/data/plants.csv
  -> Plant 基本資料

public/data/display_matrix.csv
  -> DisplayMatrix 月份矩陣

Plant + DisplayMatrix
  -> PlantWithMatrix
  -> App.tsx: plants

plants + filters
  -> filterPlants()
  -> filteredPlants
  -> PlantTable

plants + selectedPlantIds
  -> getSelectedPlants()
  -> selectedPlants
  -> SelectedPlants
  -> MatrixTable flower
  -> MatrixTable leaf

selectedPlants
  -> getMonthlyAnalysis()
  -> monthlyAnalysis
  -> MonthlyAnalysisTable
  -> AnalysisCharts
  -> SelectedPlants summary

monthlyAnalysis
  -> getAverageHeatScore()
  -> averageHeatScore

monthlyAnalysis
  -> getWeakestMonth()
  -> weakestMonth

monthlyAnalysis
  -> getPeakMonth()
  -> peakMonth
```

---

## 8. 從 UI 反查檔案的速查表

| 你看到的畫面 | 先看元件 | 再看資料/邏輯 | 最後看型別/來源 |
| --- | --- | --- | --- |
| 頁首總植物數、已選數 | `Header.tsx` | `App.tsx` 的 `plants.length`, `selectedPlants.length` | `PlantWithMatrix[]` |
| 左側所有篩選欄位 | `FilterPanel.tsx` | `filters`, `filterOptions`, `getUniqueOptions` | `PlantFilters`, `plants.csv` |
| 左側植物表格 | `PlantTable.tsx` | `filteredPlants`, `filterPlants` | `PlantWithMatrix`, 兩份 CSV |
| 勾選植物後右側 chip | `SelectedPlants.tsx` | `selectedPlants`, `getSelectedPlants` | `selectedPlantIds`, `plant_id` |
| 最弱月份/高峰月份 | `SelectedPlants.tsx` | `getWeakestMonth`, `getPeakMonth` | `MonthlyAnalysis` |
| 每月分析表 | `MonthlyAnalysisTable.tsx` | `monthlyAnalysis`, `getMonthlyAnalysis` | `MonthlyAnalysis` |
| 三張圖表 | `AnalysisCharts.tsx` | `monthlyAnalysis` | `MonthlyAnalysis` |
| 開花矩陣表 | `MatrixTable.tsx` | `getMatrixValue` | `flower_jan` ~ `flower_dec` |
| 觀葉矩陣表 | `MatrixTable.tsx` | `getMatrixValue` | `leaf_jan` ~ `leaf_dec` |
| 方法文字 | `MethodNote.tsx` | 無 | 靜態內容 |

---

## 9. 如果你要修改功能，應該改哪一層

### 只改畫面文字或排版

優先改：

- `src/components/*.tsx`
- `src/App.tsx`
- `src/theme.ts`

### 改篩選邏輯

優先改：

- `src/utils/analysis.ts`
- `src/types/plant.ts`
- `src/components/FilterPanel.tsx`

如果新增一個篩選欄位，通常要同時動：

1. `PlantFilters`
2. `defaultFilters`
3. `FilterPanel`
4. `filterPlants`
5. `filterOptions`
6. `plants.csv` 欄位

### 改分析公式

優先改：

- `src/utils/analysis.ts`

例如目前公式是：

```text
heat_score = flower_count * 2 + leaf_count
```

如果要改成別的權重，改 `getMonthlyAnalysis()` 裡的 `heat_score` 計算即可。

### 改圖表顯示

優先改：

- `src/components/AnalysisCharts.tsx`

它使用 `recharts`，資料來源是 `MonthlyAnalysis[]`。

### 改月份矩陣

優先改：

- `src/components/MatrixTable.tsx`
- `src/utils/months.ts`
- `src/types/plant.ts`
- `public/data/display_matrix.csv`

---

## 10. 目前需要注意的地方

### 10.1 程式碼中的中文文案有亂碼

多個 `.tsx` 與 `.ts` 檔案內的中文 UI 文案目前看起來是亂碼。這會讓網站上顯示的中文標題、說明、錯誤訊息不易閱讀。

但 `public/data/plants.csv` 的中文資料看起來正常，因此問題比較像是程式碼檔案文字編碼或先前轉檔造成的文案損壞。

### 10.2 `dist/` 是 build 後產物

`dist/` 裡的內容是打包後輸出，平常修改功能時應該改 `src/` 與 `public/`，不要以 `dist/` 作為主要編輯來源。

### 10.3 這個專案的架構其實很集中

理解順序可以抓成：

```text
App.tsx
  -> state
  -> useMemo derived data
  -> components props
  -> utils functions
  -> types
  -> CSV
```

只要看懂 `App.tsx` 的 state 與 props 分配，整個網站大概就能串起來。

---

## 11. 最短版本：左右資料結構口訣

左邊是「找植物、選植物」：

```text
filters -> filteredPlants -> selectedPlantIds
```

右邊是「把已選植物拿去分析」：

```text
selectedPlantIds -> selectedPlants -> monthlyAnalysis -> tables/charts/summary
```

全站最重要的資料型別是：

```text
PlantWithMatrix
```

全站最重要的分析型別是：

```text
MonthlyAnalysis
```

全站最重要的總控檔案是：

```text
src/App.tsx
```
