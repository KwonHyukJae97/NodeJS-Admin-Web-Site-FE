// ** React Imports
import {useState, useEffect, useCallback} from 'react'

// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import {DataGrid} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Icons Imports

// ** Store Imports
import {useDispatch} from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import

// ** Actions Imports
import {fetchData} from 'src/store/apps/user'

// ** Types Imports
import {AppDispatch} from 'src/store'
import {boardData, BoardType} from 'src/types/apps/userTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'

// interface CellType {
//   row: UsersType
// }

interface CellType {
  row: BoardType
}

// const userStatusObj: UserStatusType = {
//   active: 'success',
//   pending: 'warning',
//   inactive: 'secondary'
// }

// ** Styled component for the link for the avatar with image

// ** renders client column


// ** Styled component for the link inside menu

const columns = [
  {
    flex: 0.05,
    minWidth: 40,
    field: 'id',
    headerName: '번호',
    renderCell: ({row}: CellType) => {
      return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {row.isTop === true ? <CustomChip
              skin='light'
              size='small'
              label='중요'
              color='primary'
              sx={{textTransform: 'capitalize', '& .MuiChip-label': {lineHeight: '18px'}, fontWeight: 600}}
            /> :
            <Typography noWrap variant='body2'>
              {row.id}
            </Typography>}
        </Box>

        // <Box sx={{ display: 'flex', alignItems: 'center' }}>
        //   {renderClient(row)}
        //   <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        //     <Link href={`/apps/user/view/${id}`} passHref>
        //       <Typography
        //         noWrap
        //         component='a'
        //         variant='subtitle2'
        //         sx={{ color: 'text.primary', textDecoration: 'none' }}
        //       >
        //         {nickname}
        //       </Typography>
        //     </Link>
        //     <Link href={`/apps/user/view/${id}`} passHref>
        //       <Typography noWrap component='a' variant='caption' sx={{ textDecoration: 'none' }}>
        //         @{username}
        //       </Typography>
        //     </Link>
        //   </Box>
        // </Box>
      )
    }
  },
  {
    flex: 0.25,
    minWidth: 360,
    field: 'title',
    headerName: '제목',
    renderCell: ({row}: CellType) => {
      return (
        <Typography noWrap variant='subtitle1' style={{marginLeft: '20px'}}>
          {row.title}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 80,
    headerName: '조회수',
    field: 'viewCnt',
    renderCell: ({row}: CellType) => {
      return (
        <Box sx={{display: 'block', justifyContent: 'center', margin: '0 auto'}}>
          <Typography noWrap variant='subtitle1'>
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
        <Box sx={{display: 'block', justifyContent: 'center', margin: '0 auto'}}>
          <Typography noWrap variant='subtitle1'>
            {row.regDate}
          </Typography>
        </Box>
      )
    }
  },

  // {
  //   flex: 0.1,
  //   minWidth: 110,
  //   field: 'status',
  //   headerName: 'Status',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <CustomChip
  //         skin='light'
  //         size='small'
  //         label={row.status}
  //         color={userStatusObj[row.status]}
  //         sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
  //       />
  //     )
  //   }
  // },
  // {
  //   flex: 0.1,
  //   minWidth: 90,
  //   sortable: false,
  //   field: 'actions',
  //   headerName: 'Actions',
  //   renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  // }
]

const UserList = () => {
  // ** State
  const [role] = useState<string>('')
  const [plan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Typography variant='h4'>회원사용 공지사항</Typography>}
                      sx={{pb: 4, '& .MuiCardHeader-title': {letterSpacing: '.15px'}}}
                      style={{textAlign: "center", paddingTop: '82px', paddingBottom: '10px'}}/>
          <hr style={{width: '30px', color: 'lightgrey'}}/>
          <CardHeader title={<Typography variant='subtitle1'>TenPick의 이벤트 및 업데이트 정보 등 다양한 소식을 알려드립니다.</Typography>}
                      sx={{pb: 4, '& .MuiCardHeader-title': {letterSpacing: '.15px'}}}
                      style={{textAlign: "center", padding: '8px 0'}}/>

          {/* Tables 컴포넌트 사용 */}
          {/*<TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />*/}
          {/*<TableStickyHeader />*/}

          {/* DataGrid 컴포넌트 사용 */}
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer}/>
          <DataGrid
            autoHeight
            pagination
            rows={boardData}
            columns={columns}

            // checkboxSelection
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{'& .MuiDataGrid-columnHeaders': {borderRadius: 0}}}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
          {/*<PaginationSimple />*/}
        </Card>
      </Grid>
    </Grid>
  )

  // return (
  //   <Grid container spacing={6}>
  //     <Grid item xs={12}>
  //       <Card>
  //         <CardHeader title='공지사항' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
  //         <CardContent>
  //           <Grid container spacing={6}>
  //             <Grid item sm={4} xs={12}>
  //               <FormControl fullWidth>
  //                 <InputLabel id='role-select'>Select Role</InputLabel>
  //                 <Select
  //                   fullWidth
  //                   value={role}
  //                   id='select-role'
  //                   label='Select Role'
  //                   labelId='role-select'
  //                   onChange={handleRoleChange}
  //                   inputProps={{ placeholder: 'Select Role' }}
  //                 >
  //                   <MenuItem value=''>Select Role</MenuItem>
  //                   <MenuItem value='admin'>Admin</MenuItem>
  //                   <MenuItem value='author'>Author</MenuItem>
  //                   <MenuItem value='editor'>Editor</MenuItem>
  //                   <MenuItem value='maintainer'>Maintainer</MenuItem>
  //                   <MenuItem value='subscriber'>Subscriber</MenuItem>
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             <Grid item sm={4} xs={12}>
  //               <FormControl fullWidth>
  //                 <InputLabel id='plan-select'>Select Plan</InputLabel>
  //                 <Select
  //                   fullWidth
  //                   value={plan}
  //                   id='select-plan'
  //                   label='Select Plan'
  //                   labelId='plan-select'
  //                   onChange={handlePlanChange}
  //                   inputProps={{ placeholder: 'Select Plan' }}
  //                 >
  //                   <MenuItem value=''>Select Plan</MenuItem>
  //                   <MenuItem value='basic'>Basic</MenuItem>
  //                   <MenuItem value='company'>Company</MenuItem>
  //                   <MenuItem value='enterprise'>Enterprise</MenuItem>
  //                   <MenuItem value='team'>Team</MenuItem>
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //             <Grid item sm={4} xs={12}>
  //               <FormControl fullWidth>
  //                 <InputLabel id='status-select'>Select Status</InputLabel>
  //                 <Select
  //                   fullWidth
  //                   value={status}
  //                   id='select-status'
  //                   label='Select Status'
  //                   labelId='status-select'
  //                   onChange={handleStatusChange}
  //                   inputProps={{ placeholder: 'Select Role' }}
  //                 >
  //                   <MenuItem value=''>Select Role</MenuItem>
  //                   <MenuItem value='pending'>Pending</MenuItem>
  //                   <MenuItem value='active'>Active</MenuItem>
  //                   <MenuItem value='inactive'>Inactive</MenuItem>
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //           </Grid>
  //         </CardContent>
  //       </Card>
  //     </Grid>
  //     <Grid item xs={12}>
  //       <Card>
  //         <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
  //         <DataGrid
  //           autoHeight
  //           rows={store.data}
  //           columns={columns}
  //           checkboxSelection
  //           pageSize={pageSize}
  //           disableSelectionOnClick
  //           rowsPerPageOptions={[10, 25, 50]}
  //           sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
  //           onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
  //         />
  //       </Card>
  //     </Grid>
  //
  //     <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
  //   </Grid>
  // )
}

export default UserList
