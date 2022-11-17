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
// ** Styled Component Import
// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// ** Types Imports
import apiConfig from 'src/configs/api';

// ** axios
import axios from 'axios';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dynamic from 'next/dynamic';
import { getDateTime, role } from '../../../pages/notice/list';
import { CategoryType, FaqType } from '../../../types/apps/boardTypes';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import BoardLeftInHeader from '../BoardLeftInHeader';

// import EditorControlled from 'src/views/forms/form-elements/editor/EditorControlled';

const EditorControlled = dynamic(
  () => import('src/views/forms/form-elements/editor/EditorControlled'),
  { ssr: false },
);

type dataProps = {
  id: number;
  categoryApiData: CategoryType[];
};

// 공지사항 입력값 타입 정의
interface FormData {
  title: string;
  categoryName: string;
  role: string;
}

// FAQ 수정 페이지
const FaqEdit = ({ id, categoryApiData }: dataProps) => {
  // ** State
  const [data, setData] = useState<FaqType>({
    boardId: 0,
    content: '',
    fileList: [],
    id: 0,
    categoryName: '',
    regDate: '',
    title: '',
    viewCnt: 0,
    writer: '',
  });
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

  const defaultValues = {
    title: '',
    categoryName: '',
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
    getFaqDetail(id);
  }, []);

  useEffect(() => {
    if (data.title !== '') {
      setValue('title', data.title);
      setValue('categoryName', data.categoryName);
    }
  }, [data]);

  // FAQ 상세조회 API 호출
  const getFaqDetail = async (id: number) => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/faq/${id}`, {
        data: { role },
      });

      const faqData = {
        boardId: res.data.faqId,
        title: res.data.faq.board.title,
        content: res.data.faq.board.content,
        categoryName: res.data.category.categoryName,
        regDate: getDateTime(res.data.faq.board.regDate),
        writer: res.data.writer,
        fileList: res.data.fileList,
      };
      console.log(faqData);
      setData(faqData);

      // 파일 정보 조회하여 Blob 형으로 재정의 처리
      const tempFiles = [];
      for (let index = 0; index < res.data.fileList.length; index++) {
        const file: {
          boardFileId: number;
          originalFileName: string;
          filePath: string;
        } = res.data.fileList[index];

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

    formData.append('role', '본사 관리자');
    formData.append('title', data.title);
    formData.append('content', htmlStr);
    formData.append('categoryName', data.categoryName);

    await editFaq(formData);
  };

  // FAQ 수정 API 호출
  const editFaq = async (formData: any) => {
    if (confirm('수정 하시겠습니까?')) {
      try {
        const req = await axios.patch(`${apiConfig.apiEndpoint}/faq/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('수정 성공', req);
        alert('수정이 완료되었습니다.');

        router.replace(`/faq/view/${id}`);
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
          <BoardLeftInHeader title={'자주 묻는 질문 수정'} />

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
                    <EditorControlled initStr={data.content!} setHtmlStr={setHtmlStr} />
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

export default FaqEdit;
