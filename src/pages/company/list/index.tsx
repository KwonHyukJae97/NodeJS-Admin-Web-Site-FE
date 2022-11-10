// ** React Imports
import { useEffect, useState } from 'react';

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
import { GetStaticProps, InferGetStaticPropsType } from 'next/types';

// table row data type
interface CellType {
  row: CompanyType;
}

// ** Styled component for the link in the dataTable
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
          <Link href={`/company/detail/${row.companyId}`} passHref>
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
const CompanyList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [data, setData] = useState<CompanyType[] | null>(null),
    [searchData, setSearchData] = useState<CompanyType[] | null>(null),
    [pageSize, setPageSize] = useState<number>(10),
    [searchKeyword, setSearchKeyword] = useState<string>(''),
    [searchAction, setSearchAction] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const companyData: CompanyType[] = apiData.map((data: any, idx: number) => {
    const company: CompanyType = {
      id: idx + 1,
      companyId: data.companyId,
      companyName: data.companyName,
      userCount: data.userCount,
      adminCount: data.adminCount,
      regDate: data.regDate,
    };

    return company;
  });

  // ** Hooks
  // 검색어가 있는 상태에서 검색 버튼을 클릭할 때마다 화면 그려주도록 작성
  useEffect(() => {
    // 검색 결과에 대한 데이터 가져오는 함수
    const getSearchKeyword = async () => {
      setData(null);
      try {
        const res = await axios.post(`${apiConfig.apiEndpoint}/company`, {
          searchWord: searchKeyword,
        });

        if (res.data && res.data.length) {
          setSearchData(
            res.data.map((d: any, idx: number) => {
              const company: CompanyType = {
                id: idx + 1,
                companyId: d.companyId,
                companyName: d.companyName,
                userCount: d.userCount,
                adminCount: d.adminCount,
                regDate: d.regDate,
              };
              console.log(company);

              return company;
            }),
          );
        } else {
          setData(null);
        }
      } catch (err) {
        console.log(err);
        setData(null);
      }
    };

    // 검색어가 있을 경우
    if (searchKeyword !== '') {
      getSearchKeyword();

      // 검색 결과 조회 후, 입력값 리셋
      setSearchKeyword('');
    } else {
      setData(companyData);
    }
  }, [searchAction]);

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
          />
          <TableSearchHeader
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            setSearchAction={setSearchAction}
          />
          {data !== null ? (
            <DataGrid
              autoHeight
              pagination
              rows={companyData}
              columns={columns}
              getRowId={(row: any) => row.companyId}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />
          ) : searchData !== null ? (
            <DataGrid
              autoHeight
              pagination
              rows={searchData}
              columns={columns}
              getRowId={(row: any) => row.companyId}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(`${apiConfig.apiEndpoint}/company`, {
    withCredentials: true,
  });
  const apiData: CompanyType = res.data;

  return {
    props: {
      apiData,
    },
  };
};

export default CompanyList;
