import { Card, Stack, Typography } from '@mui/material';

function MethodNote() {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1.25}>
        <Typography variant="h6">方法說明</Typography>
        <Typography color="text.secondary">
          開花指數依使用者選擇的觀花策略計算目標月份，不要求全年都要開花。
        </Typography>
        <Typography color="text.secondary">
          每個目標月份先加總當月開花植物的 flower_impact：0 分代表無花，1-2 分代表有花但偏弱，3 分以上代表有明顯觀花效果；開花指數為目標月份平均後換算成 100 分。
        </Typography>
        <Typography color="text.secondary">
          常綠 / 葉相穩定指數維持全年檢查：每月葉相覆蓋達 80% 為 1 分，60%-80% 為 0.5 分，低於 60% 為 0 分，全年平均後換算成 100 分。
        </Typography>
        <Typography color="text.secondary">
          植栽層次完整度獨立檢查高、中、低層：某層 0 種為 0 分，1 種為 0.7 分，2 種以上為 1 分，三層平均後換算成 100 分。
        </Typography>
      </Stack>
    </Card>
  );
}

export default MethodNote;
