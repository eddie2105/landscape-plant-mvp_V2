import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { PlantWithMatrix } from '../types/plant';
import { getMatrixValue } from '../utils/analysis';
import { months } from '../utils/months';

interface MatrixTableProps {
  plants: PlantWithMatrix[];
  type: 'flower' | 'leaf';
}

function MatrixTable({ plants, type }: MatrixTableProps) {
  const isFlower = type === 'flower';

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isFlower ? '季節亮點矩陣' : '全年綠量矩陣'}
      </Typography>

      {plants.length === 0 ? (
        <Typography color="text.secondary">
          請先選取植物，才能顯示矩陣分析。
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>植物名稱</TableCell>
                {months.map((month) => (
                  <TableCell key={month.code} align="center">
                    {month.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {plants.map((plant) => (
                <TableRow key={`${type}-${plant.plant_id}`}>
                  <TableCell>{plant.chinese_name}</TableCell>
                  {months.map((month) => {
                    const value = getMatrixValue(plant, type, month.code);
                    return (
                      <TableCell
                        key={month.code}
                        align="center"
                        sx={{
                          bgcolor:
                            value === 1
                              ? isFlower
                                ? '#E7C9CF'
                                : '#A8B9A7'
                              : '#E9E4D8',
                          color: value === 1 ? '#27342E' : 'text.secondary',
                          fontWeight: 700,
                          borderRadius: 2,
                          minWidth: 44,
                          height: 34,
                        }}
                        aria-label={`${plant.chinese_name} ${month.label} ${value === 1 ? '有' : '無'}${isFlower ? '季節亮點' : '全年綠量'}`}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Card>
  );
}

export default MatrixTable;
