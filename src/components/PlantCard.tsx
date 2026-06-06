import { useEffect, useState, type KeyboardEvent, type MouseEvent } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { alpha } from '@mui/material/styles';
import { Box, Card, Chip, IconButton, Stack, Typography } from '@mui/material';
import type { PlantWithMatrix } from '../types/plant';
import { getPlantLayerLabels } from '../utils/seasonalSummary';

interface PlantCardProps {
  plant: PlantWithMatrix;
  selected: boolean;
  onToggle: (plantId: string) => void;
}

const assetPath = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const imageForPlant = (plantId: string): string =>
  assetPath(`images/plants/${plantId}.jpg`);
const seasonalImageForPlant = (plantId: string): string =>
  assetPath(`images/plants/${plantId}_seasonal.jpg`);
const placeholderImage = assetPath('images/plants/placeholder.jpg');

const getFlowerImpactLabel = (impact: number): string => {
  if (impact >= 3) return '表現明顯';
  if (impact >= 2) return '基本支撐';
  if (impact >= 1) return '建議補強';
  return '不顯著';
};

const formatListText = (value: string): string => value.replace(/\//g, '／');

const displayTypeLabels: Record<string, string> = {
  flowering: '觀花',
  foliage: '觀葉',
  evergreen: '常綠',
  seasonal: '季節性',
};

const formatDisplayType = (value: string): string =>
  value
    .split(',')
    .map((item) => displayTypeLabels[item.trim()] ?? item.trim())
    .filter(Boolean)
    .join('・');

function PlantCard({ plant, selected, onToggle }: PlantCardProps) {
  const imageOptions = [
    { label: '主圖', src: imageForPlant(plant.plant_id) },
    ...(plant.has_seasonal_image
      ? [{ label: '季節變換', src: seasonalImageForPlant(plant.plant_id) }]
      : []),
  ];
  const [imageIndex, setImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const currentImage = imageOptions[imageIndex] ?? imageOptions[0];
  const imageSrc = failedImages.has(currentImage.src) ? placeholderImage : currentImage.src;
  const isPlaceholder = imageSrc === placeholderImage;
  const hasImageCarousel = imageOptions.length > 1;
  const layerLabel = getPlantLayerLabels(plant).join(' / ');
  const flowerImpactLabel = getFlowerImpactLabel(plant.flower_impact);
  const flowerColorGroup = formatListText(plant.flower_color_group || '未分類');
  const leafColorGroup = formatListText(plant.leaf_color_group || '未分類');
  const displayType = formatDisplayType(plant.display_type);

  useEffect(() => {
    setImageIndex(0);
    setFailedImages(new Set());
  }, [plant.plant_id]);

  const handleImageError = () => {
    setFailedImages((previous) => new Set(previous).add(currentImage.src));
  };

  const handlePreviousImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setImageIndex((current) =>
      current === 0 ? imageOptions.length - 1 : current - 1,
    );
  };

  const handleNextImage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setImageIndex((current) => (current + 1) % imageOptions.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle(plant.plant_id);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onToggle(plant.plant_id)}
      onKeyDown={handleKeyDown}
      sx={(theme) => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        textAlign: 'left',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : alpha(theme.palette.primary.main, 0.14),
        bgcolor: 'background.paper',
        p: 0,
        transition: 'transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
        boxShadow: selected
          ? `0 20px 52px ${alpha(theme.palette.primary.main, 0.18)}`
          : '0 18px 44px rgba(63, 95, 74, 0.10)',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: selected ? 'primary.dark' : alpha(theme.palette.primary.main, 0.34),
        },
      })}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '4 / 3',
          bgcolor: '#E5E8DE',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={imageSrc}
          alt={plant.chinese_name}
          onError={handleImageError}
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            filter: isPlaceholder ? 'saturate(0.75)' : 'none',
          }}
        />

        {hasImageCarousel && (
          <>
            <IconButton
              size="small"
              aria-label={`上一張 ${plant.chinese_name} 圖片`}
              onClick={handlePreviousImage}
              sx={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(250, 248, 242, 0.84)',
                color: 'primary.dark',
                '&:hover': { bgcolor: 'rgba(250, 248, 242, 0.96)' },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label={`下一張 ${plant.chinese_name} 圖片`}
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(250, 248, 242, 0.84)',
                color: 'primary.dark',
                '&:hover': { bgcolor: 'rgba(250, 248, 242, 0.96)' },
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </>
        )}

        <Chip
          icon={selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          label={selected ? '已加入' : '＋ 加入組合'}
          size="small"
          color={selected ? 'primary' : 'default'}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: selected ? 'primary.main' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            fontWeight: 700,
          }}
        />

        {hasImageCarousel && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              left: 12,
              bottom: 10,
              px: 1,
              py: 0.35,
              borderRadius: 1,
              color: 'primary.dark',
              bgcolor: 'rgba(250, 248, 242, 0.84)',
              fontWeight: 800,
            }}
          >
            {currentImage.label}
          </Typography>
        )}

        {isPlaceholder && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              right: 12,
              bottom: 10,
              px: 1,
              py: 0.35,
              borderRadius: 1,
              color: 'text.secondary',
              bgcolor: 'rgba(255, 255, 255, 0.82)',
              fontWeight: 700,
            }}
          >
            尚無圖片
          </Typography>
        )}
      </Box>

      <Stack spacing={1.2} sx={{ p: 2.2, flex: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1.25, fontWeight: 800 }}>
            {plant.chinese_name}
            <Box
              component="span"
              sx={{
                display: 'inline',
                ml: 0.5,
                color: 'text.secondary',
                fontSize: '0.82em',
                fontWeight: 700,
              }}
            >
              （{layerLabel}）
            </Box>
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25, fontStyle: 'italic', lineHeight: 1.35 }}
          >
            {plant.scientific_name}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
            {plant.plant_type}
            <Box component="span" sx={{ mx: 0.75 }}>｜</Box>
            {plant.light_condition}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
            {displayType}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
            <Box component="span" sx={{ color: 'text.secondary' }}>花色：</Box>
            {plant.flower_color || '無資料'}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
            <Box component="span" sx={{ color: 'text.secondary' }}>花色亮點強度：</Box>
            {flowerImpactLabel}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.75} rowGap={0.8} useFlexGap flexWrap="wrap" sx={{ mt: 'auto' }}>
          <Chip label={`花色系：${flowerColorGroup}`} size="small" color="secondary" variant="outlined" />
          <Chip label={`葉色系：${leafColorGroup}`} size="small" color="primary" variant="outlined" />
        </Stack>
      </Stack>
    </Card>
  );
}

export default PlantCard;
