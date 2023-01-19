// ** React Imports
import { useState } from 'react';

// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { AlertCircleOutline } from 'mdi-material-ui';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';
import PageLeftInHeader from 'src/@core/components/page-left-in-header';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';
import TableSearchHeaderToggle from 'src/views/board/list/TableSearchHeaderToggle';

// ** Types Imports
import { QnaType } from 'src/types/apps/boardTypes';
import { PageType } from 'src/utils/pageType';

// ** axios
import { ApiSSR } from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';

// 테이블 행 데이터 타입 정의
interface CellType {
  row: QnaType;
}

// 테이블 컬럼 데이터 맵핑
const columns = [
  {
    flex: 0.06,
    minWidth: 60,
    field: 'id',
    headerName: '번호',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">{row.id}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.25,
    minWidth: 250,
    field: 'title',
    headerName: '제목',
    renderCell: ({ row }: CellType) => {
      return (
        <Link href={`/comment/view/${row.boardId}`} passHref>
          <Typography variant="subtitle1" style={{ marginLeft: '40px' }}>
            {row.title}
          </Typography>
        </Link>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '작성자',
    field: 'writer',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.writer}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '답변자',
    field: 'commenter',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.commenter}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.06,
    minWidth: 60,
    headerName: '등록일',
    field: 'regDate',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.regDate}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.07,
    minWidth: 70,
    headerName: '상태',
    field: 'isComment',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          {row.isComment ? (
            <CustomChip
              skin="light"
              size="medium"
              label="답변완료"
              color="primary"
              sx={{ '& .MuiChip-label': { lineHeight: '18px' }, fontWeight: 600 }}
            />
          ) : (
            <CustomChip
              skin="light"
              size="medium"
              label="답변대기"
              color="secondary"
              sx={{ '& .MuiChip-label': { lineHeight: '18px' }, fontWeight: 600 }}
            />
          )}
        </Box>
      );
    },
  },
];

// QnA 관리자 목록 페이지 (답변내역)
const QnaCommentList = ({
  apiData,
  pageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** State
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>(''),
    [searchKey, setSearchKey] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const qnaData: QnaType[] =
    apiData !== null
      ? apiData.map((data: any, idx: number) => {
          const qna: QnaType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - idx,
            boardId: data.qnaId,
            title: data.title,
            isComment: data.isComment,
            writer: data.writerName + '(' + data.writerNickname + ')',
            commenter: data.isComment
              ? data.commenterName + '(' + data.commenterNickname + ')'
              : null,
            viewCnt: data.viewCount,
            regDate: getDateTime(data.regDate),
          };

          return qna;
        })
      : null;

  // 게시글이 없을 경우 처리하는 컴포넌트
  const renderNoResult = (
    <Box
      sx={{
        p: 10,
        m: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AlertCircleOutline sx={{ mr: 2 }} />
      <Typography variant="h6">관련 게시글이 없습니다.</Typography>
    </Box>
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'문의내역 관리'}
            maincategory={'고객센터'}
            subcategory={'문의내역 관리'}
            setPageNo={setPageNo}
            setSearchKey={setSearchKey}
            setSearchWord={setSearchWord}
            pageName="comment"
          />

          <TableSearchHeaderToggle
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            pageNo={pageNo}
            setPageNo={setPageNo}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            pageName="comment"
          />

          {qnaData !== null ? (
            <DataGrid
              autoHeight
              pagination
              rows={qnaData}
              columns={columns}
              disableSelectionOnClick
              components={{ Pagination: PaginationSimple }}
              componentsProps={{
                pagination: {
                  totalPage: pageData.totalPage,
                  pageNo: pageNo,
                  setPageNo: setPageNo,
                  pageName: 'comment',
                },
              }}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          ) : (
            renderNoResult
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

// QnA-Comment 조회 API 호출
export const getAllComment = async (pageNo: number, searchKey: string, searchWord: string) => {
  const page = pageNo == null ? 1 : pageNo;

  try {
    const res = await ApiSSR.get(`${apiConfig.apiEndpoint}/comment`, {
      data: { searchKey, searchWord, pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNo, searchKey, searchWord } = context.query;

  const result = await getAllComment(Number(pageNo), searchKey as string, searchWord as string);

  const apiData: QnaType = result === undefined ? null : result.items;
  const pageData: PageType =
    result === undefined
      ? {
          currentPage: 1,
          pageSize: 1,
          totalCount: 0,
          totalPage: 1,
        }
      : {
          currentPage: result.currentPage,
          pageSize: result.pageSize,
          totalCount: result.totalCount,
          totalPage: result.totalPage,
        };

  return {
    props: {
      apiData,
      pageData,
    },
  };
};

export default QnaCommentList;
