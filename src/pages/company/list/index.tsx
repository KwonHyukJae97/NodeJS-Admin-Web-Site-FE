// ** React Imports
import { useCallback, useEffect, useState } from 'react';

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
          <Typography variant="body2">{row.company_id}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.3,
    minWidth: 200,
    field: 'company',
    headerName: '회원사 이름',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Link href={`/company/detail/${row.company_id}`} passHref>
            <StyledLink>{row.company_name}</StyledLink>
          </Link>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '사용자 수',
    field: 'user_count',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.user_count}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '관리자 수',
    field: 'admin_count',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.admin_count}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '등록일',
    field: 'reg_date',
    renderCell: ({ row }: CellType) => {
      const reg_date = moment(row.reg_date).format('YYYY-MM-DD');

      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{reg_date}</Typography>
        </Box>
      );
    },
  },
];

// 회원사 목록 페이지
const CompanyList = () => {
  // ** State
  const [value, setValue] = useState<string>(''),
    [pageSize, setPageSize] = useState<number>(10),
    [companyData, setCompanyData] = useState<any[]>([]);

  // 회원사 리스트 조회 API호출
  useEffect(() => {
    axios
      .get(`${apiConfig.apiEndpoint}/company`)
      .then((res) => {
        setCompanyData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'회원사 관리'}
            maincategory={'회원사관리'}
            subcategory={'회원사관리'}
          />
          <TableSearchHeader value={value} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            pagination
            rows={companyData}
            columns={columns}
            getRowId={(row: any) => row.company_id}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default CompanyList;
