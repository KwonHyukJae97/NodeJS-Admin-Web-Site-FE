// ** React Imports
import { useEffect, useRef, useState } from 'react';

// ** Next Import
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Imports
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

// ** Custom Components Imports
import BoardLeftInHeader from '../BoardLeftInHeader';
import AttachedFileList from './AttachedFileList';
import BoardViewInfo from '../BoardViewInfo';

// ** Types Imports
import { role } from 'src/pages/notice/list';
import { NoticeType } from 'src/types/apps/boardTypes';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';

// props 타입 정의
interface NoticeViewProps {
  id: number;
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

// 공지사항 상세 페이지
const NoticeView = ({ id }: NoticeViewProps) => {
  // ** State
  const [data, setData] = useState<NoticeType>(initNotice),
    [htmlStr, setHtmlStr] = useState<string>('');

  // ** Ref
  const viewContentRef = useRef<HTMLDivElement>(null);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    getDetailNotice(id);
  }, [id]);

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
        // @ts-ignore
        await Api.delete(`${apiConfig.apiEndpoint}/notice/${id}`, {
          withCredentials: true,
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

  // 삭제 버튼 클릭 시 호출
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

          <BoardViewInfo
            isTop={data.isTop}
            title={data.title}
            regDate={data.regDate}
            writer={data.writer}
            htmlStr={htmlStr}
            viewContentRef={viewContentRef}
          />

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
                목록
              </Button>
            </Link>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default NoticeView;
