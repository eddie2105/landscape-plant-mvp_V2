import { Box, Card, Stack, Typography } from '@mui/material';

function MethodNote() {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2.4}>
        <Box>
          <Typography variant="h6">方法說明</Typography>
          <Stack spacing={1.25} sx={{ mt: 1.2 }}>
            <Typography color="text.secondary">
              本工具目前以三個面向檢查植栽搭配：季節亮點、全年綠量穩定度與空間層次完整度。
            </Typography>
            <Typography color="text.secondary">
              季節亮點會依使用者選擇的「想看的花季」計算。每個目標月份會加總當月開花植物的
              flower_impact：花量影響值 ≥ 3 為表現明顯，≥ 1 為基本支撐，無開花表現則建議補強。
            </Typography>
            <Typography color="text.secondary">
              全年綠量穩定度用來判斷非花期時是否仍有穩定背景綠量。覆蓋率 ≥ 80% 為表現明顯，
              ≥ 60% 為基本支撐，低於 60% 則建議補強。
            </Typography>
            <Typography color="text.secondary">
              空間層次完整度依植物類型檢查高、中、低層是否完整：喬木為高層，灌木為中層，
              草本 / 地被為低層。每一層 2 種以上為 1 分，1 種為 0.7 分，0 種為 0 分。
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
