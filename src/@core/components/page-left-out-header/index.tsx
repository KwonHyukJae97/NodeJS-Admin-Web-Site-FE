// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import {PageLeftHeaderProps} from './types'
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// 목록 페이지 헤더 컴포넌트 (왼쪽 정렬 + 카드 영역 외부에서 사용시)
const PageLeftOutHeader = (props: PageLeftHeaderProps) => {
  // ** Props
  const {title, maincategory, subcategory} = props

  return (
    <Grid item xs={12}>
      <Box sx={{ mt: 5, ml: 4, mr: 4, mb: 4, display:'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant='h4'>{title}</Typography>
        </Box>
        <Divider sx={{ ml: 5, mr: 5, borderLeftWidth: 'unset', height: 28}} />
        <Box sx={{ display: 'flex'}}>
          <Typography variant='body1'>{maincategory}</Typography>
          <Box sx={{ ml: 1.2, mr: 1.2}}>
            <Typography variant='subtitle2'>{'>'}</Typography>
          </Box>
          <Typography variant='body1'>{subcategory}</Typography>
        </Box>

      </Box>
    </Grid>
  )
}

export default PageLeftOutHeader
