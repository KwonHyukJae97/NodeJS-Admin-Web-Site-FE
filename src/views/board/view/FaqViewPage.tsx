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
import AttachedFileList from '../AttachedFileList';

// ** Types Imports
import { getDateTime, role } from 'src/pages/notice/list';
import { FaqType } from 'src/types/apps/boardTypes';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';
import BoardViewInfo from '../BoardViewInfo';

type dataProps = {
  id: number;
};

// FAQ 상세 페이지
const FaqView = ({ id }: dataProps) => {
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
  const [htmlStr, setHtmlStr] = useState<string>('');

  // ** Ref
  const viewContentRef = useRef<HTMLDivElement>(null);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    getFaqDetail(id);
  }, []);

  // FAQ 상세조회 API 호출
  const getFaqDetail = async (id: number) => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/faq/${id}`, {
        data: { role },
      });

      console.log(res);

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
        await axios.delete(`${apiConfig.apiEndpoint}/faq/${id}`, {
          params: { role },
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
                취소
              </Button>
            </Link>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FaqView;
