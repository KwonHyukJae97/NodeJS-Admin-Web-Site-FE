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
import Divider from '@mui/material/Divider';

// ** Custom Components Imports
import PageLeftInHeader from 'src/@core/components/page-left-in-header';
import TableSearchHeader from 'src/views/board/list/TableSearchHeader';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';
import TabsCustomButton from 'src/views/board/list/TabsCustomButton';

// ** Types Imports
import { CategoryType, FaqType } from 'src/types/apps/boardTypes';
import { PageType } from 'src/utils/pageType';

// ** axios
import { ApiSSR } from 'src/utils/api';
import apiConfig from 'src/configs/api';
import axios from 'axios';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';

// 테이블 행 데이터 타입 정의
interface CellType {
  row: FaqType;
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
    flex: 0.06,
    minWidth: 80,
    field: 'categoryName',
    headerName: '분류',
    renderCell: ({ row }: CellType) => {
      return (
        <Box
          sx={{
            margin: '0 auto',
            display: 'flex',
            minWidth: 80,
            justifyContent: 'space-between',
          }}
        >
          <Divider sx={{ borderLeftWidth: 'unset', mt: 0, mb: 0 }} />
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: '700' }}>
            {row.categoryName}
          </Typography>
          <Divider sx={{ borderRightWidth: 'unset', mt: 0, mb: 0 }} />
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
        <Link href={`/faq/view/${row.boardId}`} passHref>
          <Typography variant="subtitle1" style={{ marginLeft: '24px' }}>
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

// FAQ 목록 페이지
const FaqList = ({
  apiData,
  pageData,
  categoryApiData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** State
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>(''),
    [searchKey, setSearchKey] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const faqData: FaqType[] =
    apiData !== null
      ? apiData.map((data: any, idx: number) => {
          const faq: FaqType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - idx,
            boardId: data.faqId,
            categoryId: data.category.categoryId,
            categoryName: data.category.categoryName,
            isUse: data.category.isUse,
            title: data.board.title,
            viewCnt: data.board.viewCount,
            regDate: getDateTime(data.board.regDate),
          };

          return faq;
        })
      : null;

  const categoryData: CategoryType[] =
    categoryApiData !== null
      ? categoryApiData.map((data: any) => {
          const category: CategoryType = {
            categoryId: data.categoryId,
            categoryName: data.categoryName,
            isUse: data.isUse,
          };

          return category;
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
            title={'자주 묻는 질문'}
            subtitle={
              '자주 묻는 질문을 찾아보세요. 찾으시는 내용이 없으면 1:1 문의를 이용해 주세요.'
            }
            maincategory={'고객센터'}
            subcategory={'자주 묻는 질문'}
            setPageNo={setPageNo}
            setSearchWord={setSearchWord}
            pageName="faq"
            setSearchKey={setSearchKey}
          />
          <TabsCustomButton
            categoryList={categoryData}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            setSearchWord={setSearchWord}
          />
          <TableSearchHeader
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            pageNo={pageNo}
            setPageNo={setPageNo}
            searchKey={searchKey}
            pageName="faq"
          />
          {faqData !== null ? (
            <DataGrid
              autoHeight
              pagination
              rows={faqData}
              columns={columns}
              disableSelectionOnClick
              components={{ Pagination: PaginationSimple }}
              componentsProps={{
                pagination: {
                  totalPage: pageData.totalPage,
                  pageNo: pageNo,
                  setPageNo: setPageNo,
                  pageName: 'faq',
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

// FAQ 조회 API 호출
export const getAllFaq = async (pageNo: number, searchKey: string, searchWord: string) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await ApiSSR.get(`${apiConfig.apiEndpoint}/faq`, {
      data: { searchKey, searchWord, pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// Category 조회 API 호출
export const getAllCategory = async () => {
  try {
    const res = await ApiSSR.get(`${apiConfig.apiEndpoint}/faq/category`);

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNo, searchKey, searchWord } = context.query;

  const faqResult = await getAllFaq(Number(pageNo), searchKey as string, searchWord as string);
  const categoryResult = await getAllCategory();

  const apiData: FaqType = faqResult === undefined ? null : faqResult.items;
  const pageData: PageType =
    faqResult === undefined
      ? {
          currentPage: 1,
          pageSize: 1,
          totalCount: 0,
          totalPage: 1,
        }
      : {
          currentPage: faqResult.currentPage,
          pageSize: faqResult.pageSize,
          totalCount: faqResult.totalCount,
          totalPage: faqResult.totalPage,
        };
  const categoryApiData: CategoryType[] = categoryResult === undefined ? null : categoryResult;

  return {
    props: {
      apiData,
      pageData,
      categoryApiData,
    },
  };
};

export default FaqList;
