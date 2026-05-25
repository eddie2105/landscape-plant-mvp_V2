import {
  Box,
  Card,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import type { MonthlyAnalysis, PlantWithMatrix } from '../types/plant';

interface SelectedPlantsProps {
  selectedPlants: PlantWithMatrix[];
  analysis: MonthlyAnalysis[];
  averageHeatScore: number;
  weakestMonthLabel?: string;
  peakMonthLabel?: string;
}

function SelectedPlants({
  selectedPlants,
  analysis,
  averageHeatScore,
  weakestMonthLabel,
  peakMonthLabel,
}: SelectedPlantsProps) {
  if (selectedPlants.length === 0) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          已選植物摘要
        </Typography>
        <Typography color="text.secondary">
          請先從左側勾選植物，以產生季相分析結果。
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" gutterBottom>
            已選植物摘要
          </Typography>
          <Typography variant="body2" color="text.secondary">
            目前共有 {selectedPlants.length} 種植物參與分析。
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {selectedPlants.map((plant) => (
            <Chip
              key={plant.plant_id}
              color="primary"
              variant="outlined"
              label={`${plant.plant_id} ${plant.chinese_name}`}
            />
          ))}
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              最弱月份
            </Typography>
            <Typography variant="h5">{weakestMonthLabel ?? '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              高峰月份
            </Typography>
            <Typography variant="h5">{peakMonthLabel ?? '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              平均 heat_score
            </Typography>
            <Typography variant="h5">{averageHeatScore.toFixed(1)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              分析月份
            </Typography>
            <Typography variant="h5">{analysis.length}</Typography>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

export default SelectedPlants;
