// ** React Imports
import { ChangeEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// ** Next Import
import Link from 'next/link';

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

// ** Custom Components Imports
// ** Styled Component Import

// ** Demo Components Imports
import FileUploaderMultiple from '../../../../views/forms/form-elements/file-uploader/FileUploaderMultiple';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import Button from '@mui/material/Button';
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';
import EditorControlled from '../../../../views/forms/form-elements/editor/EditorControlled';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormHelperText from '@mui/material/FormHelperText';

// ** Types Imports

// ** axios

// 공지사항 입력값 타입 정의
interface FormData {
  title: string;
  content: string;
  isTop: string;
}

const defaultValues = {
  title: '',
  content: '',
};

// 공지사항 등록 페이지
const NoticeAdd = () => {
  // ** State
  // const [value, setValue] = useState<string>('checked');
  const [isTopStatus, setIsTopStatus] = useState<boolean>(true);

  // const [data, setData] = useState<BoardType[] | null>(null);
  // const [pageSize, setPageSize] = useState<number>(10);
  // const [searchKeyword, setSearchKeyword] = useState<string>('');
  // const [searchAction, setSearchAction] = useState<string>('');

  // ** Vars
  const schema = yup.object().shape({
    title: yup.string().required(),
    content: yup.string().required(),
  });

  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // 라디오 버튼 클릭 시, 상태 변화
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTopStatus(event.target.value);

    // setValue((event.target as HTMLInputElement).value);
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

          <Box sx={{ ml: 14, mr: 14, mt: 6 }}>
            <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
              상단 고정 여부
            </Typography>
            <FormControl sx={{ flexWrap: 'wrap', flexDirection: 'row' }}>
              <RadioGroup
                row
                value={isTopStatus}
                name="sizes"
                defaultValue="small"
                onChange={handleChange}
                aria-label="simple-radio"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem', fontWeight: 500 } }}
              >
                <FormControlLabel value={true} control={<Radio size="small" />} label="사용" />
                <FormControlLabel value={false} control={<Radio size="small" />} label="미사용" />
              </RadioGroup>
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

            {/* 임시용 */}
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
                    placeholder="내용을 입력해주세요."
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

            {/*<EditorWrapper>*/}
            {/*  <Grid container spacing={6} className="match-height">*/}
            {/*    <Grid item xs={12}>*/}
            {/*      <EditorControlled />*/}
            {/*    </Grid>*/}
            {/*  </Grid>*/}
            {/*</EditorWrapper>*/}
          </Box>

          <Box sx={{ ml: 14, mr: 14, mt: 4, mb: 10 }}>
            <Typography variant="subtitle2" sx={{ ml: 0.5, mb: 2 }}>
              첨부파일
            </Typography>
            <DropzoneWrapper>
              <FileUploaderMultiple />
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
            <Button variant="contained" sx={{ mr: 3 }}>
              등록
            </Button>
            <Link href="/board/notice/list" passHref>
              <Button variant="outlined" color="secondary">
                취소
              </Button>
            </Link>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default NoticeAdd;
