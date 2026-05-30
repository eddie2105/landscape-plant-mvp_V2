import { describe, expect, it } from 'vitest';
import type { MonthCode, PlantFilters, PlantWithMatrix } from '../types/plant';
import { defaultFilters, filterPlants } from './analysis';

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
    flower_color: '紅',
    flower_color_group: '暖色系',
    leaf_color: '深綠',
    leaf_color_group: '深綠系',
    display_type: 'flowering',
    flower_impact: 1,
    has_seasonal_image: false,
    ...matrix,
    ...overrides,
  } as PlantWithMatrix;
};

describe('filterPlants', () => {
  it('filters plants by flowering season from the monthly matrix', () => {
    const plants = [
      makePlant('spring-bloomer', { flower_mar: 1 }),
      makePlant('summer-bloomer', { flower_jul: 1 }),
      makePlant('winter-bloomer', { flower_dec: 1 }),
    ];
    const filters = {
      ...defaultFilters,
      flowering_season: '春季',
    } as PlantFilters & { flowering_season: string };

    const result = filterPlants(plants, filters).map((plant) => plant.plant_id);

    expect(result).toEqual(['spring-bloomer']);
  });
});
