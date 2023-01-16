// ** React
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { auto } from '@popperjs/core';
import Magnify from 'mdi-material-ui/Magnify';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControl } from '@mui/material';

// ** Custom Components Imports
import TabsCustomButtonComment from './TabsCustomButtonComment';

// props 타입 정의
interface TableSearchHeaderToggleProps {
  searchWord: string;
  setSearchWord: (value: string) => void;
  pageNo: number;
  setPageNo: (value: number) => void;
  searchKey: string | null;
  setSearchKey: (value: string) => void;
  pageName: string;
}

// 테이블 헤더 컴포넌트 (검색 카테고리 + 검색창)
const TableSearchHeaderToggle = (props: TableSearchHeaderToggleProps) => {
  // ** Props
  const { searchWord, setSearchWord, pageNo, setPageNo, pageName, searchKey, setSearchKey } = props;

  // ** Hooks
  const router = useRouter();
  const [searchKeyError, setSearchKeyError] = useState<boolean>(false);

  // 검색 분류 선택 시 setSearchKey 상태 변경하는 함수
  const handleChangeKey = (e: SelectChangeEvent<string | null>) => {
    setSearchKey(e.target.value!);
    setSearchWord('');
  };

  // 입력창에 데이터 입력 시 searchKeyword 상태 변경하는 함수
  const handleChangeKeyword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  // 검색 버튼 클릭 시 호출
  const handleSearchKeyword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchKey === '' ? setSearchKeyError(true) : setSearchKeyError(false);

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
    <form noValidate onSubmit={(e) => handleSearchKeyword(e)}>
      <Box
        sx={{
          p: 5,
          pb: 3,
          mt: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <FormControl>
          <Select
            label=""
            id="searchKey"
            value={searchKey}
            size="small"
            inputProps={{ 'aria-label': 'Without label' }}
            displayEmpty
            sx={{ mb: 2, ml: 10 }}
            defaultValue=""
            required={true}
            error={searchKeyError}
            onChange={(e) => handleChangeKey(e)}

            // labelId="validation-basic-select"
            // aria-describedby="validation-basic-select"
          >
            <MenuItem disabled value="">
              검색 분류
            </MenuItem>
            <MenuItem value={'isComment'}>답변상태</MenuItem>
            <MenuItem value={'writer'}>작성자</MenuItem>
            <MenuItem value={'commenter'}>답변자</MenuItem>
            <MenuItem value={'regDate'}>등록일</MenuItem>
          </Select>
          {/*{searchKeyError && (*/}
          {/*  <FormHelperText sx={{ color: 'error.main' }} id="validation-basic-select">*/}
          {/*    This field is required*/}
          {/*  </FormHelperText>*/}
          {/*)}*/}
        </FormControl>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {searchKey === 'isComment' ? (
            <>
              <TabsCustomButtonComment
                searchKey={searchKey}
                searchWord={searchWord}
                setSearchWord={setSearchWord}
                pageNo={pageNo}
                setPageNo={setPageNo}
                pageName="comment"
              />
            </>
          ) : (
            <>
              <TextField
                size="small"
                value={searchWord}
                sx={{
                  mb: 2,
                  ml: 4,
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
                type="submit"
                startIcon={<Magnify color="primary" fontSize="large" />}
              />
            </>
          )}
        </Box>
      </Box>
    </form>
  );
};

export default TableSearchHeaderToggle;
