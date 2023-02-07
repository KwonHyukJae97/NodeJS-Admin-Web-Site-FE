// ** React
import { ChangeEvent, useEffect, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { auto } from '@popperjs/core';
import Magnify from 'mdi-material-ui/Magnify';
import { Close, Plus, TableRow } from 'mdi-material-ui';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// ** axios
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';
import authConfig from 'src/configs/auth';

import {
  Drawer,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  TableCell,
} from '@mui/material';
import SidebarRight from '../add/SidebarRight';

import { WordLevelNameType, WordLevelType } from 'src/types/apps/wordLevelTypes';
import axios from 'axios';
import { number } from 'yup/lib/locale';

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

  useEffect(() => {
    getAllWordLevel();
  }, []);

  //여기서 단어레벨 호출
  //호출한 데이터 map으로 돌려서 select박스에 넣기
  // const wordLevelMapData = wordLevelNameData.map((data: any) => {
  //   const wordLevelNames: WordLevelNameType = {
  //     wordLevelId: data.wordLevelId,
  //     wordLevelName: data.wordLevelName,
  //   };

  //   console.log('단어레벨명', wordLevelNames);

  //   return wordLevelNames;
  // });

  //등록자 이름 조회
  const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!;
  const resData = JSON.parse(userData);

  // ** State
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false),
    // [statusValue, setStatusValue] = useState<string>(''),
    [wordLevelName, setWordLevelName] = useState<string>(''),
    [wordLevelData, setWordLevelData] = useState<any[]>([]),
    [wordLevelId, setWordLevelId] = useState<number>();

  // const handleStatusValue = (e: SelectChangeEvent) => {
  //   setStatusValue(e.target.value);
  // };

  // 입력창에 데이터 입력 시, searchKeyword 상태 변경하는 함수
  const handleChangeKeyword = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };
  // 단어 레벨 목록 조회 API 요청
  const getAllWordLevel = async () => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/word_level`);
      console.log('제발좀', res);
      // const wordLevelListData = res.data.map((value: any) => {
      //   const detailData = {
      //     wordLevelId: value.wordLevelId,
      //     wordLevelName: value.wordLevelName,
      //   };
      //   return detailData;
      // });
      setWordLevelData(
        res.data.map((value: any) => {
          const realData = {
            wordLevelId: value.wordLevelId,
            wordLevelName: value.wordLevelName,
          };
          console.log('리얼데이터', realData);
          return realData;
        }),
      );
      // setWordLevelId(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  //디폴트값 정의
  const defaultValues = {
    // wordLevelName: '',
    wordLevelId: 0,
    projectName: '',
    regBy: resData.name,
  };

  const schema = yup.object().shape({
    // wordLevelName: yup.string().required(),
    projectName: yup.string().required(),
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
  interface ProjectInputData {
    wordLevelId: number;
    projectName: string;
    regBy: string;
  }

  //팝업창에서 정보등록 함수
  const createProject = async (data: ProjectInputData) => {
    alert('dd');
    console.log('등러가는 데이터', data);
    if (confirm('프로젝트를 등록 하시겠습니까?')) {
      try {
        const res = await Api.post(`${apiConfig.apiEndpoint}/project`, data, {
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

  const handleWordLevelName = (e: SelectChangeEvent) => {
    if (e.target.value === '0') {
      setWordLevelName('');
    }
    setWordLevelName(e.target.value);
  };
  // 영역 검색 카테고리 스크롤바 생성
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 3;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

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
          <Typography variant="h6">{'프로젝트 정보 등록'}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Close fontSize="small" onClick={handleSidebarClose} sx={{ cursor: 'pointer' }} />
          </Box>
        </Box>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(createProject)}>
          <Box sx={{ ml: 5, mr: 14, mt: 4 }}>
            {/* <TableRow>
              <TableCell align="center" sx={{ border: '1px solid lightgrey', pl: 5 }}> */}
            {/* <InputLabel id="invoice-status-select">단어레벨 선택</InputLabel> */}
            <FormControl fullWidth>
              <InputLabel>단어레벨 선택</InputLabel>
              <Select
                fullWidth
                value={wordLevelName}
                onChange={handleWordLevelName}
                labelId="invoice-status-select"
                label="단어레벨 선택"
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={MenuProps}
              >
                <MenuItem
                  disabled
                  value={wordLevelId}
                  sx={{
                    display: 'none',
                  }}
                ></MenuItem>
                {wordLevelData.map((level: WordLevelNameType, index: number, array) => (
                  <MenuItem key={index} value={level.wordLevelName}>
                    {level.wordLevelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* </TableCell> */}
            {/* <TableCell align="center" sx={{ border: '1px solid lightgrey', pr: 5 }}> */}
            {/* </TableCell>
            </TableRow> */}
          </Box>
          {/* <Box sx={{ ml: 5, mr: 14, mt: 4 }}>
            <>
              <FormControl fullWidth>
                <InputLabel id="invoice-status-select">단어레벨 선택</InputLabel>
                이거해결하기, 단어레벨리스트에서 수정하기 보완. 프로젝트수정하기
                <Select
                  value={wordLevelName}
                  defaultValue="0"
                  onChange={handleWordLevelName}
                  inputProps={{ 'aria-label': 'Without label' }}
                  size="small"
                  MenuProps={MenuProps}
                >
                  <MenuItem
                    disabled
                    value=""
                    sx={{
                      display: 'none',
                    }}
                  ></MenuItem>
                  <MenuItem value="0">전체</MenuItem>
                  {wordLevelData.map((level: WordLevelType, index: number) => {
                    <MenuItem key={index} value={level.wordLevelId}>
                      {level.wordLevelName}
                    </MenuItem>;
                  })}
                </Select>
              </FormControl>
            </>
          </Box> */}

          <Box sx={{ ml: 5, mr: 14, mt: 4 }}>
            <FormControl fullWidth>
              <Controller
                name="projectName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={value}
                    onBlur={onBlur}
                    label="프로젝트명"
                    onChange={onChange}
                    placeholder="프로젝트명"
                    sx={{ mb: 1, mt: 2 }}
                    error={Boolean(errors.projectName)}
                  />
                )}
              />
              {errors.projectName && (
                <FormHelperText sx={{ color: 'error.main', mt: 0 }}>
                  {errors.projectName.message}
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
              // onClick={getWordLevelName}
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
