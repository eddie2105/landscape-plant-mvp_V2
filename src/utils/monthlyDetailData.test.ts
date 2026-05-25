import { describe, expect, it } from 'vitest';
import type { MonthlyAnalysis, MonthCode, PlantWithMatrix } from '../types/plant';
import type { FloweringStrategy } from './seasonalSummary';
import { getMonthlyDetailData } from './monthlyDetailData';

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

describe('getMonthlyDetailData', () => {
  it('explains target months, flowering sources, leaf coverage, and reasons', () => {
    const selectedPlants = [
      makePlant('細葉杜鵑', { flower_impact: 3, flower_mar: 1 }),
      makePlant('薄荷', { flower_impact: 1, flower_apr: 1 }),
      makePlant('波士頓腎蕨', { flower_impact: 0 }),
    ];
    const strategy: FloweringStrategy = {
      id: 'spring',
      label: '春季觀花｜3-5月',
      months: ['mar', 'apr', 'may'],
    };
    const analysis = makeAnalysis({
      mar: 3,
      apr: 2,
      may: 1,
    });

    const data = getMonthlyDetailData({ selectedPlants, analysis, floweringStrategy: strategy });

    expect(data.find((item) => item.month === 'mar')).toMatchObject({
      isTargetMonth: true,
      flowerSources: ['細葉杜鵑(3)'],
      flowerImpact: 3,
      flowerState: '強',
      leafCoverageLabel: '3 / 3 種，100%',
      leafState: '強',
      reason: '目標花期內，開花強；葉相穩定',
    });
    expect(data.find((item) => item.month === 'apr')).toMatchObject({
      flowerSources: ['薄荷(1)'],
      flowerState: '中',
      leafCoverageLabel: '2 / 3 種，67%',
      leafState: '中',
      reason: '目標花期內，開花中；葉相中等',
    });
    expect(data.find((item) => item.month === 'may')).toMatchObject({
      flowerSources: [],
      flowerState: '弱',
      leafState: '弱',
      reason: '目標花期內缺花，需補強；葉相偏弱',
    });
    expect(data.find((item) => item.month === 'jan')?.reason).toBe('非目標花期；葉相偏弱');
  });
});
