// ** React Imports
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// ** Next Import
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// ** MUI Imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// ** Types Imports

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import authConfig from 'src/configs/auth';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';
import BoardLeftInHeader from 'src/views/board/BoardLeftInHeader';
import { WordLevelType } from 'src/types/apps/wordLevelTypes';

const EditorControlled = dynamic(
  () => import('src/views/forms/form-elements/editor/EditorControlled'),
  { ssr: false },
);

// input 초기값
const defaultValues = {
  wordLevelSequence: 0,
  wordLevelName: '',
  isService: false,
  updateBy: '',
  radio: '',
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

// 공지사항 수정 페이지
const WordLevelEdit = ({ id }: WordLevelEditProps) => {
  // ** State
  const [data, setData] = useState<WordLevelType>(initWordLevel);

  // ** Vars
  const schema = yup.object().shape({
    // wordLevelName: yup.string().min(1).max(20).required(),
    // wordLevelSequence: yup.number().min(1).max(3).required(),
    isService: yup.string().required(),
  });

  // ** Hooks
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getDetailWordLevel(id);
  }, [id]);

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
      console.log(wordLevelData);
      setData(wordLevelData);
    } catch (err) {
      console.log(err);
    }
  };

  const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!;
  const resData = JSON.parse(userData);

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

        router.replace('/word_level/list');
      } catch (err) {
        console.log(err);
        alert('수정에 실패하였습니다.');
      }
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <BoardLeftInHeader title={'단어레벨 수정'} />

          <form noValidate autoComplete="off" onSubmit={handleSubmit(updateWordLevel)}>
            <Box sx={{ ml: 14, mr: 14, mt: 3 }}>
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
            <Box sx={{ ml: 14, mr: 14, mt: 6 }}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="wordLevelSequence"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="단어레벨 순번"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.wordLevelSequence)}
                    />
                  )}
                />
                {errors.wordLevelSequence && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.wordLevelSequence.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box sx={{ ml: 14, mr: 14, mt: 3 }}>
              <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
                단어레벨명
              </Typography>
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
                      placeholder="단어 레벨명을 입력해주세요."
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
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="contained" sx={{ mr: 3 }} type="submit">
                수정
              </Button>
              <Link href="/word_level/list" passHref>
                <Button variant="outlined" color="secondary">
                  취소
                </Button>
              </Link>
            </Box>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WordLevelEdit;
