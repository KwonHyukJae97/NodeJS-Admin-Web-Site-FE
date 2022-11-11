// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// ** Icons Imports
import { auto } from '@popperjs/core';
import Magnify from 'mdi-material-ui/Magnify';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';

interface TableSearchHeaderProps {
  searchWord: string;
  setSearchWord: (value: string) => void;
  pageNo: number;
  setPageNo: (value: number) => void;
}

// company 테이블 헤더 컴포넌트 (검색창)
const TableSearchHeader = (props: TableSearchHeaderProps) => {
  // ** Props
  const { searchWord, setSearchWord, pageNo, setPageNo } = props;

  // ** Hooks
  const router = useRouter();

  // 입력창에 데이터 입력 시, searchKeyword 상태 변경하는 함수
  const handleChangeKeyword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  // 검색 버튼 클릭 시, searchAction 상태 변경하는 함수
  // 해당 함수를 탈 때마다 company/list의 useEffect 실행됨
  const handleSearchKeyword = () => {
    setPageNo(1);
    router.push(`/company/list/?pageNo=${pageNo}&searchWord=${searchWord}`);
  };

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
          placeholder="검색어를 입력해주세요."
          onChange={(e) => handleChangeKeyword(e)}
        />
        <Button
          sx={{
            mb: 2,
            padding: '0.55rem 0.2rem 0.55rem 0.8rem',

            // pt: 2.5,
            // pb: 2,
            // pl: 4,
            // pr: 1,
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
