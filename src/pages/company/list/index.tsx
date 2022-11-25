// ** React Imports
import { useState } from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ** Custom Components Imports
import TableSearchHeader from 'src/views/company/list/TableSearchHeader';
import PageLeftInHeader from 'src/@core/components/page-left-in-header';

// ** Types
import { CompanyType } from 'src/types/apps/companyTypes';

// ** axios
import axios from 'axios';

// ** Config
import apiConfig from 'src/configs/api';

// ** moment
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { AlertCircleOutline } from 'mdi-material-ui';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';

// 테이블 행 데이터 타입 정의
interface CellType {
  row: CompanyType;
}

// 페이지 타입 정의
interface PageType {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}

// 링크 스타일 적용
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

// 테이블 컬럼 데이터 맵핑
const columns = [
  {
    flex: 0.06,
    minWidth: 60,
    field: 'companyId',
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
    flex: 0.3,
    minWidth: 200,
    field: 'companyName',
    headerName: '회원사 이름',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Link href={`/company/view/${row.companyId}`} passHref>
            <StyledLink>{row.companyName}</StyledLink>
          </Link>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '사용자 수',
    field: 'userCount',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.userCount}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '관리자 수',
    field: 'adminCount',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.adminCount}</Typography>
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
      const regDate = moment(row.regDate).format('YYYY-MM-DD');

      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{regDate}</Typography>
        </Box>
      );
    },
  },
];

// 회원사 목록 페이지
const CompanyList = ({
  apiData,
  pageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** State
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>('');

  const pageName = 'company';

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const companyData: CompanyType[] =
    apiData !== null
      ? apiData.map((data: any, idx: number) => {
          const company: CompanyType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - idx,
            companyId: data.companyId,
            companyName: data.companyName,
            userCount: data.userCount,
            adminCount: data.adminCount,
            regDate: data.regDate,
          };

          return company;
        })
      : null;

  // ** Hooks
  // 회원사 정보가 없을 경우 처리하는 컴포넌트
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
      <Typography variant="h6">해당 검색에 대한 정보가 없습니다.</Typography>
    </Box>
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'회원사 관리'}
            maincategory={'회원사관리'}
            subcategory={'회원사관리'}
            setPageNo={setPageNo}
            setSearchWord={setSearchWord}
          />
          <TableSearchHeader
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            pageNo={pageNo}
            setPageNo={setPageNo}
          />
          {companyData !== null ? (
            <DataGrid
              autoHeight
              pagination
              rows={companyData}
              columns={columns}
              getRowId={(row: any) => row.companyId}
              disableSelectionOnClick
              components={{ Pagination: PaginationSimple }}
              componentsProps={{
                pagination: {
                  totalPage: pageData.totalPage,
                  pageNo: pageNo,
                  setPageNo: setPageNo,
                  searchWord: searchWord,
                  pageName: pageName,
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

// 회원사 조회 API 요청
export const getCompany = async (pageNo: number, searchWord: string) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/company`, {
      data: { searchWord, pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNo, searchWord } = context.query;

  const result = await getCompany(Number(pageNo), searchWord as string);

  const apiData: CompanyType = result === undefined ? null : result.items;
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

export default CompanyList;
