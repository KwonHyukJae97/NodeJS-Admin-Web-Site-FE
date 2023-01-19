// ** React Imports
import React, { useEffect, useState } from 'react';

// ** Next Import
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

// props 타입 정의
interface CommentViewProps {
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

// Comment 상세 페이지
const CommentView = ({ id }: CommentViewProps) => {
  // ** State
  const [data, setData] = useState<QnaType>(initQna),
    [comment, setComment] = useState<CommentType[]>([]);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    getDetailComment(id);
  }, [id]);

  // QnA 상세조회 API 호출
  const getDetailComment = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/comment/${id}`);

      console.log('comment res', res);

      const qnaData = {
        boardId: res.data.qna.qnaId,
        title: res.data.qna.title,
        content: res.data.qna.content,
        writer: res.data.qna.writer,
        fileList: res.data.qna.fileList,
        regDate: getDateTime(res.data.qna.regDate),
      };

      const commentData: CommentType[] =
        res.data.commentList !== null
          ? res.data.commentList.map((data: any) => {
              const comment: CommentType = {
                commentId: data.commentId,
                adminId: data.adminId,
                comment: data.comment,
                commenter: data.commenter,
                regDate: getDateTime(data.regDate),
              };

              return comment;
            })
          : null;

      console.log(commentData);
      setData(qnaData);
      setComment(commentData);
    } catch (err) {
      console.log(err);
    }
  };

  // QnA 삭제 API 호출
  // const deleteQna = async (id: number) => {
  //   if (confirm('삭제 하시겠습니까?')) {
  //     try {
  //       await Api.delete(`${apiConfig.apiEndpoint}/qna/${id}`);
  //       console.log('삭제 성공');
  //       alert('삭제가 완료되었습니다.');
  //
  //       router.replace('/qna/list');
  //     } catch (err) {
  //       console.log(err);
  //       alert('삭제에 실패하였습니다.');
  //     }
  //   }
  // };

  // 삭제 버튼 클릭 시 호출
  // const handleDeleteQna = (id: number) => {
  //   deleteQna(id);
  // };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <BoardLeftInHeader
            title={'문의내역 관리'}
            maincategory={'고객센터'}
            subcategory={'문의내역 관리'}
          />

          <BoardViewInfo
            title={data.title}
            regDate={data.regDate}
            writer={data.writer}
            htmlStr={data.content!}
          />

          {data.fileList.length !== 0 ? <AttachedFileList fileList={data.fileList} /> : null}

          <Box sx={{ ml: 14, mr: 14, mb: 10, display: 'flex', justifyContent: 'flex-end' }}>
            {/*<Link href={`/qna/edit/${id}`} passHref>*/}
            {/*  <Button variant="contained" sx={{ mr: 3 }}>*/}
            {/*    수정*/}
            {/*  </Button>*/}
            {/*</Link>*/}
            {/*<Button*/}
            {/*  variant="outlined"*/}
            {/*  color="error"*/}
            {/*  sx={{ mr: 3 }}*/}
            {/*  onClick={() => handleDeleteQna(id)}*/}
            {/*>*/}
            {/*  삭제*/}
            {/*</Button>*/}
            {/*<Link href={'/qna/list'} passHref>*/}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                router.back();
              }}
            >
              목록
            </Button>
            {/*</Link>*/}
          </Box>
        </Card>

        <CommentCard qnaId={data.boardId} commentData={comment} />
      </Grid>
    </Grid>
  );
};

export default CommentView;
