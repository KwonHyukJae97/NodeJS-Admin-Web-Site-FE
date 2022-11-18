// ** React Imports
import React from 'react';

// ** Mui Imports
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AlertCircleOutline } from 'mdi-material-ui';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';
import { mdiSquareEditOutline } from '@mdi/js';
import Avatar from '@mui/material/Avatar';

// ** Types Imports
import { CommentType } from '../../../types/apps/boardTypes';

type CommentCardProps = {
  commentData: CommentType[];
};

// 답변 정보 UI 컴포넌트
const CommentCard = ({ commentData }: CommentCardProps) => {
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
  const inputComment = (
    <Box sx={{ mb: 6 }}>
      <TextField
        fullWidth
        multiline
        id="comment"
        placeholder="답변을 입력해주세요."
        sx={{ flex: 1 }}
        // defaultValue="답변을 입력해주세요."
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" sx={{ mt: 4 }}>
          등록
        </Button>
      </Box>
    </Box>
  );

  // 답변 입력 컴포넌트 - 입력값과 버튼 나란히 배치
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
      {commentData.length !== 0
        ? commentData.map((comment) => (
            <Card key={comment.commentId} sx={{ mb: 6 }}>
              {/* 프로필 이미지-작성자-작성일-수정버튼*/}
              <Box sx={{ display: 'flex', ml: 10, mr: 14, mt: 8, mb: 6 }}>
                <Box>
                  <Avatar
                    alt="Victor Anderson"
                    src="/demo/materialize-mui-react-nextjs-admin-template/demo-1/images/avatars/3.png"
                    sx={{ width: 42, height: 42, mr: 6 }}
                  />
                </Box>

                <Box sx={{ backgroundColor: 'orange', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'red',
                      mt: 1,
                    }}
                  >
                    <Box sx={{ backgroundColor: 'skyblue', display: 'flex' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {comment.writer}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ pl: 5 }}>
                        {comment.regDate}
                      </Typography>
                    </Box>

                    {/*<Box sx={{ backgroundColor: 'green' }}>*/}
                    {/*  <Button sx={{ minWidth: 0, p: 1.25 }}>*/}
                    {/*    <Icon*/}
                    {/*      path={mdiSquareEditOutline}*/}
                    {/*      size={1}*/}
                    {/*      horizontal*/}
                    {/*      vertical*/}
                    {/*      rotate={90}*/}
                    {/*      color="grey"*/}
                    {/*    />*/}
                    {/*  </Button>*/}
                    {/*</Box>*/}
                  </Box>
                  <Typography variant="subtitle1" sx={{ backgroundColor: 'grey', pt: 3, pb: 5 }}>
                    {comment.comment}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))
        : renderNoComment}
    </>
  );
};

export default CommentCard;
