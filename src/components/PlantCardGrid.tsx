import { Box, Card, Chip, Stack, Typography } from '@mui/material';
import PlantCard from './PlantCard';
import type { PlantWithMatrix } from '../types/plant';

interface PlantCardGridProps {
  plants: PlantWithMatrix[];
  selectedPlantIds: string[];
  onTogglePlant: (plantId: string) => void;
}

function PlantCardGrid({ plants, selectedPlantIds, onTogglePlant }: PlantCardGridProps) {
  const selectedSet = new Set(selectedPlantIds);

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h5">候選植栽卡片</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            點選卡片即可加入或移出我的植栽組合。
          </Typography>
        </Box>
        <Chip label={`篩選結果 ${plants.length} 株`} color="primary" variant="outlined" />
      </Stack>

      {plants.length === 0 ? (
        <Box
          sx={{
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'rgba(111, 138, 120, 0.06)',
          }}
        >
          <Typography color="text.secondary">沒有符合目前篩選條件的植栽。</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2.2,
            alignItems: 'stretch',
          }}
        >
          {plants.map((plant) => (
            <PlantCard
              key={plant.plant_id}
              plant={plant}
              selected={selectedSet.has(plant.plant_id)}
              onToggle={onTogglePlant}
            />
          ))}
        </Box>
      )}
    </Card>
  );
}

export default PlantCardGrid;
