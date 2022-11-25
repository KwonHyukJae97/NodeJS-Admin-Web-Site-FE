// ** React Imports
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// ** Mui Imports
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AlertCircleOutline } from 'mdi-material-ui';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import { mdiSquareEditOutline } from '@mdi/js';
import Icon from '@mdi/react';

// ** Types Imports
import { CommentType } from 'src/types/apps/boardTypes';

// ** axios Imports
import apiConfig from 'src/configs/api';
import axios from 'axios';

type CommentCardProps = {
  qnaId: number;
  commentData: CommentType[];
};

// Comment 입력값 타입 정의
interface FormData {
  commentId: number;
  comment: string;
  newComment: string;
}

const defaultValues = {
  commentId: 0,
  comment: '',
  newComment: '',
};

type EditState = {
  commentId: number;
  isEdit: boolean;
};

// 답변 정보 UI 컴포넌트
const CommentCard = ({ qnaId, commentData }: CommentCardProps) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    mode: 'onBlur',
  });

  const [editState, setEditState] = useState<EditState>({ commentId: 0, isEdit: false });

  // 등록 버튼 클릭 시, api 요청
  const onSubmit = async (data: FormData) => {
    await registerComment(data, qnaId);
  };

  // 수정 버튼 클릭 시, api 요청
  const onEdit = async (data: FormData) => {
    await editComment(data);
  };

  // Comment 등록 API 호출
  const registerComment = async (data: FormData, qnaId: number) => {
    if (confirm('등록 하시겠습니까?')) {
      try {
        const req = await axios.post(`${apiConfig.apiEndpoint}/comment/${qnaId}`, {
          comment: data.comment,
        });
        console.log('등록 성공', req);
        alert('등록이 완료되었습니다.');
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert('등록에 실패하였습니다.');
      }
    }
  };

  // Comment 수정 API 호출
  const editComment = async (data: FormData) => {
    console.log('data', data.newComment);
    if (confirm('수정 하시겠습니까?')) {
      try {
        const req = await axios.patch(`${apiConfig.apiEndpoint}/comment/${data.commentId}`, {
          comment: data.newComment,
        });
        console.log('수정 성공', req);
        alert('수정이 완료되었습니다.');
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert('수정에 실패하였습니다.');
      }
    }
  };

  // 수정 아이콘 클릭 시 실행
  const handleEditComment = (commentId: number, comment: string) => {
    setEditState({ commentId: commentId, isEdit: true });
    setValue('newComment', comment);
    setValue('commentId', commentId);
  };

  // 취소 버튼 클릭 시 실행
  const handleCancelComment = () => {
    setEditState({ commentId: 0, isEdit: false });
  };

  // 답변이 없을 경우 처리하는 컴포넌트
  const renderNoComment = (
    <Card>
      <Box
        sx={{
          p: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AlertCircleOutline sx={{ mr: 2 }} />
        <Typography variant="subtitle1">등록된 답변이 없습니다.</Typography>
      </Box>
    </Card>
  );

  // 답변 입력 컴포넌트
  const inputCommentForm = (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mb: 6 }}>
        <FormControl fullWidth>
          <Controller
            name="comment"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                id="comment"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder="답변을 입력해주세요."
                multiline
                type="text"
                sx={{ flex: 1, whiteSpace: 'pre-wrap' }}
              />
            )}
          />
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="large" sx={{ mt: 4 }} type="submit">
            등록
          </Button>
        </Box>
      </Box>
    </form>
  );

  // 답변 수정 컴포넌트
  const editCommentForm = (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onEdit)}>
      <Box sx={{ mb: 6 }} id="dd">
        <FormControl fullWidth>
          <Controller
            name="newComment"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                id="newComment"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                multiline
                type="text"
                sx={{ flex: 1 }}
              />
            )}
          />
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="medium" sx={{ mt: 4, mr: 2 }} type="submit">
            수정
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            sx={{ mt: 4 }}
            type="submit"
            onClick={handleCancelComment}
          >
            취소
          </Button>
        </Box>
      </Box>
    </form>
  );

  // 답변 입력 컴포넌트 - 입력값과 버튼 나란히 배치한 버전
  // const inputComment = (
  //   <Box sx={{ mb: 6, display: 'flex' }}>
  //     <TextField
  //       fullWidth
  //       multiline
  //       id="comment"
  //       placeholder="답변을 입력해주세요."
  //       sx={{ flex: 1 }}
  //       // defaultValue="답변을 입력해주세요."
  //     />
  //     <Button variant="contained" size="large" sx={{ ml: 4, padding: '0.75rem 1.25rem' }}>
  //       등록
  //     </Button>
  //   </Box>
  // );

  return (
    <>
      {inputCommentForm}
      {commentData.length !== 0
        ? commentData.map((comment) => (
            <Card key={comment.commentId} sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', ml: 12, mr: 12, mt: 8, mb: 5 }}>
                <Box>
                  <Avatar
                    alt="Victor Anderson"
                    src="/demo/materialize-mui-react-nextjs-admin-template/demo-1/images/avatars/3.png"
                    sx={{ width: 42, height: 42, mr: 4 }}
                  />
                </Box>

                <Box
                  sx={{
                    // backgroundColor: 'orange',
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1,
                      // backgroundColor: 'red',
                    }}
                  >
                    <Box
                      sx={{
                        // backgroundColor: 'skyblue',
                        display: 'flex',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {comment.writer}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ pl: 5 }}>
                        {comment.regDate}
                      </Typography>
                    </Box>

                    {comment.commentId == editState.commentId && editState.isEdit ? null : (
                      <Box>
                        <Button
                          sx={{ minWidth: 0, p: 1.25 }}
                          onClick={() => handleEditComment(comment.commentId, comment.comment)}
                        >
                          <Icon
                            path={mdiSquareEditOutline}
                            size={1}
                            horizontal
                            vertical
                            rotate={90}
                            color="grey"
                          />
                        </Button>
                      </Box>
                    )}
                  </Box>
                  {comment.commentId == editState.commentId && editState.isEdit ? (
                    editCommentForm
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{
                        // backgroundColor: 'grey',
                        pt: 2,
                        pb: 5,
                      }}
                    >
                      {comment.comment}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Card>
          ))
        : renderNoComment}
    </>
  );
};

export default CommentCard;
