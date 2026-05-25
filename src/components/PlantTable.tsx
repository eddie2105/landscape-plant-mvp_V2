import {
  Box,
  Card,
  Checkbox,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { PlantWithMatrix } from '../types/plant';

interface PlantTableProps {
  plants: PlantWithMatrix[];
  selectedPlantIds: string[];
  onTogglePlant: (plantId: string) => void;
}

function PlantTable({
  plants,
  selectedPlantIds,
  onTogglePlant,
}: PlantTableProps) {
  const selectedSet = new Set(selectedPlantIds);

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={2}
        spacing={1}
      >
        <Box>
          <Typography variant="h6">植物資料庫</Typography>
          <Typography variant="body2" color="text.secondary">
            勾選植物後，右側分析結果會即時更新。
          </Typography>
        </Box>
        <Chip label={`篩選結果 ${plants.length} 筆`} color="primary" variant="outlined" />
      </Stack>

      <Box sx={{ maxHeight: 720, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">選取</TableCell>
              <TableCell>植物資訊</TableCell>
              <TableCell>屬性摘要</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plants.map((plant) => (
              <TableRow
                key={plant.plant_id}
                hover
                selected={selectedSet.has(plant.plant_id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSet.has(plant.plant_id)}
                    onChange={() => onTogglePlant(plant.plant_id)}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 260 }}>
                  <Typography fontWeight={700}>
                    {plant.plant_id}｜{plant.chinese_name}｜{plant.scientific_name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 240 }}>
                  <Typography variant="body2" color="text.secondary">
                    {plant.plant_type}｜{plant.light_condition}｜{plant.flower_color}｜
                    {plant.leaf_color}｜{plant.display_type}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {plants.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography color="text.secondary">
                    沒有符合目前篩選條件的植物。
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default PlantTable;
