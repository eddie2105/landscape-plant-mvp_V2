export type MonthCode =
  | 'jan'
  | 'feb'
  | 'mar'
  | 'apr'
  | 'may'
  | 'jun'
  | 'jul'
  | 'aug'
  | 'sep'
  | 'oct'
  | 'nov'
  | 'dec';

export type FlowerMonthKey = `flower_${MonthCode}`;
export type LeafMonthKey = `leaf_${MonthCode}`;

export interface Plant {
  plant_id: string;
  chinese_name: string;
  scientific_name: string;
  plant_type: string;
  light_condition: string;
  flower_color: string;
  flower_color_group: string;
  leaf_color: string;
  leaf_color_group: string;
  display_type: string;
  flower_impact: number;
}

export interface DisplayMatrix extends Record<FlowerMonthKey | LeafMonthKey, number> {
  plant_id: string;
}

export interface PlantWithMatrix extends Plant, DisplayMatrix {}

export interface MonthlyAnalysis {
  month: MonthCode;
  monthLabel: string;
  flower_count: number;
  leaf_count: number;
  heat_score: number;
  status: '偏弱' | '穩定' | '良好' | '非常強';
  suggestion: string;
}

export interface PlantFilters {
  chinese_name: string;
  scientific_name: string;
  plant_type: string;
  light_condition: string;
  flower_color_group: string;
  leaf_color_group: string;
  plant_layer: string;
}
