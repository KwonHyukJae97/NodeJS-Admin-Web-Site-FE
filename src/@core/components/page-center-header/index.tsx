// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import {PageCenterHeaderProps} from './types'
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// 페이지별 고정 헤더 컴포넌트 (가운데 정렬 버전)
const PageCenterHeader = (props: PageCenterHeaderProps) => {
  // ** Props
  const {title, subtitle, maincategory, subcategory} = props

  return (
    <Grid item xs={12}>
      <Box sx={{ mt: 12, ml: 16, display: 'flex'}}>
        <Typography variant='body1'>{maincategory}</Typography>
        <Box sx={{ ml: 1.2, mr: 1.2}}>
          <Typography variant='subtitle2'>{'>'}</Typography>
        </Box>
        <Typography variant='body1'>{subcategory}</Typography>
      </Box>
      <Box sx={{ mt: 12, mb: 14, textAlign: 'center' }}>
        <Typography variant='h4'>{title}</Typography>
        <Box sx={{ borderTop: '2px solid lightGrey', width: 30, margin: '18px auto' }} />
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant='subtitle1'>{subtitle || null} </Typography>
        </Box>
      </Box>
    </Grid>
  )
}

export default PageCenterHeader
