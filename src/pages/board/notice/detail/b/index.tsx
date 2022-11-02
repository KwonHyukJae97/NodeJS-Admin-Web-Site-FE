// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CustomChip from "../../../../../@core/components/mui/chip";
import Button from "@mui/material/Button";

// 공지사항 상세 B안 페이지
const FormLayouts = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ mr:14, ml:14, mt: 10, display:'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
              본사용 공지사항
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              공지사항 {'>'} 본사용
            </Typography>
          </Box>

          <Divider sx={{ ml: 12, mr: 12, borderBottomWidth: 'unset' }} />

          <Box sx={{ ml:13, mt: 7, display: 'flex'}}>
            <CustomChip
              skin='light'
              size='medium'
              label='중요'
              color='primary'
              sx={{'& .MuiChip-label': {lineHeight: '18px'}, fontWeight: 700, fontSize:'0.95rem', mr: 2.5}}
            />
            <Typography variant='h5' sx={{ fontWeight: 700 }}>
              TenPick 서비스 이용 점검 안내
            </Typography>
          </Box>

          <Box sx={{ ml: 14, mr: 14, mt: 3, display:'flex', justifyContent: 'space-between'}}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
              2022-11-01
            </Typography>
            <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
              작성자ㅣ본사 관리자(IT개발팀)
            </Typography>
          </Box>

          <Divider sx={{ ml: 12, mr: 12, mt: 6, borderBottomWidth: 'unset'}} />

          <Box sx={{ ml: 14, mr: 14, mt: 8, mb: 6, height: 450}}>
            <Typography variant='subtitle2' style={{ color: 'black', fontWeight: 300 }} >
              It has been said that astronomy is a humbling and character-building experience.
              <p>There is perhaps no better demonstration of the folly of human conceits than this distant image of our tiny world.
                To me, it underscores our responsibility to deal more kindly with one another, and to preserve and cherish the pale blue dot, the only home we’ve ever known.</p>
              <p>There is perhaps no better demonstration of the folly of human conceits than this distant image of our tiny world.
                To me, it underscores our responsibility to deal more kindly with one another, and to preserve and cherish the pale blue dot, the only home we’ve ever known.</p>
            </Typography>
          </Box>

          <Box sx={{ ml: 14, mr: 14, mb: 10, display:'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' sx={{ mr: 3 }}>수정</Button>
            <Button variant='outlined' color='error' sx={{ mr: 3 }}>
              삭제
            </Button>
            <Button variant='outlined' color='secondary'>
              취소
            </Button>
          </Box>

        </Card>
      </Grid>
    </Grid>
  )
}

export default FormLayouts
