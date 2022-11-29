// ** React Imports
import React, { useEffect, useState } from 'react';

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
import { CommentType, QnaType } from 'src/types/apps/boardTypes';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';
import { getDateTime } from 'src/pages/notice/list';
import CommentCard from './CommentCard';
import Typography from '@mui/material/Typography';

type dataProps = {
  id: number;
};

// QnA 상세 페이지
const QnaView = ({ id }: dataProps) => {
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
  const [comment, setComment] = useState<CommentType[]>([]);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    getQnaDetail(id);
  }, []);

  // QnA 상세조회 API 호출
  const getQnaDetail = async (id: number) => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/qna/${id}`);

      console.log('상세조회 응답', res.data);

      const qnaData = {
        boardId: res.data.qna.qnaId,
        title: res.data.qna.title,
        content: res.data.qna.content,
        isComment: res.data.qna.isComment,
        regDate: getDateTime(res.data.qna.regDate),
        writer: res.data.qna.writer,
        fileList: res.data.qna.fileList,
      };

      const commentData: CommentType[] =
        res.data.comment !== null
          ? res.data.comment.map((data: any) => {
              const comment: CommentType = {
                commentId: data.commentId,
                writer: data.writer,
                comment: data.comment,
                regDate: getDateTime(data.regDate),
                adminId: data.adminId,
              };

              return comment;
            })
          : null;

      console.log(qnaData);
      setData(qnaData);
      setComment(commentData);
    } catch (err) {
      console.log(err);
    }
  };

  // QnA 삭제 API 호출
  const deleteQna = async (id: number) => {
    if (confirm('삭제 하시겠습니까?')) {
      const accountId = 27;
      try {
        await axios.delete(`${apiConfig.apiEndpoint}/qna/${id}`, {
          params: { accountId },
        });
        console.log('삭제 성공');
        alert('삭제가 완료되었습니다.');

        router.replace('/qna/list');
      } catch (err) {
        console.log(err);
        alert('삭제에 실패하였습니다.');
      }
    }
  };

  const handleDeleteQna = (id: number) => {
    deleteQna(id);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <BoardLeftInHeader
            title={'나의 1:1 문의'}
            maincategory={'고객센터'}
            subcategory={'나의 1:1 문의'}
          />

          <BoardViewInfo
            title={data.title}
            regDate={data.regDate}
            writer={data.writer}
            htmlStr={data.content!}
          />

          {data.fileList.length !== 0 ? <AttachedFileList fileList={data.fileList} /> : null}

          <Box sx={{ ml: 14, mr: 14, mb: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href={`/qna/edit/${id}`} passHref>
              <Button variant="contained" sx={{ mr: 3 }}>
                수정
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="error"
              sx={{ mr: 3 }}
              onClick={() => handleDeleteQna(id)}
            >
              삭제
            </Button>
            <Link href={'/qna/list'} passHref>
              <Button variant="outlined" color="secondary">
                목록
              </Button>
            </Link>
          </Box>
        </Card>

        <CommentCard qnaId={data.boardId} commentData={comment} />
      </Grid>
    </Grid>
  );
};

export default QnaView;
