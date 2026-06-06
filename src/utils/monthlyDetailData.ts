import type { MonthlyAnalysis, MonthCode, PlantWithMatrix } from '../types/plant';
import type { FloweringStrategy } from './seasonalSummary';

export interface MonthlyDetailInput {
  selectedPlants: PlantWithMatrix[];
  analysis: MonthlyAnalysis[];
  floweringStrategy: FloweringStrategy;
}

export interface MonthlyDetailRow {
  month: MonthCode;
  monthLabel: string;
  isTargetMonth: boolean;
  flowerSources: string[];
  flowerImpact: number;
  flowerState: '弱' | '中' | '強';
  leafCoverageLabel: string;
  leafState: '弱' | '中' | '強';
  reason: string;
}

const getFlowerImpact = (plant: PlantWithMatrix): number =>
  Math.max(0, Math.min(3, Number.isFinite(plant.flower_impact) ? plant.flower_impact : 1));

const getFlowerState = (flowerImpact: number): MonthlyDetailRow['flowerState'] => {
  if (flowerImpact >= 3) return '強';
  if (flowerImpact >= 1) return '中';
  return '弱';
};

const getLeafState = (leafCoveragePercent: number): MonthlyDetailRow['leafState'] => {
  if (leafCoveragePercent >= 80) return '強';
  if (leafCoveragePercent >= 60) return '中';
  return '弱';
};

const getFriendlyStateLabel = (state: MonthlyDetailRow['flowerState']): string => {
  if (state === '強') return '表現明顯';
  if (state === '中') return '基本支撐';
  return '建議補強';
};

const getReason = ({
  isTargetMonth,
  flowerState,
  leafState,
}: {
  isTargetMonth: boolean;
  flowerState: MonthlyDetailRow['flowerState'];
  leafState: MonthlyDetailRow['leafState'];
}): string => {
  const parts: string[] = [];

  if (isTargetMonth) {
    parts.push(
      flowerState === '弱'
        ? '想看的花季內缺少季節亮點，建議補強'
        : `想看的花季內，季節亮點${getFriendlyStateLabel(flowerState)}`,
    );
  } else {
    parts.push('非想看的花季');
  }

  if (leafState === '強') {
    parts.push('全年綠量穩定');
  } else if (leafState === '中') {
    parts.push('全年綠量基本支撐');
  } else {
    parts.push('全年綠量建議補強');
  }

  return parts.join('；');
};

export const getMonthlyDetailData = ({
  selectedPlants,
  analysis,
  floweringStrategy,
}: MonthlyDetailInput): MonthlyDetailRow[] => {
  const selectedCount = selectedPlants.length;

  return analysis.map((item) => {
    const flowerKey = `flower_${item.month}` as const;
    const floweringPlants = selectedPlants.filter((plant) => plant[flowerKey] > 0);
    const flowerSources = floweringPlants.map(
      (plant) => `${plant.chinese_name}(${getFlowerImpact(plant)})`,
    );
    const flowerImpact = floweringPlants.reduce(
      (sum, plant) => sum + getFlowerImpact(plant),
      0,
    );
    const leafCoveragePercent =
      selectedCount === 0 ? 0 : Math.round((item.leaf_count / selectedCount) * 100);
    const flowerState = getFlowerState(flowerImpact);
    const leafState = getLeafState(leafCoveragePercent);
    const isTargetMonth = floweringStrategy.months.includes(item.month);

    return {
      month: item.month,
      monthLabel: item.monthLabel,
      isTargetMonth,
      flowerSources,
      flowerImpact,
      flowerState,
      leafCoverageLabel: `${item.leaf_count} / ${selectedCount} 種，${leafCoveragePercent}%`,
      leafState,
      reason: getReason({ isTargetMonth, flowerState, leafState }),
    };
  });
};
