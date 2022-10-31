// ** React Imports
import {ChangeEvent, useState} from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import {AlarmLight} from "mdi-material-ui";
import TableContainer from '@mui/material/TableContainer'
import PaginationSimple from "../../components/pagination/PaginationSimple";


interface Column {
  id: 'id' | 'isTop' | 'title' | 'viewCnt' | 'regDate'
  label: string
  minWidth?: number
  align?: 'center'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'id', label: '번호', align: 'center' },
  { id: 'isTop', label: '', align: 'center' },
  { id: 'title', label: '제목' },
  { id: 'viewCnt', label: '조회수', align: 'center' },
  { id: 'regDate', label: '등록일', align: 'center' }
]

interface Data {
  id: number
  isTop: boolean
  title: string
  viewCnt: number
  regDate: string
}

function createData(id: number, isTop: boolean, title: string, viewCnt: number, regDate: string): Data {
  return { id, isTop, title, viewCnt, regDate }
}

const rows = [
  createData(100, true, '서비스 이용 점검 안내', 22305, '2022-10-25'),
  createData(99,  true,'TenPick 일부 기능의 사양 변경 및 종료 안내', 1235, '2022-10-23'),
  createData(98, true,'서비스 이용 방식 안내', 1578, '2022-10-20'),
  createData(97, false,'TenPick 비정기 업데이트 소식', 536, '2022-10-15'),
  createData(96, false,'일부 라이센스 변경 안내', 485, '2022-09-25'),
  createData(95, false,'일부 기능 종료 안내', 965, '2022-09-08'),
  createData(94, false,'서비스 공식 지원 환경 변경 사전 안내', 120, '2022-09-02'),
  createData(93, false,'업데이트에 따른 로그인 오류 안내', 3694, '2022-08-29'),
  createData(92, false,'TenPick 서비스 이용약관 변경 안내', 8452, '2022-08-22'),
  createData(91, false,'연휴 기간 고객센터 휴무 안내', 1247, '2022-08-17'),
]

const TableStickyHeader = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', marginTop:'10px'}}>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                  {columns.map(column => {
                    const value = row[column.id]
                    console.log(column)

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {}
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                        {column.id === 'isTop' && value === true ? <AlarmLight color='primary' style={{ paddingTop: '2px'}}>value</AlarmLight> : null}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationSimple />
    </Paper>
  )
}

export default TableStickyHeader
