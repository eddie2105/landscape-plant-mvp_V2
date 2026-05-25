import { describe, expect, it } from 'vitest';
import type { MonthlyAnalysis, MonthCode, PlantWithMatrix } from '../types/plant';
import { getSeasonalSummary } from './seasonalSummary';

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

const monthLabels: Record<MonthCode, string> = {
  jan: 'Jan',
  feb: 'Feb',
  mar: 'Mar',
  apr: 'Apr',
  may: 'May',
  jun: 'Jun',
  jul: 'Jul',
  aug: 'Aug',
  sep: 'Sep',
  oct: 'Oct',
  nov: 'Nov',
  dec: 'Dec',
};

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
    chinese_name: `測試植物 ${id}`,
    scientific_name: `Plant ${id}`,
    plant_type: '灌木',
    light_condition: '全日照',
    flower_color: '白',
    flower_color_group: '白色系',
    leaf_color: '綠',
    leaf_color_group: '綠色系',
    display_type: 'flowering',
    flower_impact: 1,
    ...matrix,
    ...overrides,
  } as PlantWithMatrix;
};

const makeAnalysis = (
  flowerCounts: Partial<Record<MonthCode, number>>,
  leafCounts: Partial<Record<MonthCode, number>>,
): MonthlyAnalysis[] =>
  monthOrder.map((month) => ({
    month,
    monthLabel: monthLabels[month],
    flower_count: flowerCounts[month] ?? 0,
    leaf_count: leafCounts[month] ?? 0,
    heat_score: 0,
    status: '穩定' as MonthlyAnalysis['status'],
    suggestion: '',
  }));

describe('getSeasonalSummary', () => {
  it('scores flowering by flower impact instead of only counting flowering plants', () => {
    const selectedPlants = [
      makePlant('strong-flower', { flower_impact: 3, flower_mar: 1 }),
      makePlant('weak-flower', { flower_impact: 1, flower_apr: 1 }),
      makePlant('foliage-only', { flower_impact: 0 }),
    ];
    const analysis = makeAnalysis(
      {
        mar: 1,
        apr: 1,
        may: 0,
      },
      {},
    );

    const summary = getSeasonalSummary(selectedPlants, analysis, 'spring');

    expect(summary.floweringIndex.score).toBe(50);
    expect(summary.floweringIndex.note).toContain('達成 1.5 / 3');
    expect(summary.floweringWarnings).toContain('May');
  });

  it('scores leaf stability with 80 and 60 percent thresholds and warns after three weak months', () => {
    const selectedPlants = Array.from({ length: 5 }, (_, index) => makePlant(`leaf-${index}`));
    const analysis = makeAnalysis(
      {},
      {
        jan: 5,
        feb: 4,
        mar: 3,
        apr: 2,
        may: 2,
        jun: 2,
      },
    );

    const summary = getSeasonalSummary(selectedPlants, analysis, 'spring_summer');

    expect(summary.leafIndex.score).toBe(21);
    expect(summary.leafWarnings).toEqual(['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    expect(summary.designReminder).toContain('全年有 9 個月份葉相覆蓋低於 60%');
  });

  it('scores layer completeness independently from leaf stability', () => {
    const selectedPlants = [
      makePlant('tree', { plant_type: '喬木' }),
      makePlant('shrub-1', { plant_type: '灌木' }),
      makePlant('shrub-2', { plant_type: '灌木' }),
      makePlant('shrub-3', { plant_type: '灌木' }),
    ];
    const analysis = makeAnalysis({}, {});

    const summary = getSeasonalSummary(selectedPlants, analysis, 'spring_summer');

    expect(summary.layerSummary.score).toBe(57);
    expect(summary.layerSummary.level).toBe('中');
    expect(summary.layerSummary.reminder).toContain('缺少低層');
  });
});
