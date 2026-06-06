import {
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { MonthlyAnalysis, PlantWithMatrix } from '../types/plant';
import type { FloweringStrategy } from '../utils/seasonalSummary';
import { getMonthlyDetailData } from '../utils/monthlyDetailData';

interface MonthlyAnalysisTableProps {
  selectedPlants: PlantWithMatrix[];
  analysis: MonthlyAnalysis[];
  floweringStrategy: FloweringStrategy;
}

const getStateColor = (state: '弱' | '中' | '強'): 'default' | 'secondary' | 'primary' => {
  if (state === '強') return 'primary';
  if (state === '中') return 'secondary';
  return 'default';
};

const getStateLabel = (state: '弱' | '中' | '強'): string => {
  if (state === '強') return '表現明顯';
  if (state === '中') return '基本支撐';
  return '建議補強';
};

function MonthlyAnalysisTable({
  selectedPlants,
  analysis,
  floweringStrategy,
}: MonthlyAnalysisTableProps) {
  const detailRows = getMonthlyDetailData({ selectedPlants, analysis, floweringStrategy });

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        月份明細
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        圖表用來看哪個月份需要補強，這裡用來查看每個月份的判定原因。
      </Typography>

      {selectedPlants.length === 0 ? (
        <Typography color="text.secondary">
          請先加入植物，系統會列出每個月份的季節亮點來源、全年綠量與判定原因。
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>月份</TableCell>
                <TableCell>想看的花季</TableCell>
                <TableCell>季節亮點來源 / 花色亮點強度</TableCell>
                <TableCell>全年綠量</TableCell>
                <TableCell>判定原因</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailRows.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>
                    <Typography fontWeight={800}>{row.monthLabel}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.isTargetMonth ? '是' : '否'}
                      color={row.isTargetMonth ? 'primary' : 'default'}
                      size="small"
                      variant={row.isTargetMonth ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                      <Typography variant="body2">
                        {row.flowerSources.length > 0 ? row.flowerSources.join('、') : '無季節亮點植物'}
                      </Typography>
                      <Chip
                        label={`花色亮點強度 ${row.flowerImpact}｜${getStateLabel(row.flowerState)}`}
                        color={getStateColor(row.flowerState)}
                        size="small"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                      <Typography variant="body2">{row.leafCoverageLabel}</Typography>
                      <Chip
                        label={getStateLabel(row.leafState)}
                        color={getStateColor(row.leafState)}
                        size="small"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.reason}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Card>
  );
}

export default MonthlyAnalysisTable;
