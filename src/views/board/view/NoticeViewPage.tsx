// ** React Imports
import { useEffect, useRef, useState } from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';
import BoardLeftInHeader from '../BoardLeftInHeader';
import AttachedFileList from '../AttachedFileList';

// ** Types Imports
import { getDateTime, role } from 'src/pages/notice/list';
import apiConfig from 'src/configs/api';

// @ts-ignore
import { BoardType } from 'src/types/apps/userTypes';

// ** axios
import axios from 'axios';
import { useRouter } from 'next/router';

type dataProps = {
  id: number;
};

// 공지사항 상세 페이지
const NoticeView = ({ id }: dataProps) => {
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
  const [htmlStr, setHtmlStr] = useState<string>('');

  // ** Ref
  const viewContentRef = useRef<HTMLDivElement>(null);

  // ** Hooks
  const router = useRouter();
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

      if (viewContentRef.current) {
        setHtmlStr((viewContentRef.current.innerHTML += res.data.notice.board.content));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 공지사항 삭제 API 호출
  const deleteNotice = async (id: number) => {
    if (confirm('삭제 하시겠습니까?')) {
      try {
        await axios.delete(`${apiConfig.apiEndpoint}/notice/${id}`, {
          params: { role },
        });
        console.log('삭제 성공');
        alert('삭제가 완료되었습니다.');

        router.replace('/notice/list');
      } catch (err) {
        console.log(err);
        alert('삭제에 실패하였습니다.');
      }
    }
  };

  const handleDeleteNotice = (id: number) => {
    deleteNotice(id);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <BoardLeftInHeader
            title={'본사용 공지사항'}
            maincategory={'게시판'}
            subcategory={'공지사항'}
          />

          <Box sx={{ ml: 13, mt: 7, display: 'flex' }}>
            {data.isTop ? (
              <CustomChip
                skin="light"
                size="medium"
                label="중요"
                color="primary"
                sx={{
                  '& .MuiChip-label': { lineHeight: '18px' },
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  mr: 2.5,
                }}
              />
            ) : null}
            <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>
              {data.title}
            </Typography>
          </Box>

          <Box sx={{ ml: 14, mr: 14, mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {data.regDate}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              작성자ㅣ{data.writer}
            </Typography>
          </Box>

          <Divider sx={{ ml: 12, mr: 12, mt: 6, borderBottomWidth: 'unset' }} />

          <Box sx={{ ml: 14, mr: 14, mt: 8, mb: 8 }} ref={viewContentRef}>
            <Typography variant="subtitle2" style={{ color: 'black', fontWeight: 300 }}>
              {htmlStr}
            </Typography>
          </Box>

          {data.fileList.length !== 0 ? <AttachedFileList fileList={data.fileList} /> : null}

          <Box sx={{ ml: 14, mr: 14, mb: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href={`/notice/edit/${id}`} passHref>
              <Button variant="contained" sx={{ mr: 3 }}>
                수정
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="error"
              sx={{ mr: 3 }}
              onClick={() => handleDeleteNotice(id)}
            >
              삭제
            </Button>
            <Link href={'/notice/list'} passHref>
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

export default NoticeView;
