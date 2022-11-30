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

// ** Types Imports
import { BoardType } from 'src/types/apps/userTypes';
import { QnaType } from 'src/types/apps/boardTypes';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';

// 페이지 타입 정의
interface PageType {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}

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
    flex: 0.4,
    minWidth: 200,
    field: 'title',
    headerName: '제목',
    renderCell: ({ row }: CellType) => {
      return (
        <Link href={`/qna/view/${row.boardId}`} passHref>
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
    flex: 0.1,
    minWidth: 60,
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
  const [pageNo, setPageNo] = useState<number>(1);

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const qnaData: QnaType[] =
    apiData !== null
      ? apiData.map((data: any, idx: number) => {
          const qna: QnaType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - idx,
            boardId: data.qnaId,
            isComment: data.isComment,
            title: data.title,
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
      <Typography variant="h6">해당 검색에 대한 게시글이 없습니다.</Typography>
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
            pageName="qna/comment"
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
                  pageName: 'qna/comment',
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
export const getComment = async (pageNo: number) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/comment`, {
      data: { pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log('ctx', context.query);
  const { pageNo } = context.query;

  // 서버사이드 렌더링 시, 브라우저와는 별개로 직접 쿠키를 넣어 요청해야하기 때문에 해당 작업 반영 예정
  // 현재는 테스트를 위해 backend 단에서 @UseGuard 주석 처리 후, 진행
  const result = await getComment(Number(pageNo));

  console.log('result', result);

  const apiData: BoardType = result === undefined ? null : result.items;
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
