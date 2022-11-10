// ** React Imports
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// ** Next Import
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Imports
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
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
import { getDateTime, role } from '../../../pages/board/notice/list';
import { BoardType } from '../../../types/apps/userTypes';

// import EditorControlled from 'src/views/forms/form-elements/editor/EditorControlled';

const EditorControlled = dynamic(
  () => import('src/views/forms/form-elements/editor/EditorControlled'),
  { ssr: false },
);

type dataProps = {
  id: number;
  title: string;
  isTop: boolean;
};

// 공지사항 입력값 타입 정의
interface FormData {
  title: string;
  isTop: string;
  role: string;
  noticeGrant: string;
}

// 공지사항 수정 페이지
const NoticeEdit = ({ id, title, isTop }: dataProps) => {
  // ** State
  const [data, setData] = useState<BoardType>({
    boardId: 0,
    content: '',
    fileList: [],
    id: 0,
    isTop: false,
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
  });

  const defaultValues = {
    title: title,
    isTop: isTop,
  };

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

  useEffect(() => {
    getNoticeDetail(id);
  }, []);

  // 공지사항 상세조회 API 호출
  const getNoticeDetail = async (id: number) => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/notice/${id}`, {
        data: { role },
      });

      const noticeData = {
        boardId: res.data.notice.boardId,
        title: res.data.notice.board.title,
        content: res.data.notice.board.content,
        isTop: res.data.notice.isTop,
        regDate: getDateTime(res.data.notice.board.regDate),
        writer: res.data.writer,
        fileList: res.data.fileList,
      };
      console.log(noticeData);
      setData(noticeData);

      // @ts-ignore
      setHtmlStr(data.content);
    } catch (err) {
      console.log(err);
    }
  };

  console.log('data', htmlStr);
  console.log('data', htmlStr);

  // 수정 버튼 클릭 시, api 요청
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

  // 공지사항 수정 API 호출
  const registerNotice = async (formData: any) => {
    if (confirm('수정 하시겠습니까?')) {
      try {
        const req = await axios.patch(`${apiConfig.apiEndpoint}/notice/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('수정 성공', req);
        alert('수정이 완료되었습니다.');

        router.replace('/board/notice/list');
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
          <Box sx={{ mt: 10, ml: 14, display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              본사용 공지사항 수정
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
                수정
              </Button>
              <Link href="/board/notice/list" passHref>
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

export default NoticeEdit;
