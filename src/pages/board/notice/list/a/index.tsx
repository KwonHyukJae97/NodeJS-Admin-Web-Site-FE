// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import PageLeftOutHeader from "../../../../../@core/components/page-left-out-header";

// ** Demo Components Imports
import TableSearchHeader from "../../../../../views/board/list/TableSearchHeader";
import {DataGrid} from "@mui/x-data-grid";
import {boardData, BoardType} from "../../../../../types/apps/userTypes";
import Box from "@mui/material/Box";
import CustomChip from "../../../../../@core/components/mui/chip";
import Typography from "@mui/material/Typography";
import {useCallback, useState} from "react";
import Card from "@mui/material/Card";

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

// 공지사항 목록 A안 페이지
const RolesComponent = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)

  // const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageLeftOutHeader
          title={'본사용 공지사항'}
          maincategory={'공지사항'}
          subcategory={'본사용'}
        />

        <Card>
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

export default RolesComponent
