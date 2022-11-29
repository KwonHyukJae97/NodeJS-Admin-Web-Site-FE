// ** React
import { ChangeEvent, useEffect } from 'react';

// ** Next Import
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { auto } from '@popperjs/core';
import Magnify from 'mdi-material-ui/Magnify';
import { Plus } from 'mdi-material-ui';
import Typography from '@mui/material/Typography';

// props 타입 정의
interface TableSearchHeaderProps {
  searchWord: string;
  setSearchWord: (value: string) => void;
  pageNo: number;
  setPageNo: (value: number) => void;
  searchKey?: string | null;
  pageName: string;
}

// 테이블 헤더 컴포넌트 (검색창 + 등록 btn)
const TableSearchHeader = (props: TableSearchHeaderProps) => {
  // ** Props
  const { searchWord, setSearchWord, pageNo, setPageNo, pageName, searchKey } = props;

  // ** Hooks
  const router = useRouter();

  // 입력창에 데이터 입력 시, searchKeyword 상태 변경하는 함수
  const handleChangeKeyword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  // 검색 버튼 클릭 시 호출
  const handleSearchKeyword = () => {
    setPageNo(1);
    router.push(
      `/${pageName}/list/?pageNo=${pageNo}&searchWord=${searchWord}&searchKey=${searchKey}`,
    );
  };

  // 검색 후 페이지 번호 상태가 바뀔 때마다 요청
  useEffect(() => {
    router.push(
      `/${pageName}/list/?pageNo=${pageNo}&searchWord=${searchWord}&searchKey=${searchKey}`,
    );
  }, [pageNo]);

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        mt: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          value={searchWord}
          sx={{
            mb: 2,
            ml: 10,
            width: 360,
            '& .MuiInputBase-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
          }}
          placeholder="검색어를 입력해주세요."
          onChange={(e) => handleChangeKeyword(e)}
        />
        <Button
          sx={{
            mb: 2,
            padding: '0.55rem 0.2rem 0.55rem 0.8rem',
            border: '1px solid lightGrey',
            borderRadius: 1,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: 'white',
            minWidth: auto,
          }}
          startIcon={<Magnify color="primary" fontSize="large" />}
          onClick={handleSearchKeyword}
        />
      </Box>
      <Link href={`/${pageName}/add`} passHref>
        <Button
          sx={{ mr: 10, mb: 2, padding: '10px 18px' }}
          variant="contained"
          startIcon={<Plus />}
        >
          <Typography variant="subtitle2" style={{ color: 'white', fontWeight: 700 }}>
            등록
          </Typography>
        </Button>
      </Link>
    </Box>
  );
};

export default TableSearchHeader;
