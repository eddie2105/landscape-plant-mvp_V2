import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import PlantCardGrid from './components/PlantCardGrid';
import PlantCombinationPanel from './components/PlantCombinationPanel';
import MonthlyAnalysisTable from './components/MonthlyAnalysisTable';
import AnalysisCharts from './components/AnalysisCharts';
import MatrixTable from './components/MatrixTable';
import MethodNote from './components/MethodNote';
import type { PlantFilters, PlantWithMatrix } from './types/plant';
import {
  defaultFilters,
  filterPlants,
  getMonthlyAnalysis,
  getSelectedPlants,
  getUniqueOptions,
} from './utils/analysis';
import { loadPlantData } from './utils/loadData';
import {
  floweringStrategies,
  getPlantLayerSortRank,
  getSeasonalSummary,
  type FloweringStrategyId,
} from './utils/seasonalSummary';

function App() {
  const [plants, setPlants] = useState<PlantWithMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<PlantFilters>(defaultFilters);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);
  const [floweringStrategyId, setFloweringStrategyId] =
    useState<FloweringStrategyId>('spring_summer');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const loadedPlants = await loadPlantData();
        setPlants(loadedPlants);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : '資料載入時發生未預期的錯誤。',
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredPlants = useMemo(
    () =>
      [...filterPlants(plants, filters)].sort((a, b) => {
        const layerDiff = getPlantLayerSortRank(a) - getPlantLayerSortRank(b);
        return layerDiff || a.chinese_name.localeCompare(b.chinese_name, 'zh-Hant');
      }),
    [plants, filters],
  );

  const selectedPlants = useMemo(
    () => getSelectedPlants(plants, selectedPlantIds),
    [plants, selectedPlantIds],
  );

  const monthlyAnalysis = useMemo(
    () => getMonthlyAnalysis(selectedPlants),
    [selectedPlants],
  );

  const seasonalSummary = useMemo(
    () => getSeasonalSummary(selectedPlants, monthlyAnalysis, floweringStrategyId),
    [selectedPlants, monthlyAnalysis, floweringStrategyId],
  );

  const filterOptions = useMemo(
    () => ({
      plant_type: getUniqueOptions(plants, 'plant_type'),
      light_condition: getUniqueOptions(plants, 'light_condition'),
      flower_color_group: getUniqueOptions(plants, 'flower_color_group'),
      leaf_color_group: getUniqueOptions(plants, 'leaf_color_group'),
      plant_layer: ['高層植栽', '中層植栽', '低層植栽'],
    }),
    [plants],
  );

  const handleFilterChange = (field: keyof PlantFilters, value: string) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleTogglePlant = (plantId: string) => {
    setSelectedPlantIds((previous) =>
      previous.includes(plantId)
        ? previous.filter((id) => id !== plantId)
        : [...previous, plantId],
    );
  };

  const handleRemovePlant = (plantId: string) => {
    setSelectedPlantIds((previous) => previous.filter((id) => id !== plantId));
  };

  const handleClearCombination = () => {
    setSelectedPlantIds([]);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const hasNoData = !loading && plants.length === 0 && !error;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 4 },
        background:
          'linear-gradient(180deg, #E9ECE4 0%, #F6F1E9 48%, #E6E8DE 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Header totalPlants={plants.length} selectedCount={selectedPlants.length} />

        {loading && (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 10 }}>
            <CircularProgress />
            <Typography color="text.secondary">正在載入植栽資料...</Typography>
          </Stack>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && hasNoData && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            沒有讀到 plants.csv 或 display_matrix.csv 的資料，請確認 public/data/ 內的檔案。
          </Alert>
        )}

        {!loading && !error && !hasNoData && (
          <Stack spacing={3}>
            <FilterPanel
              filters={filters}
              options={filterOptions}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: 'minmax(0, 1fr) 400px',
                },
                gap: 3,
                alignItems: 'stretch',
              }}
            >
              <Stack spacing={3}>
                <PlantCardGrid
                  plants={filteredPlants}
                  selectedPlantIds={selectedPlantIds}
                  onTogglePlant={handleTogglePlant}
                />

                <MonthlyAnalysisTable
                  selectedPlants={selectedPlants}
                  analysis={monthlyAnalysis}
                  floweringStrategy={seasonalSummary.floweringStrategy}
                />
                <AnalysisCharts
                  selectedPlants={selectedPlants}
                  analysis={monthlyAnalysis}
                  summary={seasonalSummary}
                />
                <MatrixTable plants={selectedPlants} type="flower" />
                <MatrixTable plants={selectedPlants} type="leaf" />
                <MethodNote />
              </Stack>

              <PlantCombinationPanel
                selectedPlants={selectedPlants}
                summary={seasonalSummary}
                floweringStrategies={floweringStrategies}
                floweringStrategyId={floweringStrategyId}
                onFloweringStrategyChange={setFloweringStrategyId}
                onRemovePlant={handleRemovePlant}
                onClear={handleClearCombination}
              />
            </Box>
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default App;
