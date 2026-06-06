import type { MonthlyAnalysis, MonthCode, PlantWithMatrix } from '../types/plant';

export interface SeasonalIndex {
  score: number;
  level: string;
  note: string;
}

export type FloweringStrategyId =
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  | 'spring_summer'
  | 'year_round';

export interface FloweringStrategy {
  id: FloweringStrategyId;
  label: string;
  months: MonthCode[];
}

export interface SeasonalFloweringScore {
  id: FloweringStrategyId;
  label: string;
  score: number;
  level: string;
  weakMonths: MonthlyAnalysis[];
}

export interface PlantLayerSummary {
  high: number;
  middle: number;
  low: number;
  score: number;
  level: string;
  missingLayers: string[];
  reminder: string;
}

export interface SeasonalSummary {
  floweringIndex: SeasonalIndex;
  leafIndex: SeasonalIndex;
  layerSummary: PlantLayerSummary;
  floweringStrategy: FloweringStrategy;
  seasonalFloweringOverview: SeasonalFloweringScore[];
  floweringMonths: MonthlyAnalysis[];
  weakFlowerMonths: MonthlyAnalysis[];
  floweringWarnings: string[];
  weakLeafMonths: MonthlyAnalysis[];
  leafWarnings: string[];
  winterFlowerWeak: boolean;
  designReminder: string;
}

export const floweringStrategies: FloweringStrategy[] = [
  { id: 'spring', label: '春季觀花｜3-5月', months: ['mar', 'apr', 'may'] },
  { id: 'summer', label: '夏季觀花｜6-8月', months: ['jun', 'jul', 'aug'] },
  { id: 'autumn', label: '秋季觀花｜9-11月', months: ['sep', 'oct', 'nov'] },
  { id: 'winter', label: '冬季觀花｜12-2月', months: ['dec', 'jan', 'feb'] },
  { id: 'spring_summer', label: '春夏觀花｜3-8月', months: ['mar', 'apr', 'may', 'jun', 'jul', 'aug'] },
  {
    id: 'year_round',
    label: '全年觀花輔助｜1-12月',
    months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  },
];

const overviewStrategyIds = new Set<FloweringStrategyId>(['spring', 'summer', 'autumn', 'winter']);
const winterMonths = new Set<MonthCode>(['dec', 'jan', 'feb']);

const toScore = (value: number): number => Math.round(Math.max(0, Math.min(100, value)));

const getIndexLevel = (score: number): string => {
  if (score >= 80) return '高';
  if (score >= 60) return '中高';
  if (score >= 40) return '中';
  return '偏低';
};

const getFloweringNote = (score: number, earnedPoints: number, targetMonthCount: number): string => {
  if (score >= 80) return `達成 ${earnedPoints} / ${targetMonthCount}，想看的花季表現明顯`;
  if (score >= 60) return `達成 ${earnedPoints} / ${targetMonthCount}，想看的花季有基本支撐`;
  if (score >= 40) return `達成 ${earnedPoints} / ${targetMonthCount}，部分月份季節亮點偏弱`;
  return `達成 ${earnedPoints} / ${targetMonthCount}，想看的花季建議補強`;
};

const getLeafNote = (score: number): string => {
  if (score >= 80) return '全年綠量穩定';
  if (score >= 60) return '全年綠量有基本支撐';
  if (score >= 40) return '部分月份綠量不足';
  return '全年綠量支撐偏弱';
};

const monthLabels = (months: MonthlyAnalysis[]): string =>
  months.map((item) => item.monthLabel).join('、');

const getFloweringStrategy = (strategyId: FloweringStrategyId): FloweringStrategy =>
  floweringStrategies.find((strategy) => strategy.id === strategyId) ?? floweringStrategies[4];

const getFlowerImpact = (plant: PlantWithMatrix): number =>
  Math.max(0, Math.min(3, Number.isFinite(plant.flower_impact) ? plant.flower_impact : 1));

const getMonthlyFlowerImpact = (
  selectedPlants: PlantWithMatrix[],
  month: MonthCode,
): number => {
  const flowerKey = `flower_${month}` as const;
  return selectedPlants.reduce(
    (sum, plant) => sum + (plant[flowerKey] > 0 ? getFlowerImpact(plant) : 0),
    0,
  );
};

const getMonthlyFlowerPoint = (flowerImpact: number): number => {
  if (flowerImpact >= 3) return 1;
  if (flowerImpact >= 1) return 0.5;
  return 0;
};

const getLeafMonthlyPoint = (leafCount: number, selectedCount: number): number => {
  if (selectedCount === 0) return 0;

  const coverage = leafCount / selectedCount;
  if (coverage >= 0.8) return 1;
  if (coverage >= 0.6) return 0.5;
  return 0;
};

const getFloweringScore = (
  selectedPlants: PlantWithMatrix[],
  analysis: MonthlyAnalysis[],
  strategy: FloweringStrategy,
): { score: number; earnedPoints: number; weakMonths: MonthlyAnalysis[] } => {
  const targetMonths = analysis.filter((item) => strategy.months.includes(item.month));
  const earnedPoints = targetMonths.reduce((sum, item) => {
    const monthlyImpact = getMonthlyFlowerImpact(selectedPlants, item.month);
    return sum + getMonthlyFlowerPoint(monthlyImpact);
  }, 0);

  return {
    score: targetMonths.length === 0 ? 0 : toScore((earnedPoints / targetMonths.length) * 100),
    earnedPoints,
    weakMonths: targetMonths.filter(
      (item) => getMonthlyFlowerPoint(getMonthlyFlowerImpact(selectedPlants, item.month)) === 0,
    ),
  };
};

export const getPlantLayerLabels = (plant: PlantWithMatrix): string[] => {
  const plantType = plant.plant_type;
  const labels: string[] = [];

  if (plantType.includes('喬木')) {
    labels.push('高層植栽');
  }

  if (plantType.includes('灌木')) {
    labels.push('中層植栽');
  }

  if (plantType.includes('草本') || plantType.includes('地被')) {
    labels.push('低層植栽');
  }

  return labels.length > 0 ? labels : ['未分類植栽'];
};

export const getPlantLayerSortRank = (plant: PlantWithMatrix): number => {
  const labels = getPlantLayerLabels(plant);

  if (labels.includes('高層植栽')) return 1;
  if (labels.includes('中層植栽')) return 2;
  if (labels.includes('低層植栽')) return 3;
  return 4;
};

const getLayerPoint = (count: number): number => {
  if (count >= 2) return 1;
  if (count === 1) return 0.7;
  return 0;
};

const getLayerSummary = (selectedPlants: PlantWithMatrix[]): PlantLayerSummary => {
  const layerSummary = selectedPlants.reduce(
    (summary, plant) => {
      const layerLabels = getPlantLayerLabels(plant);

      if (layerLabels.includes('高層植栽')) {
        summary.high += 1;
      }

      if (layerLabels.includes('中層植栽')) {
        summary.middle += 1;
      }

      if (layerLabels.includes('低層植栽')) {
        summary.low += 1;
      }

      return summary;
    },
    { high: 0, middle: 0, low: 0 },
  );

  const missingLayers: string[] = [];
  if (layerSummary.high === 0) missingLayers.push('高層');
  if (layerSummary.middle === 0) missingLayers.push('中層');
  if (layerSummary.low === 0) missingLayers.push('低層');

  const score = toScore(
    ((getLayerPoint(layerSummary.high) +
      getLayerPoint(layerSummary.middle) +
      getLayerPoint(layerSummary.low)) /
      3) *
      100,
  );

  let reminder = '高、中、低層皆有，空間層次完整。';
  if (missingLayers.length > 0) {
    const suggestions: string[] = [];
    if (layerSummary.high === 0) suggestions.push('補喬木或小喬木作為上層骨架');
    if (layerSummary.middle === 0) suggestions.push('補灌木形成中層量體');
    if (layerSummary.low === 0) suggestions.push('補草本或地被銜接低層');
    reminder = `缺少${missingLayers.join('、')}，可${suggestions.join('，')}。`;
  }

  return {
    ...layerSummary,
    score,
    level: getIndexLevel(score),
    missingLayers,
    reminder,
  };
};

export const getSeasonalSummary = (
  selectedPlants: PlantWithMatrix[],
  analysis: MonthlyAnalysis[],
  floweringStrategyId: FloweringStrategyId = 'spring_summer',
): SeasonalSummary => {
  const selectedCount = selectedPlants.length;
  const floweringStrategy = getFloweringStrategy(floweringStrategyId);
  const floweringMonths = analysis.filter((item) => item.flower_count > 0);
  const floweringScore = getFloweringScore(selectedPlants, analysis, floweringStrategy);
  const weakFlowerMonths = floweringScore.weakMonths;
  const floweringWarnings = weakFlowerMonths.map((item) => item.monthLabel);
  const winterFlowerWeak = analysis.some(
    (item) => winterMonths.has(item.month) && item.flower_count === 0,
  );

  const seasonalFloweringOverview = floweringStrategies
    .filter((strategy) => overviewStrategyIds.has(strategy.id))
    .map((strategy) => {
      const seasonScore = getFloweringScore(selectedPlants, analysis, strategy);

      return {
        id: strategy.id,
        label: strategy.label.split('｜')[0],
        score: seasonScore.score,
        level: getIndexLevel(seasonScore.score),
        weakMonths: seasonScore.weakMonths,
      };
    });

  const leafScore =
    selectedCount === 0
      ? 0
      : toScore(
          (analysis.reduce((sum, item) => sum + getLeafMonthlyPoint(item.leaf_count, selectedCount), 0) /
            12) *
            100,
        );

  const weakLeafMonths =
    selectedCount === 0
      ? []
      : analysis.filter((item) => item.leaf_count / selectedCount < 0.6);
  const leafWarnings = weakLeafMonths.map((item) => item.monthLabel);
  const layerSummary = getLayerSummary(selectedPlants);

  const reminderParts: string[] = [];

  if (selectedCount === 0) {
    reminderParts.push('請先加入植物，系統會依想看的花季、全年綠量穩定度與空間層次產生提醒。');
  } else {
    if (floweringMonths.length > 0) {
      reminderParts.push(
        `目前選擇 ${floweringStrategy.label}，已選組合主要季節亮點月份為 ${monthLabels(
          floweringMonths,
        )}。`,
      );
    } else {
      reminderParts.push(`目前選擇 ${floweringStrategy.label}，此組植物尚未形成明顯季節亮點月份。`);
    }

    if (weakFlowerMonths.length > 0) {
      reminderParts.push(
        `想看的花季內 ${monthLabels(weakFlowerMonths)} 季節亮點不足，可補入對應月份的明顯觀花植物。`,
      );
    } else {
      reminderParts.push('想看的花季內每個月份皆有明顯季節亮點。');
    }

    if (leafWarnings.length > 3) {
      reminderParts.push(`全年有 ${leafWarnings.length} 個月份綠量覆蓋低於 60%，需留意背景綠量斷層。`);
    } else if (leafScore >= 80) {
      reminderParts.push('全年綠量穩定度高，可作為穩定背景綠量。');
    } else if (leafScore < 60) {
      reminderParts.push('全年綠量穩定度偏低，若作為背景植栽，需補常綠觀葉植物。');
    } else {
      reminderParts.push('全年綠量有基本支撐，可搭配常綠觀葉植物提高穩定度。');
    }

    if (layerSummary.score < 80) {
      reminderParts.push(layerSummary.reminder);
    }
  }

  return {
    floweringIndex: {
      score: floweringScore.score,
      level: getIndexLevel(floweringScore.score),
      note: getFloweringNote(
        floweringScore.score,
        floweringScore.earnedPoints,
        floweringStrategy.months.length,
      ),
    },
    leafIndex: {
      score: leafScore,
      level: getIndexLevel(leafScore),
      note: getLeafNote(leafScore),
    },
    layerSummary,
    floweringStrategy,
    seasonalFloweringOverview,
    floweringMonths,
    weakFlowerMonths,
    floweringWarnings,
    weakLeafMonths,
    leafWarnings,
    winterFlowerWeak,
    designReminder: reminderParts.join(''),
  };
};
