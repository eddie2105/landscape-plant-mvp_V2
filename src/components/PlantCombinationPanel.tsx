import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { PlantWithMatrix } from '../types/plant';
import type {
  FloweringStrategy,
  FloweringStrategyId,
  SeasonalSummary,
} from '../utils/seasonalSummary';

interface PlantCombinationPanelProps {
  selectedPlants: PlantWithMatrix[];
  summary: SeasonalSummary;
  floweringStrategies: FloweringStrategy[];
  floweringStrategyId: FloweringStrategyId;
  onFloweringStrategyChange: (strategyId: FloweringStrategyId) => void;
  onRemovePlant: (plantId: string) => void;
  onClear: () => void;
}

interface ScoreRowProps {
  title: string;
  score: number;
  note: string;
  active: boolean;
}

function ScoreRow({ title, score, note, active }: ScoreRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 76px',
        gap: 1.4,
        alignItems: 'center',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={800}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
          {active ? note : '加入植物後開始檢查'}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h5" color="primary.dark" sx={{ lineHeight: 1.05 }}>
          {active ? score : '-'}
        </Typography>
        {active && (
          <Typography variant="caption" color="text.secondary">
            / 100
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function PlantCombinationPanel({
  selectedPlants,
  summary,
  floweringStrategies,
  floweringStrategyId,
  onFloweringStrategyChange,
  onRemovePlant,
  onClear,
}: PlantCombinationPanelProps) {
  const hasSelection = selectedPlants.length > 0;
  const [showSelectedPlants, setShowSelectedPlants] = useState(false);
  const selectedPreview =
    selectedPlants.length === 0
      ? '尚未加入植物'
      : selectedPlants
          .slice(0, 3)
          .map((plant) => plant.chinese_name)
          .join('、') + (selectedPlants.length > 3 ? ` 等 ${selectedPlants.length} 種` : '');

  const handleStrategyChange = (event: SelectChangeEvent) => {
    onFloweringStrategyChange(event.target.value as FloweringStrategyId);
  };

  return (
    <Card
      sx={{
        p: { xs: 2, md: 3 },
        alignSelf: 'start',
        position: { xs: 'static', lg: 'sticky' },
        top: { lg: 24 },
        height: { xs: 'auto', lg: 'calc(100vh - 48px)' },
        minHeight: { lg: 720 },
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        spacing={1.8}
        sx={{
          height: '100%',
          overflowY: 'auto',
          pr: { lg: 0.5 },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5">我的植栽組合</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              已選 {selectedPlants.length} 種植物
            </Typography>
          </Box>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<DeleteSweepIcon />}
            disabled={selectedPlants.length === 0}
            onClick={onClear}
            sx={{ flexShrink: 0 }}
          >
            清空
          </Button>
        </Stack>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'rgba(111, 138, 120, 0.06)',
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => setShowSelectedPlants((current) => !current)}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              border: 'none',
              cursor: 'pointer',
              bgcolor: 'transparent',
              color: 'text.primary',
              p: 1.4,
              textAlign: 'left',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={800}>
                已選植物
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {selectedPreview}
              </Typography>
            </Box>
            {showSelectedPlants ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          <Collapse in={showSelectedPlants} timeout="auto" unmountOnExit>
            <Box sx={{ px: 1.4, pb: 1.4 }}>
              {selectedPlants.length === 0 ? (
                <Box
                  sx={{
                    minHeight: 96,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    px: 2,
                    textAlign: 'center',
                    bgcolor: 'rgba(111, 138, 120, 0.06)',
                  }}
                >
                  <Typography color="text.secondary">
                    請從候選卡片加入植物。
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1} sx={{ maxHeight: 180, overflowY: 'auto', pr: 0.5 }}>
                  {selectedPlants.map((plant) => (
                    <Box
                      key={plant.plant_id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: 1,
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 1.1,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={800} noWrap>
                          {plant.chinese_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {plant.plant_type}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        aria-label={`移除 ${plant.chinese_name}`}
                        onClick={() => onRemovePlant(plant.plant_id)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Collapse>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.6,
            bgcolor: hasSelection ? 'rgba(111, 138, 120, 0.10)' : 'rgba(111, 138, 120, 0.06)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TipsAndUpdatesIcon color="primary" fontSize="small" />
            <Box>
              <Typography variant="body2" fontWeight={800}>
                快速結論
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hasSelection
                  ? summary.designReminder
                  : '加入植物後，系統會用白話整理這組搭配的季節亮點、全年綠量與空間層次。'}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.6,
            bgcolor: hasSelection ? 'rgba(111, 138, 120, 0.08)' : 'rgba(111, 138, 120, 0.06)',
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ mb: 1.2 }}>
            三個檢查結果
          </Typography>
          <Stack spacing={1.25} divider={<Divider flexItem />}>
            <ScoreRow
              title="季節亮點"
              score={summary.floweringIndex.score}
              note={`${summary.floweringIndex.level}｜${summary.floweringIndex.note}`}
              active={hasSelection}
            />
            <ScoreRow
              title="全年綠量穩定度"
              score={summary.leafIndex.score}
              note={`${summary.leafIndex.level}｜${summary.leafIndex.note}`}
              active={hasSelection}
            />
            <ScoreRow
              title="空間層次完整度"
              score={summary.layerSummary.score}
              note={
                hasSelection
                  ? `${summary.layerSummary.level}｜高 ${summary.layerSummary.high}、中 ${summary.layerSummary.middle}、低 ${summary.layerSummary.low}`
                  : ''
              }
              active={hasSelection}
            />
          </Stack>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.6,
            bgcolor: 'rgba(111, 138, 120, 0.06)',
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ mb: 1.2 }}>
            想看的花季
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="flowering-strategy-label">想看的花季</InputLabel>
            <Select
              labelId="flowering-strategy-label"
              value={floweringStrategyId}
              label="想看的花季"
              onChange={handleStrategyChange}
            >
              {floweringStrategies.map((strategy) => (
                <MenuItem key={strategy.id} value={strategy.id}>
                  {strategy.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            這會影響「季節亮點」分數，不要求全年都要開花。
          </Typography>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.6,
            bgcolor: 'rgba(111, 138, 120, 0.06)',
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ mb: 1 }}>
            怎麼理解這組搭配？
          </Typography>
          <Stack spacing={0.7}>
            <Typography variant="caption" color="text.secondary">
              1. 先看哪些月份有較明顯的季節亮點。
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2. 再看非花季時是否仍有穩定的全年綠量。
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3. 最後看高、中、低層是否完整。
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

export default PlantCombinationPanel;
