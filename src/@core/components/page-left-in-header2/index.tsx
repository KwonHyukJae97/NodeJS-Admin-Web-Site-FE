// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Types
import { PageLeftHeaderProps } from './types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// 목록 페이지 헤더 컴포넌트 (왼쪽 정렬 + 카드 영역 내부에서 사용시)
const PageLeftInHeader2 = (props: PageLeftHeaderProps) => {
  // ** Props
  const { title, subtitle, maincategory, subcategory } = props;

  return (
    <Grid item xs={12}>
      <Box sx={{ mt: 12, ml: 17, display: 'flex' }}>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          {maincategory}
        </Typography>
        <Box sx={{ ml: 1.2, mr: 1.2 }}>
          <Typography variant="body2" sx={{ color: 'gray' }}>
            {'>'}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          {subcategory}
        </Typography>
      </Box>

      <Box sx={{ mt: 2, ml: 16, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ ml: 5, mr: 5, borderLeftWidth: 'unset', height: 28 }} />
        <Box sx={{ display: 'flex' }}>
          <Typography variant="subtitle1">{subtitle || null} </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default PageLeftInHeader2;
