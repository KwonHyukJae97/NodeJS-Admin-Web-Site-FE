// ** React Imports
import React, { Fragment, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableContainer from '@mui/material/TableContainer';
import Button from '@mui/material/Button';

// ** Icons Imports
import PaginationSimple from '../components/pagination/PaginationSimple';

// ** Types Imports
import { WordType } from 'src/types/apps/wordTypes';
import Divider from '@mui/material/Divider';
import { Icon } from '@iconify/react';

// props 타입 정의
interface WordTableProps {
  wordData: WordType[];
  totalPage: number;
  pageNo: number;
  setPageNo: (value: number) => void;
}

// 데이터 맵핑 세부 핸들링
const Row = (props: { row: WordType }) => {
  // ** Props
  const { row } = props;

  // ** State
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Fragment>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '& .MuiTableCell-root': {
            '&:last-child': {
              pr: 4,
            },
            '&:first-child': {
              pl: 4,
            },
          },
        }}
      >
        <TableCell padding="checkbox" align="center">
          <Checkbox
            color="primary"
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            // checked={rowCount > 0 && numSelected === rowCount}
            // onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.id}
        </TableCell>
        <TableCell align="center">
          {row.isMainWord ? (
            <Icon icon="ic:round-star" width="30" height="30" color="rgba(103, 108, 246, 1)" />
          ) : (
            // <Icon icon="mdi:link-variant" width="24" height="24" color="grey" />
            // <Icon icon="mdi:link-variant-off" width="24" height="24" color="grey" />
            <Icon icon="ic:round-star" width="30" height="30" color="grey" />
          )}
        </TableCell>
        <TableCell>{row.wordName}</TableCell>
        <TableCell>{row.mean}</TableCell>
        <TableCell>
          {row.examples?.map((example) => (
            <Box key={example.exampleId} sx={{ pb: 2, pt: 2 }}>
              <TableBody>{example.sentence}</TableBody>
              <TableBody>{example.translation}</TableBody>
              <TableBody>{example.source}</TableBody>
              {/*<Divider sx={{ borderWidth: 'unset', border: '1px solid rgba(76, 78, 100, 0.12)' }} />*/}
            </Box>
          ))}
        </TableCell>
        <TableCell align="center">
          <>
            <Box>
              {/* 그림 이미지 */}
              <Button sx={{ minWidth: 0, p: 1.5 }}>
                {row.wordFiles!.filter((file) => file.fileCode == '00').pop() ? (
                  <Icon
                    icon="ri:image-2-fill"
                    width="30"
                    height="30"
                    color="rgba(103, 108, 246, 1)"
                  />
                ) : (
                  <Icon icon="ri:image-2-fill" width="30" height="30" color="lightGrey" />
                )}
              </Button>

              {/* 설명 이미지 */}
              <Button sx={{ minWidth: 0, p: 1.5 }}>
                {row.wordFiles!.filter((file) => file.fileCode == '01').pop() ? (
                  <Icon
                    icon="ri:image-edit-fill"
                    width="30"
                    height="30"
                    color="rgba(103, 108, 246, 1)"
                  />
                ) : (
                  <Icon icon="ri:image-edit-fill" width="30" height="30" color="lightGrey" />
                )}
              </Button>
            </Box>

            <Box>
              {/* 음원 */}
              <Button sx={{ minWidth: 0, p: 1.5 }}>
                {row.wordFiles!.filter((file) => file.fileCode == '02').pop() ? (
                  <Icon
                    icon="ant-design:sound-filled"
                    width="30"
                    height="30"
                    color="rgba(103, 108, 246, 1)"
                  />
                ) : (
                  <Icon icon="ant-design:sound-filled" width="30" height="30" color="lightGrey" />
                )}
              </Button>

              {/* 영상 */}
              <Button sx={{ minWidth: 0, p: 1.5 }}>
                {row.wordFiles!.filter((file) => file.fileCode == '03').pop() ? (
                  <Icon
                    icon="fluent:video-clip-20-filled"
                    width="30"
                    height="30"
                    color="rgba(103, 108, 246, 1)"
                  />
                ) : (
                  <Icon
                    icon="fluent:video-clip-20-filled"
                    width="30"
                    height="30"
                    color="lightGrey"
                  />
                )}
              </Button>
            </Box>

            <Box>
              {/* 비슷하지만 다른말 */}
              {row.similarWords?.length !== 0 ? (
                <Button sx={{ minWidth: 0, p: 1.5 }}>
                  <Icon
                    icon="material-symbols:add-box"
                    width="30"
                    height="30"
                    color="rgba(103, 108, 246, 1)"
                  />
                </Button>
              ) : (
                <Button sx={{ minWidth: 0, p: 1.5 }}>
                  <Icon icon="material-symbols:add-box" width="30" height="30" color="lightGrey" />
                </Button>
              )}

              {/* 미리보기 */}
              <Button sx={{ minWidth: 0, p: 1.5 }}>
                <Icon icon="mdi:text-box-search" width="30" height="30" color="grey" />
              </Button>
            </Box>
          </>
        </TableCell>
      </TableRow>
      <TableRow>
        {/*<TableCell colSpan={6} sx={{ py: '0 !important' }}>*/}
        {/*  <Collapse in={open} timeout="auto" unmountOnExit>*/}
        {/*    <Box sx={{ m: 2 }}>*/}
        {/*      <Typography variant="h6" gutterBottom component="div">*/}
        {/*        History*/}
        {/*      </Typography>*/}
        {/*      <Table size="small" aria-label="purchases">*/}
        {/*        <TableHead>*/}
        {/*          <TableRow>*/}
        {/*            <TableCell>Date</TableCell>*/}
        {/*            <TableCell>Customer</TableCell>*/}
        {/*            <TableCell align="right">Amount</TableCell>*/}
        {/*            <TableCell align="right">Total price ($)</TableCell>*/}
        {/*            <TableCell align="right">Total price ($)</TableCell>*/}
        {/*          </TableRow>*/}
        {/*        </TableHead>*/}
        {/*        <TableBody>*/}
        {/*          {row.history.map((historyRow) => (*/}
        {/*            <TableRow key={historyRow.date}>*/}
        {/*              <TableCell component="th" scope="row">*/}
        {/*                {historyRow.date}*/}
        {/*              </TableCell>*/}
        {/*              <TableCell>{historyRow.customerId}</TableCell>*/}
        {/*              <TableCell align="right">{historyRow.amount}</TableCell>*/}
        {/*              <TableCell align="right">*/}
        {/*                {Math.round(historyRow.amount * row.price * 100) / 100}*/}
        {/*              </TableCell>*/}
        {/*            </TableRow>*/}
        {/*          ))}*/}
        {/*        </TableBody>*/}
        {/*      </Table>*/}
        {/*    </Box>*/}
        {/*  </Collapse>*/}
        {/*</TableCell>*/}
      </TableRow>
    </Fragment>
  );
};

// interface EnhancedTableProps {
//   numSelected: number;
//   onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   rowCount: number;
// }

// 전체 단어 정보 테이블 컴포넌트
const WordTable = (props: WordTableProps) => {
  // ** Props
  const { wordData, totalPage, pageNo, setPageNo } = props;

  return (
    <TableContainer component={Paper} sx={{ pl: 12, pr: 12, pb: 6, borderTop: 0 }}>
      <Table aria-label="collapsible table">
        {/* 데이터 헤더 */}
        <TableHead sx={{ backgroundColor: 'rgba(248, 248, 250, 1)' }}>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                '&:last-child': {
                  pr: 4,
                },
                '&:first-child': {
                  pl: 4,
                },
              },
            }}
          >
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                // indeterminate={numSelected > 0 && numSelected < rowCount}
                // checked={rowCount > 0 && numSelected === rowCount}
                // onChange={onSelectAllClick}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
            </TableCell>
            <TableCell sx={{ p: 3, width: 40 }}>번호</TableCell>
            <TableCell sx={{ p: 3, width: 60 }}>구분</TableCell>
            <TableCell sx={{ p: 3, width: 100 }}>단어</TableCell>
            <TableCell sx={{ p: 3, width: 200 }}>의미</TableCell>
            <TableCell sx={{ p: 3, width: 360 }}>예문</TableCell>
            <TableCell sx={{ p: 3, width: 100 }}>기타</TableCell>
          </TableRow>
        </TableHead>

        {/* 데이터 맵핑 */}
        <TableBody
          sx={{
            borderBottom: 0,
          }}
        >
          {wordData.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>

      {/* 페이징 처리 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PaginationSimple
          totalPage={totalPage}
          pageNo={pageNo}
          setPageNo={setPageNo}
          pageName="word"
        />
      </Box>

      <Box
        sx={{
          m: 4,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="contained" type="submit">
          저장
        </Button>
      </Box>
    </TableContainer>
  );
};

export default WordTable;
