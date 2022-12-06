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
import CommentCard from './CommentCard';

// ** Types Imports
import { CommentType, QnaType } from 'src/types/apps/boardTypes';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';
import { role } from '../../../pages/notice/list';

// props 타입 정의
interface QnaViewProps {
  id: number;
}

// Qna 초기값 정의
const initQna = {
  id: 0,
  boardId: 0,
  title: '',
  content: '',
  fileList: [],
  isComment: false,
  writer: '',
  regDate: '',
  viewCnt: 0,
};

// QnA 상세 페이지
const QnaView = ({ id }: QnaViewProps) => {
  // ** State
  const [data, setData] = useState<QnaType>(initQna),
    [comment, setComment] = useState<CommentType[]>([]);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    getDetailQna(id);
  }, [id]);

  // QnA 상세조회 API 호출
  const getDetailQna = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/qna/${id}`, { withCredentials: true });

      const qnaData = {
        boardId: res.data.qna.qnaId,
        title: res.data.qna.title,
        content: res.data.qna.content,
        isComment: res.data.qna.isComment,
        writer: res.data.qna.writer,
        fileList: res.data.qna.fileList,
        regDate: getDateTime(res.data.qna.regDate),
      };

      const commentData: CommentType[] =
        res.data.comment !== null
          ? res.data.comment.map((data: any) => {
              const comment: CommentType = {
                commentId: data.commentId,
                adminId: data.adminId,
                comment: data.comment,
                writer: data.writer,
                regDate: getDateTime(data.regDate),
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
      try {
        await Api.delete(`${apiConfig.apiEndpoint}/qna/${id}`, {
          withCredentials: true,
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

  // 삭제 버튼 클릭 시 호출
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
