// ** React Imports
import React, { useEffect, useState } from 'react';
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

// ** Custom Components Imports
import BoardLeftInHeader from '../BoardLeftInHeader';

// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// ** Types Imports
import { QnaType } from '../../../types/apps/boardTypes';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getDateTime, role } from 'src/pages/notice/list';

type dataProps = {
  id: number;
};

// QnA 입력값 타입 정의
interface FormData {
  title: string;
  content: string;
}

// QnA 수정 페이지
const QnaEdit = ({ id }: dataProps) => {
  // ** State
  const [data, setData] = useState<QnaType>({
    boardId: 0,
    content: '',
    fileList: [],
    id: 0,
    isComment: false,
    regDate: '',
    title: '',
    viewCnt: 0,
    writer: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  // ** Vars
  const schema = yup.object().shape({
    title: yup.string().required(),
    content: yup.string().required(),
  });

  const defaultValues = {
    title: '',
    content: '',
  };

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
    getQnaDetail(id);
  }, []);

  useEffect(() => {
    if (data.title !== '') {
      setValue('title', data.title);
      setValue('content', data.content!);
    }
  }, [data]);

  // QnA 상세조회 API 호출
  const getQnaDetail = async (id: number) => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/qna/${id}`, {
        data: { role },
      });

      const qnaData = {
        boardId: res.data.qna.qnaId,
        title: res.data.qna.title,
        content: res.data.qna.content,
        isComment: res.data.qna.isComment,
        regDate: getDateTime(res.data.qna.regDate),
        writer: res.data.qna.writer,
        fileList: res.data.qna.fileList,
      };
      console.log(qnaData);
      setData(qnaData);

      // 파일 정보 조회하여 Blob 형으로 재정의 처리
      const tempFiles = [];
      for (let index = 0; index < res.data.qna.fileList.length; index++) {
        const file: {
          boardFileId: number;
          originalFileName: string;
          filePath: string;
        } = res.data.qna.fileList[index];

        const fileResult = await axios.get(`${apiConfig.apiEndpoint}/file/${file.boardFileId}`, {
          responseType: 'blob',
        });

        tempFiles.push(new File([fileResult.data], file.originalFileName));
      }

      setFiles(tempFiles);
    } catch (err) {
      console.log(err);
    }
  };

  // 수정 버튼 클릭 시, api 요청
  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    if (files.length !== 0) {
      files.map((file) => {
        formData.append('files', file);
      });
    }

    formData.append('title', data.title);
    formData.append('content', data.content);

    await editFaq(formData);
  };

  // QnA 수정 API 호출
  const editFaq = async (formData: any) => {
    if (confirm('수정 하시겠습니까?')) {
      try {
        const req = await axios.patch(`${apiConfig.apiEndpoint}/qna/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('수정 성공', req);
        alert('수정이 완료되었습니다.');

        router.replace(`/qna/view/${id}`);
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
          <BoardLeftInHeader title={'1:1 문의 수정'} />

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
                {/*<FileUploaderMultiple files={data.fileList} setFiles={setFiles} />*/}
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
                수정
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

export default QnaEdit;
