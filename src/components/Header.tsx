import {
  Avatar,
  Box,
  Card,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

interface HeaderProps {
  totalPlants: number;
  selectedCount: number;
}

function Header({ totalPlants, selectedCount }: HeaderProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        mb: 4,
        p: { xs: 3, md: 4 },
        color: 'common.white',
        background:
          'linear-gradient(135deg, #3F5F4A 0%, #6F8A78 55%, #A8B9A7 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, rgba(231, 201, 207, 0.34), transparent 36%), radial-gradient(circle at bottom left, rgba(250, 248, 242, 0.18), transparent 32%)',
        }}
      />

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        justifyContent="space-between"
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box maxWidth={680}>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.14)',
                color: 'common.white',
              }}
            >
              <YardOutlinedIcon />
            </Avatar>
            <Chip
              label="Landscape Seasonal Planting Analyzer"
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                color: 'common.white',
                fontWeight: 600,
              }}
            />
          </Stack>

          <Typography variant="h3" component="h1" gutterBottom>
            植栽季相檢查工作台
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 560 }}
          >
            用花量權重、葉相穩定與植栽層次，檢查植栽組合的一年四季表現。
          </Typography>
        </Box>

        <Card
          sx={{
            minWidth: { xs: '100%', sm: 280 },
            alignSelf: 'stretch',
            bgcolor: 'rgba(250,248,242,0.94)',
            color: 'text.primary',
            p: 3,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <InsightsOutlinedIcon color="primary" />
              <Typography variant="h6">快速狀態</Typography>
            </Stack>
            <Box>
              <Typography variant="body2" color="text.secondary">
                植物資料庫
              </Typography>
              <Typography variant="h4">{totalPlants}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                目前已選植物
              </Typography>
              <Typography variant="h4">{selectedCount}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              先篩選候選植物，再加入組合，即可檢查花期、葉相與複層配置。
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default Header;
