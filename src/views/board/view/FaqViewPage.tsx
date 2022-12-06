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
import { FaqType } from 'src/types/apps/boardTypes';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';

// props 타입 정의
interface FaqViewProps {
  id: number;
}

// FAQ 초기값 정의
const initFaq = {
  id: 0,
  boardId: 0,
  categoryName: '',
  title: '',
  content: '',
  fileList: [],
  writer: '',
  regDate: '',
  viewCnt: 0,
};

// FAQ 상세 페이지
const FaqView = ({ id }: FaqViewProps) => {
  // ** State
  const [data, setData] = useState<FaqType>(initFaq),
    [htmlStr, setHtmlStr] = useState<string>('');

  // ** Ref
  const viewContentRef = useRef<HTMLDivElement>(null);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    getDetailFaq(id);
  }, [id]);

  // FAQ 상세조회 API 호출
  const getDetailFaq = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/faq/${id}`, {
        data: { role },
        withCredentials: true,
      });

      const faqData = {
        boardId: res.data.faqId,
        categoryName: res.data.category.categoryName,
        title: res.data.faq.board.title,
        content: res.data.faq.board.content,
        writer: res.data.writer,
        fileList: res.data.fileList,
        regDate: getDateTime(res.data.faq.board.regDate),
      };

      console.log(faqData);
      setData(faqData);

      if (viewContentRef.current) {
        setHtmlStr((viewContentRef.current.innerHTML += res.data.faq.board.content));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // FAQ 삭제 API 호출
  const deleteFaq = async (id: number) => {
    if (confirm('삭제 하시겠습니까?')) {
      try {
        await Api.delete(`${apiConfig.apiEndpoint}/faq/${id}`, {
          withCredentials: true,
        });
        console.log('삭제 성공');
        alert('삭제가 완료되었습니다.');

        router.replace('/faq/list');
      } catch (err) {
        console.log(err);
        alert('삭제에 실패하였습니다.');
      }
    }
  };

  // 삭제 버튼 클릭 시 호출
  const handleDeleteFaq = (id: number) => {
    deleteFaq(id);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <BoardLeftInHeader
            title={'자주 묻는 질문'}
            maincategory={'고객센터'}
            subcategory={'자주 묻는 질문'}
          />

          <BoardViewInfo
            categoryName={data.categoryName}
            title={data.title}
            regDate={data.regDate}
            writer={data.writer}
            htmlStr={htmlStr}
            viewContentRef={viewContentRef}
          />

          {data.fileList.length !== 0 ? <AttachedFileList fileList={data.fileList} /> : null}

          <Box sx={{ ml: 14, mr: 14, mb: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href={`/faq/edit/${id}`} passHref>
              <Button variant="contained" sx={{ mr: 3 }}>
                수정
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="error"
              sx={{ mr: 3 }}
              onClick={() => handleDeleteFaq(id)}
            >
              삭제
            </Button>
            <Link href={'/faq/list'} passHref>
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

export default FaqView;
