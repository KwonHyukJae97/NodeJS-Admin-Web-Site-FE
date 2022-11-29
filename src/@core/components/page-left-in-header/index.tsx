// ** React Imports
import React, { ReactNode } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** MUI Imports
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { mdiChevronLeft } from '@mdi/js';
import Icon from '@mdi/react';

// props 타입 정의
interface PageLeftHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  maincategory?: ReactNode;
  subcategory?: ReactNode;
  setPageNo: (value: number) => void;
  setSearchWord?: (value: string) => void;
  pageName: string;
  setSearchKey?: (value: string) => void;
}

// 목록 페이지 헤더 컴포넌트 (왼쪽 정렬 + 카드 영역 내부에서 사용시)
const PageLeftInHeader = (props: PageLeftHeaderProps) => {
  // ** Props
  const {
    title,
    subtitle,
    maincategory,
    subcategory,
    setPageNo,
    setSearchWord,
    pageName,
    setSearchKey,
  } = props;

  // ** Hooks
  const router = useRouter();

  // 페이지 헤더 클릭 시, 페이지 번호, 검색어 입력값, 검색 카테고리 초기화
  const handleInitState = () => {
    setPageNo(1);
    setSearchWord ? setSearchWord('') : null;
    setSearchKey ? setSearchKey('') : null;
    router.push(`/${pageName}/list`);
  };

  return (
    <Grid item xs={12}>
      <Box sx={{ mt: 12, ml: 16, display: 'flex', alignItems: 'center' }}>
        <Box onClick={handleInitState}>
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Divider
          sx={{ ml: 5, mr: 5, borderLeftWidth: 'unset', height: 28, border: '1px solid lightgrey' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1">{maincategory}</Typography>
          <Icon path={mdiChevronLeft} size={1} horizontal color="lightgrey" />
          <Typography variant="body1">{subcategory}</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2, ml: 16 }}>
        <Typography variant="subtitle1">{subtitle || null} </Typography>
      </Box>
    </Grid>
  );
};

export default PageLeftInHeader;
