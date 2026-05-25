import { describe, expect, it } from 'vitest';
import type { MonthlyAnalysis, MonthCode, PlantWithMatrix } from '../types/plant';
import type { FloweringStrategy, PlantLayerSummary } from './seasonalSummary';
import { getSeasonalChartData } from './seasonalChartData';

const monthOrder: MonthCode[] = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

const makePlant = (
  id: string,
  overrides: Partial<PlantWithMatrix> = {},
): PlantWithMatrix => {
  const matrix = monthOrder.reduce(
    (values, month) => ({
      ...values,
      [`flower_${month}`]: 0,
      [`leaf_${month}`]: 1,
    }),
    {},
  );

  return {
    plant_id: id,
    chinese_name: id,
    scientific_name: id,
    plant_type: '灌木',
    light_condition: '全日照',
    flower_color: '白',
    flower_color_group: '中性色',
    leaf_color: '綠',
    leaf_color_group: '深綠系',
    display_type: 'flowering',
    flower_impact: 1,
    ...matrix,
    ...overrides,
  } as PlantWithMatrix;
};

const makeAnalysis = (
  leafCounts: Partial<Record<MonthCode, number>>,
): MonthlyAnalysis[] =>
  monthOrder.map((month) => ({
    month,
    monthLabel: month,
    flower_count: 0,
    leaf_count: leafCounts[month] ?? 0,
    heat_score: 0,
    status: '穩定',
    suggestion: '',
  }));

describe('getSeasonalChartData', () => {
  it('builds annual and strategy chart points from flower impact and leaf thresholds', () => {
    const selectedPlants = [
      makePlant('strong', { flower_impact: 3, flower_mar: 1 }),
      makePlant('weak', { flower_impact: 1, flower_apr: 1 }),
      makePlant('foliage', { flower_impact: 0 }),
    ];
    const analysis = makeAnalysis({
      jan: 3,
      feb: 2,
      mar: 1,
    });
    const strategy: FloweringStrategy = {
      id: 'spring',
      label: '春季觀花｜3-5月',
      months: ['mar', 'apr', 'may'],
    };
    const layerSummary: PlantLayerSummary = {
      high: 1,
      middle: 2,
      low: 0,
      score: 57,
      level: '中',
      missingLayers: ['低層'],
      reminder: '缺少低層',
    };

    const data = getSeasonalChartData({
      selectedPlants,
      analysis,
      floweringStrategy: strategy,
      layerSummary,
    });

    expect(data.annual.find((item) => item.month === 'mar')?.flowerPoint).toBe(1);
    expect(data.annual.find((item) => item.month === 'apr')?.flowerPoint).toBe(0.5);
    expect(data.annual.find((item) => item.month === 'may')?.flowerPoint).toBe(0);
    expect(data.annual.find((item) => item.month === 'jan')?.leafPoint).toBe(1);
    expect(data.annual.find((item) => item.month === 'feb')?.leafPoint).toBe(0.5);
    expect(data.annual.find((item) => item.month === 'mar')?.leafPoint).toBe(0);
    expect(data.strategy.map((item) => item.month)).toEqual(['mar', 'apr', 'may']);
    expect(data.layers).toEqual([
      { layer: '高層', count: 1, point: 0.7 },
      { layer: '中層', count: 2, point: 1 },
      { layer: '低層', count: 0, point: 0 },
    ]);
  });
});
