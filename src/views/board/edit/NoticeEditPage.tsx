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

// ** Custom Components Imports
import BoardLeftInHeader from '../BoardLeftInHeader';

// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// ** Types Imports
import { role } from 'src/pages/notice/list';
import { NoticeType } from 'src/types/apps/boardTypes';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';

// import EditorControlled from 'src/views/forms/form-elements/editor/EditorControlled';
const EditorControlled = dynamic(
  () => import('src/views/forms/form-elements/editor/EditorControlled'),
  { ssr: false },
);

// input 초기값
const defaultValues = {
  title: '',
  isTop: false,
};

// props 타입 정의
interface NoticeEditProps {
  id: number;
}

// 공지사항 입력값 타입 정의
interface NoticeInputData {
  title: string;
  isTop: string;
  role: string;
  noticeGrant: string;
}

// 공지사항 초기값 정의
const initNotice = {
  id: 0,
  boardId: 0,
  isTop: false,
  title: '',
  content: '',
  fileList: [],
  writer: '',
  regDate: '',
  viewCnt: 0,
};

// 공지사항 수정 페이지
const NoticeEdit = ({ id }: NoticeEditProps) => {
  // ** State
  const [data, setData] = useState<NoticeType>(initNotice),
    [files, setFiles] = useState<File[]>([]),
    [htmlStr, setHtmlStr] = useState<string>('');

  // ** Vars
  const schema = yup.object().shape({
    title: yup.string().required(),
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
    getDetailNotice(id);
  }, [id]);

  useEffect(() => {
    if (data.title !== '') {
      setValue('title', data.title);
      setValue('isTop', data.isTop);

      // htmlStr에 대한 상태변화가 없을경우, content 수정 없이 patch 요청 시 null 값으로 할당됨
      setHtmlStr(data.content!);
    }
  }, [data, setValue]);

  // 공지사항 상세조회 API 호출
  const getDetailNotice = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/notice/${id}`, {
        data: { role },
      });

      const noticeData = {
        boardId: res.data.notice.boardId,
        isTop: res.data.notice.isTop,
        title: res.data.notice.board.title,
        content: res.data.notice.board.content,
        writer: res.data.writer,
        fileList: res.data.fileList,
        regDate: getDateTime(res.data.notice.board.regDate),
      };
      console.log(noticeData);
      setData(noticeData);

      // 파일 정보 조회하여 Blob 형으로 재정의 처리
      const tempFiles = [];
      for (let index = 0; index < res.data.fileList.length; index++) {
        const file: {
          boardFileId: number;
          originalFileName: string;
          filePath: string;
        } = res.data.fileList[index];

        const fileResult = await Api.get(`${apiConfig.apiEndpoint}/file/${file.boardFileId}`, {
          responseType: 'blob',
        });

        tempFiles.push(new File([fileResult.data], file.originalFileName));
      }

      setFiles(tempFiles);
    } catch (err) {
      console.log(err);
    }
  };

  // 수정 버튼 클릭 시 호출
  const onSubmit = async (data: NoticeInputData) => {
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

    await updateNotice(formData);
  };

  // 공지사항 수정 API 호출
  const updateNotice = async (formData: any) => {
    if (confirm('수정 하시겠습니까?')) {
      try {
        const req = await Api.patch(`${apiConfig.apiEndpoint}/notice/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('수정 성공', req);
        alert('수정이 완료되었습니다.');

        router.replace(`/notice/view/${id}`);
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
          <BoardLeftInHeader title={'본사용 공지사항 수정'} />

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

export default NoticeEdit;
