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
  Chip,
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
  SeasonalIndex,
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

function IndexRow({
  title,
  index,
  active,
}: {
  title: string;
  index: SeasonalIndex;
  active: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 84px',
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
          {active ? `${index.level}｜${index.note}` : '加入植物後開始分析'}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h5" color="primary.dark" sx={{ lineHeight: 1.05 }}>
          {active ? index.score : '-'}
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
  const [showSelectedPlants, setShowSelectedPlants] = useState(true);
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
        spacing={2.2}
        sx={{
          height: '100%',
          overflowY: 'auto',
          pr: { lg: 0.5 },
        }}
      >
        <Box>
          <Typography variant="h5">我的植栽組合</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            已選 {selectedPlants.length} 種植物
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip label={`分析對象：${selectedPlants.length} 種`} color="primary" variant="outlined" />
          <Button
            type="button"
            variant="outlined"
            color="primary"
            startIcon={<DeleteSweepIcon />}
            disabled={selectedPlants.length === 0}
            onClick={onClear}
          >
            清空組合
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
            <Box>
              <Typography variant="body2" fontWeight={700}>
                已選植物清單
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedPlants.length === 0 ? '尚未加入植物' : `共 ${selectedPlants.length} 種，點擊查看或收合`}
              </Typography>
            </Box>
            {showSelectedPlants ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          <Collapse in={showSelectedPlants} timeout="auto" unmountOnExit>
            <Box sx={{ px: 1.4, pb: 1.4 }}>
              {selectedPlants.length === 0 ? (
                <Box
                  sx={{
                    minHeight: 120,
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
                    請從候選卡片加入植物，系統會分析這組植栽的開花期與葉相穩定度。
                  </Typography>
                </Box>
              ) : (
                <Stack
                  spacing={1}
                  sx={{
                    maxHeight: 220,
                    overflowY: 'auto',
                    pr: 0.5,
                  }}
                >
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
                        p: 1.2,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={700} noWrap>
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
            bgcolor: 'rgba(111, 138, 120, 0.06)',
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 1.2 }}>
            花期檢查目標
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="flowering-strategy-label">觀花策略</InputLabel>
            <Select
              labelId="flowering-strategy-label"
              value={floweringStrategyId}
              label="觀花策略"
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
            開花指數會依目前目標月份計算，不再要求全年都要有花。
          </Typography>
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
          <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 1.2 }}>
            四季觀花總覽
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 1,
            }}
          >
            {summary.seasonalFloweringOverview.map((season) => (
              <Box
                key={season.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  p: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {season.label}
                </Typography>
                <Typography variant="body2" color="primary.dark" fontWeight={800}>
                  {hasSelection ? `${season.level}｜${season.score}` : '-'}
                </Typography>
              </Box>
            ))}
          </Box>
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
          <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 1.2 }}>
            季相指標
          </Typography>
          <Stack spacing={1.25} divider={<Divider flexItem />}>
            <IndexRow title="開花期指數" index={summary.floweringIndex} active={hasSelection} />
            <IndexRow title="常綠 / 葉相穩定指數" index={summary.leafIndex} active={hasSelection} />
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
          <Typography variant="body2" color="text.secondary" fontWeight={700}>
            植栽層次檢查
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ my: 1 }}>
            <Chip label={`高層 ${summary.layerSummary.high}`} size="small" color="primary" variant="outlined" />
            <Chip label={`中層 ${summary.layerSummary.middle}`} size="small" color="primary" variant="outlined" />
            <Chip label={`低層 ${summary.layerSummary.low}`} size="small" color="primary" variant="outlined" />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {hasSelection ? summary.layerSummary.reminder : '加入植物後開始檢查高、中、低層配置。'}
          </Typography>
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
              <Typography variant="body2" color="text.secondary" fontWeight={700}>
                設計提醒
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hasSelection ? summary.designReminder : '加入植物後，系統會產生一句話設計提醒。'}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

export default PlantCombinationPanel;
