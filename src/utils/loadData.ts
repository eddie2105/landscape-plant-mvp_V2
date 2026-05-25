import Papa from 'papaparse';
import type {
  DisplayMatrix,
  FlowerMonthKey,
  LeafMonthKey,
  Plant,
  PlantWithMatrix,
} from '../types/plant';
import { months } from './months';

const flowerKeys = months.map(
  ({ code }) => `flower_${code}` as FlowerMonthKey,
);
const leafKeys = months.map(({ code }) => `leaf_${code}` as LeafMonthKey);

const parseCsv = async <T extends Record<string, string>>(
  path: string,
): Promise<T[]> => {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`無法載入 ${path}，狀態碼：${response.status}`);
  }

  const text = await response.text();

  return new Promise<T[]>((resolve, reject) => {
    Papa.parse<T>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(
            new Error(
              `${path} 解析失敗：${result.errors[0]?.message ?? '未知錯誤'}`,
            ),
          );
          return;
        }

        resolve(result.data);
      },
      error: (error: Error) => reject(error),
    });
  });
};

const sanitizeText = (value: string | undefined): string => value?.trim() ?? '';

const sanitizeNumber = (value: string | undefined): number => {
  const cleaned = value?.trim() ?? '';
  if (!cleaned) {
    return 0;
  }

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const sanitizeFlowerImpact = (value: string | undefined): number => {
  const cleaned = value?.trim() ?? '';
  if (!cleaned) {
    return 1;
  }

  const parsed = Number(cleaned);
  if (Number.isNaN(parsed)) {
    return 1;
  }

  return Math.max(0, Math.min(3, parsed));
};

export const loadPlantData = async (): Promise<PlantWithMatrix[]> => {
  const [plantsRaw, matrixRaw] = await Promise.all([
    parseCsv<Record<string, string>>('/data/plants.csv'),
    parseCsv<Record<string, string>>('/data/display_matrix.csv'),
  ]);

  const plants: Plant[] = plantsRaw.map((row) => ({
    plant_id: sanitizeText(row.plant_id),
    chinese_name: sanitizeText(row.chinese_name),
    scientific_name: sanitizeText(row.scientific_name),
    plant_type: sanitizeText(row.plant_type),
    light_condition: sanitizeText(row.light_condition),
    flower_color: sanitizeText(row.flower_color),
    flower_color_group: sanitizeText(row.flower_color_group),
    leaf_color: sanitizeText(row.leaf_color),
    leaf_color_group: sanitizeText(row.leaf_color_group),
    display_type: sanitizeText(row.display_type),
    flower_impact: sanitizeFlowerImpact(row.flower_impact),
  }));

  const matrixMap = new Map<string, DisplayMatrix>();

  matrixRaw.forEach((row) => {
    const plantId = sanitizeText(row.plant_id);

    if (!plantId) {
      return;
    }

    const matrix = { plant_id: plantId } as DisplayMatrix;

    flowerKeys.forEach((key) => {
      matrix[key] = sanitizeNumber(row[key]);
    });

    leafKeys.forEach((key) => {
      matrix[key] = sanitizeNumber(row[key]);
    });

    matrixMap.set(plantId, matrix);
  });

  return plants
    .map((plant) => {
      const matrix = matrixMap.get(plant.plant_id);

      if (!matrix) {
        console.warn(
          `找不到 plant_id=${plant.plant_id} 的 display_matrix 資料，已略過此植物。`,
        );
        return null;
      }

      return {
        ...plant,
        ...matrix,
      };
    })
    .filter((plant): plant is PlantWithMatrix => plant !== null);
};
