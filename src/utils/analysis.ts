import type {
  MonthCode,
  MonthlyAnalysis,
  PlantFilters,
  PlantWithMatrix,
} from '../types/plant';
import { months } from './months';
import { getPlantLayerLabels } from './seasonalSummary';

type FilterOptionField =
  | 'plant_type'
  | 'light_condition'
  | 'flower_color_group'
  | 'leaf_color_group';

export const defaultFilters: PlantFilters = {
  chinese_name: '',
  scientific_name: '',
  plant_type: '',
  light_condition: '',
  flower_color_group: '',
  leaf_color_group: '',
  plant_layer: '',
};

const includesValue = (source: string, keyword: string): boolean =>
  source.toLowerCase().includes(keyword.trim().toLowerCase());

export const getUniqueOptions = (
  plants: PlantWithMatrix[],
  field: FilterOptionField,
): string[] => {
  const values = new Set<string>();

  plants.forEach((plant) => {
    plant[field]
      .split(/[、/]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => values.add(item));
  });

  return Array.from(values).sort((a, b) => a.localeCompare(b, 'zh-Hant'));
};

export const filterPlants = (
  plants: PlantWithMatrix[],
  filters: PlantFilters,
): PlantWithMatrix[] =>
  plants.filter((plant) => {
    if (
      filters.chinese_name &&
      !includesValue(plant.chinese_name, filters.chinese_name)
    ) {
      return false;
    }

    if (
      filters.scientific_name &&
      !includesValue(plant.scientific_name, filters.scientific_name)
    ) {
      return false;
    }

    const containsFields: FilterOptionField[] = [
      'plant_type',
      'light_condition',
      'flower_color_group',
      'leaf_color_group',
    ];

    const fieldFiltersPass = containsFields.every((field) => {
      const filterValue = filters[field];
      return !filterValue || includesValue(plant[field], filterValue);
    });

    if (!fieldFiltersPass) {
      return false;
    }

    return !filters.plant_layer || getPlantLayerLabels(plant).includes(filters.plant_layer);
  });

export const getMonthlyAnalysis = (
  selectedPlants: PlantWithMatrix[],
): MonthlyAnalysis[] =>
  months.map(({ code, label }) => {
    const flowerKey = `flower_${code}` as const;
    const leafKey = `leaf_${code}` as const;

    const flower_count = selectedPlants.reduce(
      (sum, plant) => sum + plant[flowerKey],
      0,
    );
    const leaf_count = selectedPlants.reduce(
      (sum, plant) => sum + plant[leafKey],
      0,
    );
    const heat_score = flower_count * 2 + leaf_count;

    let status: MonthlyAnalysis['status'] = '偏弱';
    if (heat_score >= 46) {
      status = '非常強';
    } else if (heat_score >= 31) {
      status = '良好';
    } else if (heat_score >= 16) {
      status = '穩定';
    }

    const issues: string[] = [];
    if (flower_count === 0) {
      issues.push('該月份缺少開花植物');
    }
    if (leaf_count <= 3) {
      issues.push('該月份葉相表現偏弱');
    }
    if (heat_score <= 15) {
      issues.push('該月份整體季相偏弱');
    }

    return {
      month: code,
      monthLabel: label,
      flower_count,
      leaf_count,
      heat_score,
      status,
      suggestion: issues.length > 0 ? issues.join('；') : '表現穩定',
    };
  });

export const getAverageHeatScore = (analysis: MonthlyAnalysis[]): number => {
  if (analysis.length === 0) {
    return 0;
  }

  return (
    analysis.reduce((sum, item) => sum + item.heat_score, 0) / analysis.length
  );
};

export const getWeakestMonth = (
  analysis: MonthlyAnalysis[],
): MonthlyAnalysis | null => {
  if (analysis.length === 0) {
    return null;
  }

  return analysis.reduce((lowest, current) =>
    current.heat_score < lowest.heat_score ? current : lowest,
  );
};

export const getPeakMonth = (
  analysis: MonthlyAnalysis[],
): MonthlyAnalysis | null => {
  if (analysis.length === 0) {
    return null;
  }

  return analysis.reduce((highest, current) =>
    current.heat_score > highest.heat_score ? current : highest,
  );
};

export const getSelectedPlants = (
  plants: PlantWithMatrix[],
  selectedPlantIds: string[],
): PlantWithMatrix[] => {
  const selectedIdSet = new Set(selectedPlantIds);
  return plants.filter((plant) => selectedIdSet.has(plant.plant_id));
};

export const getStatusColor = (
  status: MonthlyAnalysis['status'],
): 'error' | 'success' | 'primary' | 'secondary' => {
  if (status === '偏弱') {
    return 'error';
  }
  if (status === '穩定') {
    return 'success';
  }
  if (status === '良好') {
    return 'primary';
  }
  return 'secondary';
};

export const getMatrixValue = (
  plant: PlantWithMatrix,
  type: 'flower' | 'leaf',
  month: MonthCode,
): number => plant[`${type}_${month}` as const];
