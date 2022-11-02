// ** React Imports
import {MouseEvent, ReactElement, useCallback, useEffect, useState} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import {DataGrid, GridRowId} from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {SelectChangeEvent} from '@mui/material/Select'

// ** Icons Imports
import Laptop from 'mdi-material-ui/Laptop'
import ChartDonut from 'mdi-material-ui/ChartDonut'
import CogOutline from 'mdi-material-ui/CogOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Store Imports
import {useDispatch, useSelector} from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import {getInitials} from 'src/@core/utils/get-initials'

// ** Actions Imports
import {deleteUser, fetchData} from 'src/store/apps/user'

// ** Types Imports
import {AppDispatch, RootState} from 'src/store'
import {ThemeColor} from 'src/@core/layouts/types'
import {boardData, BoardType, UsersType} from 'src/types/apps/userTypes'

// ** Custom Components Imports
import TableSearchHeader from "../../../../../views/board/list/TableSearchHeader";
import PageLeftInHeader2 from "../../../../../@core/components/page-left-in-header2";

interface UserRoleType {
  [key: string]: ReactElement
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars
const userRoleObj: UserRoleType = {
  admin: <Laptop sx={{mr: 2, color: 'error.main'}}/>,
  author: <CogOutline sx={{mr: 2, color: 'warning.main'}}/>,
  editor: <PencilOutline sx={{mr: 2, color: 'info.main'}}/>,
  maintainer: <ChartDonut sx={{mr: 2, color: 'success.main'}}/>,
  subscriber: <AccountOutline sx={{mr: 2, color: 'primary.main'}}/>
}

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
const AvatarWithImageLink = styled(Link)(({theme}) => ({
  marginRight: theme.spacing(3)
}))

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Link)(({theme}) => ({
  textDecoration: 'none',
  marginRight: theme.spacing(3)
}))

// ** renders client column
const renderClient = (row: UsersType) => {
  if (row.avatar.length) {
    return (
      <AvatarWithImageLink href={`/apps/user/view/${row.id}`}>
        <CustomAvatar src={row.avatar} sx={{mr: 3, width: 34, height: 34}}/>
      </AvatarWithImageLink>
    )
  } else {
    return (
      <AvatarWithoutImageLink href={`/apps/user/view/${row.id}`}>
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{mr: 3, width: 34, height: 34, fontSize: '1rem'}}
        >
          {getInitials(row.nickname ? row.nickname : 'John Doe')}
        </CustomAvatar>
      </AvatarWithoutImageLink>
    )
  }
}

// ** Styled component for the link inside menu
const MenuItemLink = styled('a')(({theme}) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary
}))

const RowOptions = ({id}: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <DotsVertical/>
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{style: {minWidth: '8rem'}}}
      >
        <MenuItem sx={{p: 0}}>
          <Link href={`/apps/user/view/${id}`} passHref>
            <MenuItemLink>
              <EyeOutline fontSize='small' sx={{mr: 2}}/>
              View
            </MenuItemLink>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose}>
          <PencilOutline fontSize='small' sx={{mr: 2}}/>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteOutline fontSize='small' sx={{mr: 2}}/>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
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

// 공지사항 목록 B-1안 페이지
const UserList = () => {
  // ** State
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

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

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader2
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
            onSelectionModelChange={rows => setSelectedRows(rows)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
