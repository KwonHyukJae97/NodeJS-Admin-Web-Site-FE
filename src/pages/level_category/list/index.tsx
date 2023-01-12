// ** React Imports
import { useState } from 'react';

// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { AlertCircleOutline } from 'mdi-material-ui';

// ** Custom Components Imports
import TableSearchHeader from 'src/views/levelCategory/list/TableSearchHeader';
import PageLeftInHeader from 'src/@core/components/page-left-in-header';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';
import ActionButton from 'src/@core/components/ActionButton';

// ** Types
import { LevelCategoryType, studyTypeCodeType } from 'src/types/apps/levelTypes';
import { PageType } from 'src/utils/pageType';

// ** axios
import axios from 'axios';

// ** Config
import apiConfig from 'src/configs/api';

// 테이블 행 데이터 타입 정의
interface CellType {
  row: LevelCategoryType;
}

// 테이블 컬럼 데이터 맵핑
const columns = [
  {
    flex: 0.06,
    minWidth: 60,
    field: 'levelCategoryId',
    headerName: 'No',
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
    minWidth: 100,
    field: 'studyTypeCode',
    headerName: '영역',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="body2">{row.studyTypeName}</Typography>
        </Box>
      );
    },
  },

  {
    flex: 0.1,
    minWidth: 100,
    field: 'levelCategoryCount',
    headerName: '레벨 카테고리 수',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.levelCategoryCount}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.08,
    minWidth: 100,
    headerName: 'ACTIONS',
    field: 'actions',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <ActionButton
            actions={'edit'}
            path={'/level_category/edit/'}
            id={`${row.studyTypeCode}`}
          ></ActionButton>
        </Box>
      );
    },
  },
];

// 레벨 카테고리 목록 페이지
const LevelCategoryList = ({
  apiData,
  pageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** State
  const [pageNo, setPageNo] = useState<number>(1),
    [searchKey, setSearchKey] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const levelCategoryData: LevelCategoryType[] =
    apiData !== null
      ? apiData.map((data: any, index: number) => {
          const levelCategory: LevelCategoryType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - index,
            levelCategoryId: data.levelCategoryId,
            levelCategoryName: data.levelCategoryName,
            levelSequence: data.levelSequence,
            studyTypeCode: data.studyTypeCode,
            studyTypeName: data.studyTypeName,
            levelCategoryCount: data.levelCategoryCount,
            totalCount: data.totalCount,
          };

          return levelCategory;
        })
      : null;

  // 학습 영역코드 할당
  const studyTypeCategoryData: studyTypeCodeType[] =
    apiData !== null
      ? apiData.map((data: any) => {
          const studyTypeCategory: studyTypeCodeType = {
            studyTypeCode: data.studyTypeCode,
            studyTypeName: data.studyTypeName,
          };

          return studyTypeCategory;
        })
      : null;

  // 레벨 카테고리 정보가 없을 경우 처리하는 컴포넌트
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
      <Typography variant="h6">해당 검색에 대한 정보가 없습니다.</Typography>
    </Box>
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'레벨 카테고리 정보'}
            maincategory={'문제관리'}
            subcategory={'레벨 카테고리'}
            setPageNo={setPageNo}
            setSearchKey={setSearchKey}
            pageName="level_category"
          />
          <TableSearchHeader
            categoryData={studyTypeCategoryData}
            searchKey={searchKey}
            pageNo={pageNo}
            setPageNo={setPageNo}
            setSearchKey={setSearchKey}
            pageName="level_category"
          />
          {levelCategoryData !== null ? (
            <>
              <Box
                sx={{
                  mb: 2,
                  ml: 15,
                  display: 'flex',
                }}
              >
                <Typography variant="body2">총 {pageData.totalCount} 개</Typography>
              </Box>
              <DataGrid
                autoHeight
                pagination
                rows={levelCategoryData}
                columns={columns}
                getRowId={(row: any) => row.id}
                disableSelectionOnClick
                components={{ Pagination: PaginationSimple }}
                componentsProps={{
                  pagination: {
                    totalPage: pageData.totalPage,
                    pageNo: pageNo,
                    setPageNo: setPageNo,
                    pageName: 'level_category',
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

// 레벨 카테고리 조회 API 요청
export const getAllLevelCategory = async (pageNo: number, searchKey: string) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/level_category`, {
      data: { searchKey, pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNo, searchKey } = context.query;

  const result = await getAllLevelCategory(Number(pageNo), searchKey as string);

  const apiData: LevelCategoryType = result === undefined ? null : result.items;
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

export default LevelCategoryList;
