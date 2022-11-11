// ** React Imports
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// ** Next Import
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import dynamic from 'next/dynamic';

// ** MUI Imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// ** Types Imports
import { CategoryType } from 'src/types/apps/boardTypes';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';
import { getCategory } from '../list';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// import EditorControlled from 'src/views/forms/form-elements/editor/EditorControlled';

const EditorControlled = dynamic(
  () => import('src/views/forms/form-elements/editor/EditorControlled'),
  { ssr: false },
);

// FAQ 입력값 타입 정의
interface FormData {
  title: string;
  categoryName: string;
  role: string;
}

const defaultValues = {
  title: '',
  categoryName: '',
};

// FAQ 등록 페이지
const FaqAdd = ({ categoryApiData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** State
  const [files, setFiles] = useState<File[]>([]);
  const [htmlStr, setHtmlStr] = useState<string>('');

  // ** Vars
  const schema = yup.object().shape({
    title: yup.string().required(),
    categoryName: yup.string().required(),
  });

  const categoryData: CategoryType[] = categoryApiData.map((data: any) => {
    const category: CategoryType = {
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      isUse: data.isUse,
    };

    return category;
  });

  // ** Hooks
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // 등록 버튼 클릭 시, api 요청
  const onSubmit = async (data: FormData) => {
    console.log('category 선택', data.categoryName);
    const formData = new FormData();

    if (files.length !== 0) {
      files.map((file) => {
        formData.append('files', file);
      });
    }

    formData.append('role', '본사 관리자');
    formData.append('title', data.title);
    formData.append('content', htmlStr);
    formData.append('categoryName', data.categoryName);

    await registerFaq(formData);
  };

  // FAQ 등록 API 호출
  const registerFaq = async (formData: any) => {
    if (confirm('등록 하시겠습니까?')) {
      try {
        const req = await axios.post(`${apiConfig.apiEndpoint}/faq`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('등록 성공', req);
        alert('등록이 완료되었습니다.');

        router.replace('/board/faq/list');
      } catch (err) {
        console.log(err);
        alert('등록에 실패하였습니다.');
      }
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ mt: 10, ml: 14, display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              자주 묻는 질문 등록
            </Typography>
          </Box>

          <Divider sx={{ ml: 12, mr: 12, borderBottomWidth: 'unset' }} />

          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ ml: 14, mr: 14, mt: 6 }}>
              <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
                분류
              </Typography>
              <FormControl sx={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                <Controller
                  name="categoryName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label=""
                      onChange={onChange}
                      size="small"
                      error={Boolean(errors.categoryName)}
                      inputProps={{ 'aria-label': 'Without label' }}
                      displayEmpty
                      sx={{ mt: 2, mb: 1 }}

                      // labelId="validation-basic-select"
                      // aria-describedby="validation-basic-select"
                    >
                      <MenuItem disabled value="">
                        분류 선택
                      </MenuItem>
                      {categoryData.map((category) => {
                        return (
                          <MenuItem value={category.categoryName} key={category.categoryId}>
                            {category.categoryName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                />
                {errors.categoryName && (
                  <FormHelperText sx={{ color: 'error.main' }} id="validation-basic-select">
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box sx={{ ml: 14, mr: 14, mt: 3 }}>
              <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
                제목
              </Typography>
              <FormControl fullWidth>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size="small"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder="제목을 입력해주세요."
                      sx={{ mb: 1, mt: 2 }}
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main', mt: 0 }}>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box sx={{ ml: 14, mr: 14, mt: 4 }}>
              <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
                내용
              </Typography>
              <EditorWrapper>
                <Grid container spacing={6} className="match-height">
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <EditorControlled initStr={''} htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
                  </Grid>
                </Grid>
              </EditorWrapper>
            </Box>

            <Box sx={{ ml: 14, mr: 14, mt: 4, mb: 10 }}>
              <Typography variant="subtitle2" sx={{ ml: 0.5, mb: 2 }}>
                첨부파일
              </Typography>
              <DropzoneWrapper>
                <FileUploaderMultiple files={files} setFiles={setFiles} />
              </DropzoneWrapper>
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
                등록
              </Button>
              <Link href="/faq/list" passHref>
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

export const getServerSideProps: GetServerSideProps = async () => {
  // 서버사이드 렌더링 시, 브라우저와는 별개로 직접 쿠키를 넣어 요청해야하기 때문에 해당 작업 반영 예정
  // 현재는 테스트를 위해 backend 단에서 @UseGuard 주석 처리 후, 진행
  const categoryResult = await getCategory();

  const categoryApiData: CategoryType[] = categoryResult;

  return {
    props: {
      categoryApiData,
    },
  };
};

export default FaqAdd;
