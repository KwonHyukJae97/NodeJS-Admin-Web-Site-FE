// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// ** Icons Imports
import Magnify from 'mdi-material-ui/Magnify';
import { Plus } from 'mdi-material-ui';
import Typography from '@mui/material/Typography';
import { auto } from '@popperjs/core';
import { ChangeEvent } from 'react';

interface TableSearchHeaderProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  setSearchAction: (value: string) => void;
}

// Notice 테이블 헤더 컴포넌트 (검색창 + 등록 btn)
const TableSearchHeader = (props: TableSearchHeaderProps) => {
  // ** Props
  const { searchKeyword, setSearchKeyword, setSearchAction } = props;

  // 입력창에 데이터 입력 시, searchKeyword 상태 변경하는 함수
  const handleChangeKeyword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 버튼 클릭 시, searchAction 상태 변경하는 함수
  // 해당 함수를 탈 때마다 notice/list의 useEffect 실행됨
  const handleSearchKeyword = () => {
    setSearchAction(searchKeyword);
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
          value={searchKeyword}
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
      <Link href="/board/notice/add" passHref>
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
