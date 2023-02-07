// ** React
import { ChangeEvent, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { auto } from '@popperjs/core';
import Magnify from 'mdi-material-ui/Magnify';
import { Close, Plus } from 'mdi-material-ui';
import Typography from '@mui/material/Typography';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// ** axios
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';
import authConfig from 'src/configs/auth';
import { Drawer, FormControl, FormHelperText } from '@mui/material';

import axios from 'axios';
import SidebarRight from '../add/SidebarRight';

// props 타입 정의
interface TableSearchHeaderProps {
  searchWord: string;
  setSearchWord: (value: string) => void;
  pageNo: number;
  setPageNo: (value: number) => void;
  searchKey?: string | null;
  pageName: string;

  //   handleAddEventSidebarToggle: () => void;
  //   dispatch: Dispatch<any>;
}

//테스트용 헤더
// 테이블 헤더 컴포넌트 (검색창 + 등록 btn)
const SearchHeaderPopup = (props: TableSearchHeaderProps) => {
  // ** Props
  const {
    searchWord,
    setSearchWord,
    pageNo,
    setPageNo,
    pageName,
    searchKey,

    // handleAddEventSidebarToggle,
  } = props;

  // ** Hooks
  const router = useRouter();

  //등록자 이름 조회
  const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!;
  const resData = JSON.parse(userData);

  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false);

  // 입력창에 데이터 입력 시, searchKeyword 상태 변경하는 함수
  const handleChangeKeyword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  //디폴트값 정의
  const defaultValues = {
    wordLevelSequence: '',
    wordLevelName: '',
    regBy: resData.name,
  };

  const schema = yup.object().shape({
    wordLevelSequence: yup.number().required(),
    wordLevelName: yup.string().required(),
  });

  const {
    clearErrors,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  //단어레벨 입력값 타입 정의
  interface WordLevelInputData {
    wordLevelSequence: string;
    wordLevelName: string;
    regBy: string;
  }

  //팝업창에서 정보등록 함수
  const createWordLevel = async (data: WordLevelInputData) => {
    if (confirm('단어레벨을 등록 하시겠습니까?')) {
      try {
        const res = await Api.post(`${apiConfig.apiEndpoint}/word_level`, data, {
          withCredentials: true,
        });
        alert('등록이 완료 되었습니다.');
        location.reload();
        console.log(res);
      } catch (err) {
        console.log(err);
        alert('등록에 실패하였습니다.');
      }
    }
  };

  // 검색 버튼 클릭 시 호출
  const handleSearchKeyword = () => {
    setPageNo(1);
    router.push(
      `/${pageName}/list/?pageNo=${pageNo}&searchWord=${searchWord}&searchKey=${searchKey}`,
    );
  };

  //팝업창 오픈 합수
  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen);

  //팝업창 닫는 함수
  const handleSidebarClose = async () => {
    clearErrors();
    handleAddEventSidebarToggle();
  };

  // 검색 후 페이지 번호 상태가 바뀔 때마다 요청
  //   useEffect(() => {
  //     console.log('render');
  //     router.push(
  //       `/${pageName}/list/?pageNo=${pageNo}&searchWord=${searchWord}&searchKey=${searchKey}`,
  //     );
  //   }, [pageNo]);

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
      <SidebarRight handleAddEventSidebarToggle={handleAddEventSidebarToggle} />
      {/* 팝업창 */}
      <Drawer
        anchor="right"
        open={addEventSidebarOpen}
        onClose={handleSidebarClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
      >
        <Box
          className="sidebar-header"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#E2E2E2',
            p: (theme) => theme.spacing(3, 3.255, 3, 5.255),
          }}
        >
          <Typography variant="h6">{'단어레벨 정보 등록'}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Close fontSize="small" onClick={handleSidebarClose} sx={{ cursor: 'pointer' }} />
          </Box>
        </Box>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(createWordLevel)}>
          <Box sx={{ ml: 5, mr: 14, mt: 4 }}>
            <FormControl fullWidth>
              <Controller
                name="wordLevelSequence"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    size="small"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder="순서"
                    sx={{ mb: 1, mt: 2 }}
                    error={Boolean(errors.wordLevelSequence)}
                  />
                )}
              />
              {errors.wordLevelSequence && (
                <FormHelperText sx={{ color: 'error.main', mt: 0 }}>
                  {errors.wordLevelSequence.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box sx={{ ml: 5, mr: 14, mt: 4 }}>
            <FormControl fullWidth>
              <Controller
                name="wordLevelName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    size="small"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder="단어레벨명"
                    sx={{ mb: 1, mt: 2 }}
                    error={Boolean(errors.wordLevelName)}
                  />
                )}
              />
              {errors.wordLevelName && (
                <FormHelperText sx={{ color: 'error.main', mt: 0 }}>
                  {errors.wordLevelName.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            sx={{
              ml: 14,
              mr: 14,
              mb: 10,
              mt: 4,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="contained" sx={{ mr: 3 }} type="submit">
              등록
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSidebarClose}
              sx={{ cursor: 'pointer' }}
            >
              취소
            </Button>
          </Box>
        </form>
      </Drawer>
    </Box>
  );
};

export default SearchHeaderPopup;
