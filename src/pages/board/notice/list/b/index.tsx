// ** React Imports
import {useCallback, useState} from 'react'

// ** Next Import
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import {DataGrid} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

// ** Icons Imports
// ** Store Imports
// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import
// ** Actions Imports
// ** Types Imports
import {boardData, BoardType} from 'src/types/apps/userTypes'

// ** Custom Components Imports
import TableSearchHeader from "../../../../../views/board/list/TableSearchHeader";
import PageLeftInHeader from "../../../../../@core/components/page-left-in-header";

interface CellType {
  row: BoardType
}

// 테이블 컬럼 데이터 맵핑
const columns = [
  {
    flex: 0.06,
    minWidth: 60,
    field: 'id',
    headerName: '번호',
    renderCell: ({row}: CellType) => {
      return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {row.isTop === true ?
            <CustomChip
              skin='light'
              size='small'
              label='중요'
              color='primary'
              sx={{'& .MuiChip-label': {lineHeight: '18px'}, fontWeight: 600}}
            />
            : <Typography variant='body2'>
              {row.id}
            </Typography>}
        </Box>
      )
    }
  },
  {
    flex: 0.4,
    minWidth: 200,
    field: 'title',
    headerName: '제목',
    renderCell: ({row}: CellType) => {
      return (
        <Typography variant='subtitle1' style={{marginLeft: '20px'}}>
          {row.title}
        </Typography>
      )
    }
  },
  {
    flex: 0.04,
    minWidth: 60,
    headerName: '조회수',
    field: 'viewCnt',
    renderCell: ({row}: CellType) => {
      return (
        <Box sx={{margin: '0 auto'}}>
          <Typography variant='subtitle2'>
            {row.viewCnt}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '등록일',
    field: 'regDate',
    renderCell: ({row}: CellType) => {
      return (
        <Box sx={{margin: '0 auto'}}>
          <Typography variant='subtitle2'>
            {row.regDate}
          </Typography>
        </Box>
      )
    }
  },
]

// 공지사항 목록 B안 페이지
const UserList = () => {
  // ** State
  // const [role, setRole] = useState<string>('')
  // const [plan, setPlan] = useState<string>('')
  // const [status, setStatus] = useState<string>('')
  // const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)

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
    setValue(val)
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'본사용 공지사항'}
            subtitle={'TenPick의 이벤트 및 업데이트 정보 등 다양한 소식을 알려드립니다.'}
            maincategory={'공지사항'}
            subcategory={'본사용'}
          />
          <TableSearchHeader value={value} handleFilter={handleFilter}/>
          <DataGrid
            autoHeight
            pagination
            rows={boardData}
            columns={columns}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{'& .MuiDataGrid-columnHeaders': {borderRadius: 0}}}

            // onSelectionModelChange={rows => setSelectedRows(rows)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
