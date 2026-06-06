import { Box, Card, Chip, Stack, Typography } from '@mui/material';

function AudienceNote() {
  return (
    <Card sx={{ p: { xs: 2.4, md: 3 }, mb: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5">這個工具適合誰？</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 920 }}>
            適合想初步理解植栽搭配的人，例如甲方、景觀初學者、非景觀背景設計者，
            或正在整理庭院、社區中庭、入口花台植栽方向的人。
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 920 }}>
            它可以幫助使用者快速看懂一組植物搭配在四季中的季節亮點、全年綠量穩定度，
            以及高、中、低層植栽是否完整。
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip label="季節亮點" color="secondary" variant="outlined" />
          <Chip label="全年綠量穩定度" color="primary" variant="outlined" />
          <Chip label="空間層次完整度" color="primary" variant="outlined" />
        </Stack>
      </Stack>
    </Card>
  );
}

export default AudienceNote;
