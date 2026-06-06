import { Box, Card, Stack, Typography } from '@mui/material';

function MethodNote() {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2.4}>
        <Box>
          <Typography variant="h6">方法說明</Typography>
          <Stack spacing={1.25} sx={{ mt: 1.2 }}>
            <Typography color="text.secondary">
              季節亮點指數依使用者選擇的「想看的花季」計算目標月份，不要求全年都要開花。
            </Typography>
            <Typography color="text.secondary">
              每個目標月份先加總當月開花植物的 flower_impact：0 分代表無明顯亮點，
              1-2 分代表有亮點但偏弱，3 分以上代表有明顯季節亮點；指數為目標月份平均後換算成 100 分。
            </Typography>
            <Typography color="text.secondary">
              全年綠量穩定度維持全年檢查：每月綠量覆蓋達 80% 為 1 分，60%-80% 為 0.5 分，
              低於 60% 為 0 分，全年平均後換算成 100 分。
            </Typography>
            <Typography color="text.secondary">
              空間層次完整度獨立檢查高、中、低層：某層 0 種為 0 分，1 種為 0.7 分，
              2 種以上為 1 分，三層平均後換算成 100 分。
            </Typography>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6">使用限制</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            本工具不取代專業景觀設計，僅作為植栽搭配初期的理解與檢查輔助。
            實際配置仍需依基地條件、日照、土壤、排水、維護方式、預算與植物適應性，
            由專業設計者進一步判斷。
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6">下一步想探索</Typography>
          <Stack spacing={0.8} sx={{ mt: 1 }}>
            <Typography color="text.secondary">
              AI-assisted plant data entry：讓 AI 先產生植物資料草稿，再由使用者確認後加入資料庫。
            </Typography>
            <Typography color="text.secondary">
              Client-friendly report：產出更適合甲方閱讀的植栽搭配說明。
            </Typography>
            <Typography color="text.secondary">
              Report export：將季節亮點、全年綠量與空間層次整理成可放入簡報的圖表。
            </Typography>
            <Typography color="text.secondary">
              Site condition filters：未來加入日照、維護難度、空間類型與適地性條件。
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

export default MethodNote;
