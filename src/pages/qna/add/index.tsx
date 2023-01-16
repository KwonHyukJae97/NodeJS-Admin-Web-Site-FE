// ** React Imports
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// ** Next Import
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';

// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';

// ** Custom Components Imports
import BoardLeftInHeader from 'src/views/board/BoardLeftInHeader';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// QnA 입력값 타입 정의
interface QnaInputData {
  title: string;
  content: string;
}

// input 초기값
const defaultValues = {
  title: '',
  content: '',
};

// QnA 등록 페이지
const QnaAdd = () => {
  // ** State
  const [files, setFiles] = useState<File[]>([]);

  // ** Vars
  const schema = yup.object().shape({
    title: yup.string().required(),
    content: yup.string().required(),
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

  // 등록 버튼 클릭 시 호출
  const onSubmit = async (data: QnaInputData) => {
    const formData = new FormData();

    if (files.length !== 0) {
      files.map((file) => {
        formData.append('files', file);
      });
    }

    formData.append('title', data.title);
    formData.append('content', data.content);

    await createQna(formData);
  };

  // QnA 등록 API 호출
  const createQna = async (formData: any) => {
    if (confirm('등록 하시겠습니까?')) {
      try {
        const req = await Api.post(`${apiConfig.apiEndpoint}/qna`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('등록 성공', req);
        alert('등록이 완료되었습니다.');

        router.replace('/qna/list');
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
          <BoardLeftInHeader title={'1:1 문의 등록'} />

          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ ml: 14, mr: 14, mt: 6 }}>
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
              <FormControl fullWidth>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size="small"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder="문의 내용을 입력해주세요."
                      multiline={true}
                      rows={7}
                      sx={{ mb: 1, mt: 2 }}
                      error={Boolean(errors.content)}
                    />
                  )}
                />
                {errors.content && (
                  <FormHelperText sx={{ color: 'error.main', mt: 0 }}>
                    {errors.content.message}
                  </FormHelperText>
                )}
              </FormControl>
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
              <Link href="/qna/list" passHref>
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

export default QnaAdd;
