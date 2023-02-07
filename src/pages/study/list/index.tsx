// ** React Imports
import { useState } from 'react';

// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { AlertCircleOutline } from 'mdi-material-ui';

// ** Custom Components Imports
import PageLeftInHeader from 'src/@core/components/page-left-in-header';
import TableSearchHeader from 'src/views/board/list/TableSearchHeader';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';

// ** Types Imports
import { PageType } from 'src/utils/pageType';
import { StudyType } from 'src/types/apps/studyTypes';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { HiOutlineNoSymbol } from 'react-icons/hi2';

//테이블 행 데이터 타입 정의
interface CellType {
  row: StudyType;
}

//테이블 컬럼 데이터 맵핑
const columns = [
  {
    flex: 0.01,
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
    flex: 0.1,
    minWidth: 200,
    field: 'studyTypeCode',
    headerName: '영역',
    renderCell: ({ row }: CellType) => {
      if (row.studyTypeCode == '1') {
        row.studyTypeCode = '단어';
      } else if (row.studyTypeCode == '12') {
        row.studyTypeCode = '듣기';
      }

      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="body2">{row.studyTypeCode}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 200,
    field: 'studyName',
    headerName: '학습명',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="body2">{row.studyName}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 200,
    field: 'studyMode',
    headerName: '진행방식',
    renderCell: ({ row }: CellType) => {
      if (row.studyMode == '0') {
        row.studyMode = '단어수';
      } else if (row.studyMode == '1') {
        row.studyMode = '단원별';
      }

      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="body2">{row.studyMode}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'isService',
    headerName: '서비스여부',
    renderCell: ({ row }: CellType) => {
      if (row.isService == true) {
        return (
          <Box sx={{ margin: '0 auto' }}>
            <IoCheckmarkCircleSharp size={25}></IoCheckmarkCircleSharp>
          </Box>
        );
      } else if (row.isService == false) {
        return (
          <Box sx={{ margin: '0 auto' }}>
            <HiOutlineNoSymbol size={25}></HiOutlineNoSymbol>
          </Box>
        );
      }
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'regBy',
    headerName: '등록자',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="body2">{row.regBy}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'regDate',
    headerName: '등록일',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="body2">{row.regDate}</Typography>
        </Box>
      );
    },
  },
];

//학습관리 목록 페이지
const StudyList = ({
  apiData,
  pageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** state
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const studyData: StudyType[] =
    apiData !== null
      ? apiData.map((data: any, index: number) => {
          const study: StudyType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - index,
            studyId: data.studyId,
            studyTypeCode: data.studyTypeCode,
            studyName: data.studyName,
            studyMode: data.studyMode,
            isService: data.isService,
            regBy: data.regBy,
            regDate: getDateTime(data.regDate),
            // regDate: data.regDate,
            totalCount: data.totalCount,
          };

          return study;
        })
      : null;

  // 학습관리 정보가 없을 경우 처리하는 컴포넌트
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
      <AlertCircleOutline sx={{ mr: 2 }} />
      <Typography variant="h6">해당 검색에 대한 학습관리 정보가 없습니다.</Typography>
    </Box>
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'학습관리 리스트'}
            subtitle={'학습관리 리스트입니다.'}
            maincategory={'문제관리'}
            subcategory={'학습관리'}
            setPageNo={setPageNo}
            setSearchWord={setSearchWord}
            pageName="study"
          />
          <TableSearchHeader
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            pageNo={pageNo}
            setPageNo={setPageNo}
            pageName="study"
          />
          {studyData !== null ? (
            <>
              <Box
                sx={{
                  mb: 2,
                  ml: 15,
                  display: 'flex',
                }}
              >
                <Typography variant="body2"> 총 {pageData.totalCount} 개</Typography>
              </Box>
              <DataGrid
                autoHeight
                pagination
                rows={studyData}
                columns={columns}
                disableSelectionOnClick
                components={{ Pagination: PaginationSimple }}
                componentsProps={{
                  pagination: {
                    totalPage: pageData.totalPage,
                    pageNo: pageNo,
                    setPageNo: setPageNo,
                    pageName: 'study',
                  },
                }}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              />
            </>
          ) : (
            renderNoResult
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

//학습관리 조회 api 호출
export const getAllStudyList = async (pageNo: number, searchWord: string) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/study`, {
      data: { searchWord, pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNo, searchWord } = context.query;

  const result = await getAllStudyList(Number(pageNo), searchWord as string);

  const apiData: StudyType = result === undefined ? null : result.items;
  const pageData: PageType =
    result === undefined
      ? {
          currentPage: 1,
          pageSize: 1,
          totalCount: 0,
          totalPage: 1,
        }
      : {
          currentPage: result.currentPage,
          pageSize: result.pageSize,
          totalCount: result.totalCount,
          totalPage: result.totalPage,
        };

  return {
    props: {
      apiData,
      pageData,
    },
  };
};
export default StudyList;
