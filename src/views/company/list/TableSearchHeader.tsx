// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// ** Icons Imports
import { auto } from '@popperjs/core';
import Magnify from 'mdi-material-ui/Magnify';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect } from 'react';

// props 타입 정의
interface TableSearchHeaderProps {
  searchWord: string;
  setSearchWord: (value: string) => void;
  pageNo: number;
  setPageNo: (value: number) => void;
  searchKey?: string | null;
  pageName: string;
}

// company 테이블 헤더 컴포넌트 (검색창)
const TableSearchHeader = (props: TableSearchHeaderProps) => {
  // ** Props
  const { searchWord, setSearchWord, pageNo, setPageNo, pageName } = props;

  // ** Hooks
  const router = useRouter();

  // 입력창에 데이터 입력 시, searchKeyword 상태 변경하는 함수
  const handleChangeKeyword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  // 검색 버튼 클릭 시, searchAction 상태 변경하는 함수
  const handleSearchKeyword = () => {
    setPageNo(1);
    router.push(`/${pageName}/list/?pageNo=${pageNo}&searchWord=${searchWord}`);
  };

  // 검색 후 페이지 번호 상태가 바뀔 때마다 요청
  useEffect(() => {
    router.push(`/${pageName}/list/?pageNo=${pageNo}&searchWord=${searchWord}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        mt: 4,
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
          placeholder="회원사명을 입력해주세요."
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
    </Box>
  );
};

export default TableSearchHeader;
