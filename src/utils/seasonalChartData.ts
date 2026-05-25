import type { MonthlyAnalysis, MonthCode, PlantWithMatrix } from '../types/plant';
import type { FloweringStrategy, PlantLayerSummary } from './seasonalSummary';

export interface SeasonalChartInput {
  selectedPlants: PlantWithMatrix[];
  analysis: MonthlyAnalysis[];
  floweringStrategy: FloweringStrategy;
  layerSummary: PlantLayerSummary;
}

export interface AnnualSeasonalPoint {
  month: MonthCode;
  monthLabel: string;
  flowerPoint: number;
  leafPoint: number;
  flowerImpact: number;
  leafCoveragePercent: number;
}

export interface LayerChartPoint {
  layer: string;
  count: number;
  point: number;
}

export interface SeasonalChartData {
  annual: AnnualSeasonalPoint[];
  strategy: AnnualSeasonalPoint[];
  layers: LayerChartPoint[];
}

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

const getFlowerPoint = (flowerImpact: number): number => {
  if (flowerImpact >= 3) return 1;
  if (flowerImpact >= 1) return 0.5;
  return 0;
};

const getLeafPoint = (leafCount: number, selectedCount: number): number => {
  if (selectedCount === 0) return 0;

  const coverage = leafCount / selectedCount;
  if (coverage >= 0.8) return 1;
  if (coverage >= 0.6) return 0.5;
  return 0;
};

const getLayerPoint = (count: number): number => {
  if (count >= 2) return 1;
  if (count === 1) return 0.7;
  return 0;
};

export const getSeasonalChartData = ({
  selectedPlants,
  analysis,
  floweringStrategy,
  layerSummary,
}: SeasonalChartInput): SeasonalChartData => {
  const selectedCount = selectedPlants.length;

  const annual = analysis.map((item) => {
    const flowerImpact = getMonthlyFlowerImpact(selectedPlants, item.month);
    const leafCoveragePercent =
      selectedCount === 0 ? 0 : Math.round((item.leaf_count / selectedCount) * 100);

    return {
      month: item.month,
      monthLabel: item.monthLabel,
      flowerPoint: getFlowerPoint(flowerImpact),
      leafPoint: getLeafPoint(item.leaf_count, selectedCount),
      flowerImpact,
      leafCoveragePercent,
    };
  });

  return {
    annual,
    strategy: annual.filter((item) => floweringStrategy.months.includes(item.month)),
    layers: [
      { layer: '高層', count: layerSummary.high, point: getLayerPoint(layerSummary.high) },
      { layer: '中層', count: layerSummary.middle, point: getLayerPoint(layerSummary.middle) },
      { layer: '低層', count: layerSummary.low, point: getLayerPoint(layerSummary.low) },
    ],
  };
};
