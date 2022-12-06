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
import TableSearchHeader from 'src/views/board/list/TableSearchHeader';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Types Imports
import { NoticeType } from 'src/types/apps/boardTypes';
import { PageType } from 'src/utils/pageType';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';

// 조회 권한과 역할에 대한 정보 임시 부여
export const role = '본사 관리자';
export const noticeGrant = '0|1|2';

// 테이블 행 데이터 타입 정의
interface CellType {
  row: NoticeType;
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
          {row.isTop === true ? (
            <CustomChip
              skin="light"
              size="small"
              label="중요"
              color="primary"
              sx={{ '& .MuiChip-label': { lineHeight: '18px' }, fontWeight: 600 }}
            />
          ) : (
            <Typography variant="body2">{row.id}</Typography>
          )}
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
        <Link href={`/notice/view/${row.boardId}`} passHref>
          <Typography variant="subtitle1" style={{ marginLeft: '20px' }}>
            {row.title}
          </Typography>
        </Link>
      );
    },
  },
  {
    flex: 0.04,
    minWidth: 60,
    headerName: '조회수',
    field: 'viewCnt',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.viewCnt}</Typography>
        </Box>
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
];

// 공지사항 목록 페이지
const NoticeList = ({
  apiData,
  pageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** State
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const noticeData: NoticeType[] =
    apiData !== null
      ? apiData.map((data: any, index: number) => {
          const notice: NoticeType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - index,
            boardId: data.noticeId,
            isTop: data.isTop,
            title: data.board.title,
            viewCnt: data.board.viewCount,
            regDate: getDateTime(data.board.regDate),
          };

          return notice;
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
            title={'본사용 공지사항'}
            subtitle={'TenPick의 이벤트 및 업데이트 정보 등 다양한 소식을 알려드립니다.'}
            maincategory={'게시판'}
            subcategory={'공지사항'}
            setPageNo={setPageNo}
            setSearchWord={setSearchWord}
            pageName="notice"
          />
          <TableSearchHeader
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            pageNo={pageNo}
            setPageNo={setPageNo}
            pageName="notice"
          />
          {noticeData !== null ? (
            <DataGrid
              autoHeight
              pagination
              rows={noticeData}
              columns={columns}
              disableSelectionOnClick
              components={{ Pagination: PaginationSimple }}
              componentsProps={{
                pagination: {
                  totalPage: pageData.totalPage,
                  pageNo: pageNo,
                  setPageNo: setPageNo,
                  pageName: 'notice',
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

// 공지사항 조회 API 호출
export const getAllNotice = async (pageNo: number, searchWord: string) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await Api.get(`${apiConfig.apiEndpoint}/notice`, {
      data: { role, noticeGrant, searchWord, pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log('ctx', context.query);
  const { pageNo, searchWord } = context.query;

  // 서버사이드 렌더링 시, 브라우저와는 별개로 직접 쿠키를 넣어 요청해야하기 때문에 해당 작업 반영 예정
  // 현재는 테스트를 위해 backend 단에서 @UseGuard 주석 처리 후, 진행
  const result = await getAllNotice(Number(pageNo), searchWord as string);

  const apiData: NoticeType = result === undefined ? null : result.items;
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

export default NoticeList;
