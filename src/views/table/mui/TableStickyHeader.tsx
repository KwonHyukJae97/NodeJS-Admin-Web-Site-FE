// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import PaginationSimple from "../../components/pagination/PaginationSimple";
import CustomChip from "../../../@core/components/mui/chip";

// interface Column {
//   id: 'name' | 'code' | 'population' | 'size' | 'density'
//   label: string
//   minWidth?: number
//   align?: 'right'
//   format?: (value: number) => string
// }

// const columns: readonly Column[] = [
//   { id: 'name', label: 'Name', minWidth: 170 },
//   { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//   {
//     id: 'population',
//     label: 'Population',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toLocaleString('en-US')
//   },
//   {
//     id: 'size',
//     label: 'Size\u00a0(km\u00b2)',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toLocaleString('en-US')
//   },
//   {
//     id: 'density',
//     label: 'Density',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => value.toFixed(2)
//   }
// ]

// interface Data {
//   name: string
//   code: string
//   size: number
//   density: number
//   population: number
// }

// function createData(name: string, code: string, population: number, size: number): Data {
//   const density = population / size
//
//   return { name, code, population, size, density }
// }

// const rows = [
//   createData('India', 'IN', 1324171354, 3287263),
//   createData('China', 'CN', 1403500365, 9596961),
//   createData('Italy', 'IT', 60483973, 301340),
//   createData('United States', 'US', 327167434, 9833520),
//   createData('Canada', 'CA', 37602103, 9984670),
//   createData('Australia', 'AU', 25475400, 7692024),
//   createData('Germany', 'DE', 83019200, 357578),
//   createData('Ireland', 'IE', 4857000, 70273),
//   createData('Mexico', 'MX', 126577691, 1972550),
//   createData('Japan', 'JP', 126317000, 377973),
//   createData('France', 'FR', 67022000, 640679),
//   createData('United Kingdom', 'GB', 67545757, 242495),
//   createData('Russia', 'RU', 146793744, 17098246),
//   createData('Nigeria', 'NG', 200962417, 923768),
//   createData('Brazil', 'BR', 210147125, 8515767)
// ]


interface Column {
  id: 'id' | 'title' | 'viewCnt' | 'regDate'
  label: string
  minWidth?: number
  align?: 'center'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'id', label: '번호', minWidth: 40, align: 'center' },
  { id: 'title', label: '제목', minWidth: 300 },
  { id: 'viewCnt', label: '조회수', minWidth: 40, align: 'center' },
  { id: 'regDate', label: '제목', minWidth: 80, align: 'center' }
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
    <Paper sx={{ width: '100%', overflow: 'hidden' , backgroundColor: 'yellow'}}>
      <TableContainer sx={{ maxHeight: 440 }}>
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
                        {/*<CustomChip label='중요' skin='light' color='primary' />*/}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/*<TablePagination*/}
      {/*  rowsPerPageOptions={[10, 25, 100]}*/}
      {/*  component='div'*/}
      {/*  count={rows.length}*/}
      {/*  rowsPerPage={rowsPerPage}*/}
      {/*  page={page}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*  onRowsPerPageChange={handleChangeRowsPerPage}*/}
      {/*/>*/}
      <PaginationSimple />
    </Paper>
  )
}

export default TableStickyHeader
