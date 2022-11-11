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
import { FileDownloadOutline } from 'mdi-material-ui';

// ** Custom Components Imports

// ** Types Imports
import { getDateTime, role } from '../../../pages/board/notice/list';
import apiConfig from '../../../configs/api';

// ** axios
import axios from 'axios';

import { useRouter } from 'next/router';
import { FaqType } from '../../../types/apps/boardTypes';

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

  // 파일 다운로드 API 호출
  const getFileDownload = (fileId: number) => {
    try {
      axios
        .get(`${apiConfig.apiEndpoint}/file/${fileId}`, {
          responseType: 'blob',
        })
        .then((res) => {
          // 다운로드(서버에서 전달 받은 데이터) 받은 바이너리 데이터를 blob으로 변환
          const blob = new Blob([res.data]);

          // blob을 사용해 객체 URL을 생성
          const fileObjectUrl = window.URL.createObjectURL(blob);

          // blob 객체 URL을 설정
          const link = document.createElement('a');
          link.href = fileObjectUrl;
          link.style.display = 'none';

          // 다운로드 파일 이름을 추출하는 함수
          const extractDownloadFilename = (res: any) => {
            const disposition = res.headers['content-disposition'];
            const fileName = decodeURI(
              disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]/g, ''),
            );

            return fileName;
          };

          // 다운로드 파일 이름 지정
          // 일반적으로 서버에서 전달해준 파일 이름은 응답 Header의 Content-Disposition에 설정
          link.download = extractDownloadFilename(res);

          // 링크를 body에 추가하고 강제로 click 이벤트를 발생시켜 파일 다운로드를 실행
          document.body.appendChild(link);
          link.click();
          link.remove();

          // 다운로드가 끝난 리소스(객체 URL)를 해제
          window.URL.revokeObjectURL(fileObjectUrl);
        })
        .catch((err) => {
          console.error('err: ', err);
        });
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

        router.replace('/board/faq/list');
      } catch (err) {
        console.log(err);
        alert('삭제에 실패하였습니다.');
      }
    }
  };

  const handleFileDownload = (fileId: number) => {
    getFileDownload(fileId);
  };

  const handleDeleteFaq = (id: number) => {
    deleteFaq(id);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ mt: 10, ml: 14, display: 'flex', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                자주 묻는 질문
              </Typography>
            </Box>
            <Divider sx={{ ml: 3, mr: 3, borderLeftWidth: 'unset', height: 16 }} />
            <Box sx={{ display: 'flex' }}>
              <Typography variant="body2">고객센터</Typography>
              <Box sx={{ ml: 1.2, mr: 1.2 }}>
                <Typography variant="body2">{'>'}</Typography>
              </Box>
              <Typography variant="body2">자주 묻는 질문</Typography>
            </Box>
          </Box>

          <Divider sx={{ ml: 12, mr: 12, borderBottomWidth: 'unset' }} />

          <Box sx={{ ml: 13, mt: 7, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex' }}>
              <Divider sx={{ borderLeftWidth: 'medium', mt: 1, mb: 1 }} />
              <Box sx={{ mr: 3.5, ml: 3.5 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  {data.categoryName}
                </Typography>
              </Box>
              <Divider sx={{ borderRightWidth: 'medium', mr: 2.5, mt: 1, mb: 1 }} />
            </Box>
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

          <Box sx={{ ml: 14, mr: 14, mt: 8, mb: 10 }} ref={viewContentRef}>
            <Typography variant="subtitle2" style={{ color: 'black', fontWeight: 300 }}>
              {htmlStr}
            </Typography>
          </Box>

          {data.fileList.length !== 0 ? (
            <>
              <Divider sx={{ ml: 12, mr: 12, mt: 6, mb: 6, borderBottomWidth: 'unset' }} />
              <Box sx={{ ml: 14, mr: 14, mt: 4, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  첨부파일
                </Typography>
              </Box>
              {data.fileList.map((file: any) => {
                return (
                  <Box
                    key={file.boardFileId}
                    sx={{ ml: 14, mr: 14, mt: 2, mb: 2, display: 'flex' }}
                    onClick={() => handleFileDownload(file.boardFileId)}
                  >
                    <FileDownloadOutline sx={{ height: '1.25rem' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, ml: 0.5 }}>
                      {file.originalFileName}
                      {file.fileExt}
                    </Typography>
                  </Box>
                );
              })}
              <Divider sx={{ ml: 12, mr: 12, mt: 6, mb: 10, borderBottomWidth: 'unset' }} />{' '}
            </>
          ) : null}

          <Box sx={{ ml: 14, mr: 14, mb: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href={`/board/faq/edit/${id}`} passHref>
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
            <Link href={'/board/faq/list'} passHref>
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
