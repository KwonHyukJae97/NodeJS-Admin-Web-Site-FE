// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import {PageLeftHeaderProps} from './types'
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// 상세 페이지 헤더 컴포넌트 (왼쪽 정렬 + 카드 영역 외부에서 사용시)
const PageLeftOutHeader2 = (props: PageLeftHeaderProps) => {
  // ** Props
  const {title, subtitle, maincategory, subcategory} = props

  return (
    <Grid item xs={12}>
      <Box sx={{ mt: 5, ml: 4, mr: 4, mb: 2, display:'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>{title}</Typography>
        </Box>
        <Divider sx={{ ml: 4, mr: 4, borderLeftWidth: 'unset', height: 20}} />
        <Box sx={{ display: 'flex'}}>
          <Typography variant='subtitle2'>{maincategory}</Typography>
          <Box sx={{ ml: 1.2, mr: 1.2}}>
            <Typography variant='subtitle2'>{'>'}</Typography>
          </Box>
          <Typography variant='subtitle2'>{subcategory}</Typography>
        </Box>
      </Box>
    </Grid>
  )
}

export default PageLeftOutHeader2
