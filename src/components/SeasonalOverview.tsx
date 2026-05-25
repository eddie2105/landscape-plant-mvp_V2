import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Box, Card, Stack, Typography } from '@mui/material';
import type { PlantWithMatrix } from '../types/plant';
import type { SeasonalSummary } from '../utils/seasonalSummary';

interface SeasonalOverviewProps {
  selectedPlants: PlantWithMatrix[];
  summary: SeasonalSummary;
}

function SeasonalOverview({ selectedPlants, summary }: SeasonalOverviewProps) {
  if (selectedPlants.length === 0) {
    return (
      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5">季相檢查</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          請先加入植物，系統將分析所選植栽組合的開花期與常綠 / 葉相穩定指數。
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={1}>
          <Typography variant="h5">季相檢查</Typography>
          <Typography variant="body2" color="text.secondary">
            目前分析對象：我的植栽組合，共 {selectedPlants.length} 種植物
          </Typography>
        </Stack>
      </Card>

      <Card sx={{ p: { xs: 2, md: 3 }, bgcolor: 'rgba(111, 138, 120, 0.08)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TipsAndUpdatesIcon color="primary" />
          <Box>
            <Typography variant="h6">一句話設計提醒</Typography>
            <Typography sx={{ mt: 0.75 }}>{summary.designReminder}</Typography>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}

export default SeasonalOverview;
