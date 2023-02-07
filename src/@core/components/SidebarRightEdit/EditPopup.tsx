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
import { Close, Plus } from 'mdi-material-ui';
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
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from '@mui/material';
import { WordLevelType } from 'src/types/apps/wordLevelTypes';
import { getDateTime } from 'src/utils/getDateTime';
import SidebarEdit from 'src/pages/word_level/edit/SidebarEdit';
import axios from 'axios';
// import SidebarRight from '../add/SideBarRight';
// 공지사항 초기값 정의
const initWordLevel = {
  id: 0,
  projectId: 0,
  wordLevelId: 0,
  wordLevelName: '',
  wordLevelSequence: 0,
  projectName: '',
  isService: true,
  updateBy: '',
  regBy: '',
  regDate: '',
  totalCount: 0,
};

// props 타입 정의
interface WordLevelEditProps {
  id: number;
}

// 공지사항 입력값 타입 정의
interface WordLevelInputData {
  wordLevelSequence: string;
  wordLevelName: string;
  isService: boolean;
  updateBy: string;
  radio: string;
}

//단어레벨 입력값 타입 정의
interface WordLevelInputData {
  wordLevelSequence: string;
  wordLevelName: string;
  isService: boolean;
  updateBy: string;
  radio: string;
}

const EditPopup = ({ id }: WordLevelEditProps) => {
  // state
  const [editEventSidebarOpen, setEditEventSidebarOpen] = useState<boolean>(false);
  const [data, setData] = useState<WordLevelType>(initWordLevel);
  //수정자 이름 조회
  const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!;
  const resData = JSON.parse(userData);

  //디폴트값 정의
  const defaultValues = {
    wordLevelSequence: 0,
    wordLevelName: '',
    isService: false,
    updateBy: resData.name,
    radio: '',
  };

  // ** Hooks
  const router = useRouter();

  const schema = yup.object().shape({
    wordLevelSequence: yup.number().required(),
    wordLevelName: yup.string().required(),
  });

  const {
    clearErrors,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // useEffect(() => {
  //   getDetailWordLevel(id);
  // }, [id]);

  useEffect(() => {
    if (data.wordLevelName !== '') {
      setValue('wordLevelName', data.wordLevelName);
      setValue('wordLevelSequence', data.wordLevelSequence);
      setValue('isService', data.isService);
    }
  });

  // 단어레벨 상세조회 API 호출
  const getDetailWordLevel = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/word_level/${id}`);
      const wordLevelData = {
        wordLevelId: res.data.wordLevelId,
        wordLevelSequence: res.data.wordLevelSequence,
        wordLevelName: res.data.wordLevelName,
        isService: res.data.isService,
        regBy: res.data.regBy,
        id: res.data.regBy,
        projectId: res.data.projectId,
        projectName: res.data.projectName,
        totalCount: res.data.totalCount,
        regDate: getDateTime(res.data.regDate),
      };
      setData(wordLevelData);
    } catch (err) {
      console.log(err);
    }
  };

  // 수정 버튼 클릭 시 호출
  const updateWordLevel = async (data: WordLevelInputData) => {
    console.log('서비스여부 수정 데이터 값', data.isService);
    if (confirm('수정 하시겠습니까?')) {
      try {
        const req = await Api.patch(`${apiConfig.apiEndpoint}/word_level/${id}`, {
          wordLevelName: data.wordLevelName,
          wordLevelSequence: data.wordLevelSequence,
          isService: data.isService,
          updateBy: resData.name,
        });
        console.log('수정 성공', req.data.isService);
        alert('수정이 완료되었습니다.');
        location.reload();
        router.replace('/word_level/list');
      } catch (err) {
        console.log(err);
        alert('수정에 실패하였습니다.');
      }
    }
  };
  //팝업창 오픈 합수
  const handleEditEventSidebarToggle = () => setEditEventSidebarOpen(!editEventSidebarOpen);

  //팝업창 닫는 함수
  const handleSidebarClose = async () => {
    clearErrors();
    handleEditEventSidebarToggle();
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
      <SidebarEdit handleEditEventSidebarToggle={handleEditEventSidebarToggle} />
      {/* 팝업창 */}
      <Drawer
        anchor="right"
        open={editEventSidebarOpen}
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
          <Typography variant="h6">{'단어레벨 정보 수정'}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Close fontSize="small" onClick={handleSidebarClose} sx={{ cursor: 'pointer' }} />
          </Box>
        </Box>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(updateWordLevel)}>
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
                    label="순서"
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
                    label="단어레벨명"
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
          <Box sx={{ ml: 5, mr: 14, mt: 3 }}>
            <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
              서비스여부
            </Typography>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <Controller
                name="isService"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup row {...field} aria-label="isService" name="validation-basic-radio">
                    <FormControlLabel
                      value={false}
                      label="미사용"
                      sx={errors.radio ? { color: 'error.main' } : null}
                      control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                    />
                    <FormControlLabel
                      value={true}
                      label="사용"
                      sx={errors.radio ? { color: 'error.main' } : null}
                      control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                    />
                  </RadioGroup>
                )}
              />
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
              수정
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
export default EditPopup;
