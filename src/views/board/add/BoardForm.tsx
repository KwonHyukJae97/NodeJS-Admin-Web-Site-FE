import React, { useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import apiConfig from '../../../configs/api';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import { EditorWrapper } from '../../../@core/styles/libs/react-draft-wysiwyg';
import DropzoneWrapper from '../../../@core/styles/libs/react-dropzone';
import FileUploaderMultiple from '../../forms/form-elements/file-uploader/FileUploaderMultiple';
import Button from '@mui/material/Button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// import EditorControlled from 'src/views/forms/form-elements/editor/EditorControlled';

const EditorControlled = dynamic(
  () => import('src/views/forms/form-elements/editor/EditorControlled'),
  { ssr: false },
);

// 공지사항 입력값 타입 정의
interface FormData {
  title: string;
  isTop: string;
  role: string;
  noticeGrant: string;
}

const defaultValues = {
  title: '',
  isTop: false,
};

const BoardForm = () => {
  // ** State
  const [files, setFiles] = useState<File[]>([]);
  const [htmlStr, setHtmlStr] = useState<string>('');

  // ** Vars
  const schema = yup.object().shape({
    title: yup.string().required(),
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
    const formData = new FormData();

    if (files.length !== 0) {
      files.map((file) => {
        formData.append('files', file);
      });
    }

    formData.append('role', '본사 관리자');
    formData.append('noticeGrant', '0|1|2');
    formData.append('title', data.title);
    formData.append('content', htmlStr);
    formData.append('isTop', data.isTop);

    await registerNotice(formData);
  };

  // 공지사항 등록 API 호출
  const registerNotice = async (formData: any) => {
    if (confirm('등록 하시겠습니까?')) {
      try {
        const req = await axios.post(`${apiConfig.apiEndpoint}/notice`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('등록 성공', req);
        alert('등록이 완료되었습니다.');

        router.replace('/board/notice/list');
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
              본사용 공지사항 등록
            </Typography>
          </Box>

          <Divider sx={{ ml: 12, mr: 12, borderBottomWidth: 'unset' }} />

          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ ml: 14, mr: 14, mt: 6 }}>
              <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
                상단 고정 여부
              </Typography>
              <FormControl sx={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                <Controller
                  name="isTop"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      row
                      value={value}
                      name="sizes"
                      defaultValue="small"
                      onChange={onChange}
                      aria-label="simple-radio"
                      sx={{
                        '& .MuiFormControlLabel-label': { fontSize: '0.95rem', fontWeight: 500 },
                      }}
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio size="small" />}
                        label="사용"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio size="small" />}
                        label="미사용"
                      />
                    </RadioGroup>
                  )}
                />
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
                    <EditorControlled htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
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
              <Link href="/notice/list" passHref>
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

export default BoardForm;
