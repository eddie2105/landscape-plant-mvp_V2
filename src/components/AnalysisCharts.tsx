import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';
import type { MonthlyAnalysis, PlantWithMatrix } from '../types/plant';
import type { SeasonalSummary } from '../utils/seasonalSummary';
import { getSeasonalChartData } from '../utils/seasonalChartData';
import type { AnnualSeasonalPoint } from '../utils/seasonalChartData';

interface AnalysisChartsProps {
  selectedPlants: PlantWithMatrix[];
  analysis: MonthlyAnalysis[];
  summary: SeasonalSummary;
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>
      {children}
    </Card>
  );
}

const getStateLabel = (point: number): string => {
  if (point >= 1) return '強';
  if (point >= 0.5) return '中';
  return '弱';
};

const getStateColor = (point: number, type: 'flower' | 'leaf'): string => {
  if (point >= 1) return type === 'flower' ? '#B77C8A' : '#6F8A78';
  if (point >= 0.5) return type === 'flower' ? '#E7C9CF' : '#A8B9A7';
  return '#D8D1C4';
};

function MonthCell({ item, type }: { item: AnnualSeasonalPoint; type: 'flower' | 'leaf' }) {
  const point = type === 'flower' ? item.flowerPoint : item.leafPoint;

  return (
    <Box
      sx={{
        minWidth: 58,
        borderRadius: 2,
        p: 1,
        textAlign: 'center',
        bgcolor: getStateColor(point, type),
        color: point >= 1 ? '#FAF8F2' : 'text.secondary',
        fontWeight: 800,
      }}
    >
      <Typography variant="caption" sx={{ display: 'block', opacity: 0.9 }}>
        {item.monthLabel}
      </Typography>
      <Typography variant="body2" fontWeight={900}>
        {getStateLabel(point)}
      </Typography>
    </Box>
  );
}

function MonthStateRow({
  label,
  items,
  type,
}: {
  label: string;
  items: AnnualSeasonalPoint[];
  type: 'flower' | 'leaf';
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '80px minmax(0, 1fr)' },
        gap: 1.2,
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" fontWeight={800} color="text.secondary">
        {label}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, minmax(0, 1fr))',
            sm: 'repeat(6, minmax(0, 1fr))',
            lg: `repeat(${items.length}, minmax(0, 1fr))`,
          },
          gap: 1,
        }}
      >
        {items.map((item) => (
          <MonthCell key={`${type}-${item.month}`} item={item} type={type} />
        ))}
      </Box>
    </Box>
  );
}

function LayerRow({ layer, count, point }: { layer: string; count: number; point: number }) {
  const label = point >= 1 ? '穩定' : point >= 0.7 ? '基本支撐' : '缺少';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '92px minmax(0, 1fr) 88px' },
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" fontWeight={800}>
        {layer} {count} 種
      </Typography>
      <LinearProgress
        variant="determinate"
        value={point * 100}
        sx={{
          height: 12,
          borderRadius: 999,
          bgcolor: '#E9E4D8',
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            bgcolor: point >= 1 ? '#6F8A78' : point >= 0.7 ? '#A8B9A7' : '#D8D1C4',
          },
        }}
      />
      <Typography variant="body2" color="text.secondary" fontWeight={700}>
        {label}
      </Typography>
    </Box>
  );
}

function AnalysisCharts({ selectedPlants, analysis, summary }: AnalysisChartsProps) {
  if (analysis.length === 0) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          季相檢查
        </Typography>
        <Typography color="text.secondary">
          請先加入植物，系統會依花量權重、葉相穩定度與植栽層次產生檢查表。
        </Typography>
      </Card>
    );
  }

  const chartData = getSeasonalChartData({
    selectedPlants,
    analysis,
    floweringStrategy: summary.floweringStrategy,
    layerSummary: summary.layerSummary,
  });

  const weakFlowerMonths = chartData.strategy.filter((item) => item.flowerPoint === 0).length;
  const supportedFlowerMonths = chartData.strategy.length - weakFlowerMonths;

  return (
    <Stack spacing={2.5}>
      <ChartCard
        title="年度季相檢查"
        subtitle="用月份狀態格檢查全年開花與葉相；弱的月份就是需要回頭看的缺口。"
      >
        <Stack spacing={1.5}>
          <MonthStateRow label="開花" items={chartData.annual} type="flower" />
          <MonthStateRow label="葉相" items={chartData.annual} type="leaf" />
        </Stack>
      </ChartCard>

      <ChartCard
        title={`花期策略檢查｜${summary.floweringStrategy.label}`}
        subtitle={`${chartData.strategy.length} 個目標月份中，${supportedFlowerMonths} 個月份達中等以上，${weakFlowerMonths} 個月份偏弱。`}
      >
        <MonthStateRow label="目標花期" items={chartData.strategy} type="flower" />
      </ChartCard>

      <ChartCard
        title="植栽層次檢查"
        subtitle="高、中、低層分開看，避免某一層很多植物掩蓋另一層缺失。"
      >
        <Stack spacing={1.5}>
          {chartData.layers.map((item) => (
            <LayerRow key={item.layer} layer={item.layer} count={item.count} point={item.point} />
          ))}
        </Stack>
      </ChartCard>
    </Stack>
  );
}

export default AnalysisCharts;
