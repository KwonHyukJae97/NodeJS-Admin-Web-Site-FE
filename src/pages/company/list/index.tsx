// ** React Imports
import { useCallback, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

// ** Types Imports
import { CompanyData, CompanyType } from 'src/types/apps/companyTypes';

// ** Custom Components Imports
import TableSearchHeader from 'src/views/company/list/TableSearchHeader';
import PageLeftInHeader from 'src/@core/components/page-left-in-header';

interface CellType {
  row: CompanyType;
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
    flex: 0.3,
    minWidth: 200,
    field: 'companyName',
    headerName: '회원사 이름',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle1">{row.companyName}</Typography>
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
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.regDate}</Typography>
        </Box>
      );
    },
  },
];

// 회원사 목록 페이지
const CompanyList = () => {
  // ** State
  // const [role, setRole] = useState<string>('')
  // const [plan, setPlan] = useState<string>('')
  // const [status, setStatus] = useState<string>('')
  // const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [value, setValue] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);

  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()
  //
  // useEffect(() => {
  //   dispatch(
  //     fetchData({
  //       role,
  //       status,
  //       q: value,
  //       currentPlan: plan
  //     })
  //   )
  // }, [dispatch, plan, role, status, value])

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
            rows={CompanyData}
            columns={columns}
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
