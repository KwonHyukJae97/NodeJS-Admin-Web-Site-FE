// ** React Imports
import React, { useState } from 'react';

// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { AlertCircleOutline } from 'mdi-material-ui';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Icon } from '@iconify/react';

// ** Custom Components Imports
import PageLeftInHeader from 'src/@core/components/page-left-in-header';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';
import SearchButtonsHeader from 'src/views/word/SearchButtonsHeader';

// ** axios
import { ApiSSR } from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Types Imports
import { WordType } from 'src/types/apps/wordTypes';
import { PageType } from 'src/utils/pageType';

// 테이블 행 데이터 타입 정의
interface CellType {
  row: WordType;
}

// 테이블 컬럼 데이터 맵핑
const columns = [
  {
    flex: 0.04,
    minWidth: 40,
    field: 'id',
    headerName: '번호',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2">{row.id}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.02,
    minWidth: 20,
    field: 'wordType',
    headerName: '구분',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant="subtitle2" style={{ margin: '0 auto' }}>
          {row.wordStatus}
        </Typography>
      );
    },
  },
  {
    flex: 0.06,
    minWidth: 60,
    field: 'word',
    headerName: '단어',
    renderCell: ({ row }: CellType) => {
      return (
        <>
          <Typography variant="subtitle2">{row.wordName}</Typography>
          {/*{row.similarWords*/}
          {/*  ? row.similarWords.map((similarWord) => (*/}
          {/*      <Typography variant="subtitle2">{similarWord.wordName}</Typography>*/}
          {/*    ))*/}
          {/*  : null}*/}
        </>
      );
    },
  },
  {
    flex: 0.08,
    minWidth: 80,
    headerName: '의미',
    field: 'mean',
    renderCell: ({ row }: CellType) => {
      return (
        <Box>
          <Typography variant="subtitle2">{row.mean}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    headerName: '예문',
    field: 'example',
    renderCell: ({ row }: CellType) => {
      return (
        <Box>
          {row.examples?.map((example) => (
            <>
              <Box key={example.exampleId} sx={{ p: 1, ml: 1 }}>
                <Typography variant="subtitle2">{example.sentence}</Typography>
                <Typography variant="subtitle2">{example.translation}</Typography>
                <Typography variant="subtitle2">{example.source}</Typography>
              </Box>
              <Divider
                sx={{
                  borderWidth: 'unset',
                  border: '0.5px solid rgba(76, 78, 100, 0.12)',
                }}
              />
            </>
          ))}
        </Box>
      );
    },
  },
  {
    flex: 0.08,
    minWidth: 80,
    headerName: '옵션',
    field: 'action',
    renderCell: ({ row }: CellType) => {
      const files = row.wordFiles;

      return (
        <Box sx={{ margin: '0 auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button sx={{ minWidth: 0, p: 1.25 }}>
              {files!.filter((file) => file.fileCode == '00').pop() ? (
                <Icon
                  icon="ri:image-2-fill"
                  width="24"
                  height="24"
                  color="rgba(103, 108, 246, 1)"
                />
              ) : (
                <Icon icon="ri:image-2-fill" width="24" height="24" color="lightGrey" />
              )}
            </Button>
            <Button sx={{ minWidth: 0, p: 1.25 }}>
              {files!.filter((file) => file.fileCode == '01').pop() ? (
                <Icon
                  icon="ri:image-edit-fill"
                  width="24"
                  height="24"
                  color="rgba(103, 108, 246, 1)"
                />
              ) : (
                <Icon icon="ri:image-edit-fill" width="24" height="24" color="lightGrey" />
              )}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button sx={{ minWidth: 0, p: 1.25 }}>
              {files!.filter((file) => file.fileCode == '02').pop() ? (
                <Icon
                  icon="ant-design:sound-filled"
                  width="24"
                  height="24"
                  color="rgba(103, 108, 246, 1)"
                />
              ) : (
                <Icon icon="ant-design:sound-filled" width="24" height="24" color="lightGrey" />
              )}
            </Button>
            <Button sx={{ minWidth: 0, p: 1.25 }}>
              {files!.filter((file) => file.fileCode == '03').pop() ? (
                <Icon
                  icon="fluent:video-clip-20-filled"
                  width="24"
                  height="24"
                  color="rgba(103, 108, 246, 1)"
                />
              ) : (
                <Icon icon="fluent:video-clip-20-filled" width="24" height="24" color="lightGrey" />
              )}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button sx={{ minWidth: 0, p: 1.25 }}>
              <Icon icon="mdi:text-box-search" width="24" height="24" color="grey" />
            </Button>
            <Button sx={{ minWidth: 0, p: 1.25 }}>
              <Icon icon="material-symbols:add-box" width="25" height="25" color="grey" />
            </Button>
          </Box>
        </Box>
      );
    },
  },
];

// 중복된 단어 대표 설정 페이지
const DuplicationWordList = ({
  apiData,
  pageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** State
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const wordData: WordType[] =
    apiData !== null
      ? apiData.map((data: any, index: number) => {
          const word: WordType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - index,
            wordId: data.wordId,
            wordLevelId: data.wordLevelId,
            projectId: data.projectId,
            connectWordId: data.connectWordId,
            wordName: data.wordName,
            mean: data.mean,
            wordStatus: data.wordStatus,
            isMainWord: data.isMainWord,
            isAutoMain: data.isAutoMain,
            wordFiles: data.wordFiles,
            examples: data.examples,
          };

          return word;
        })
      : null;

  // 게시글이 없을 경우 처리하는 컴포넌트
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
      <Typography variant="h6">등록된 단어 정보가 없습니다.</Typography>
    </Box>
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'중복된 단어 대표 설정'}
            maincategory={'문제관리'}
            subcategory={'전체 단어'}
            thirdcategory={'중복된 단어 대표 설정'}
            setPageNo={setPageNo}
            setSearchWord={setSearchWord}
            pageName="word"
          />

          <Box sx={{ mb: 3, ml: 10, mr: 10, p: 5, pb: 0, mt: 2 }}>
            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                검색 타입
              </Typography>
              <Select
                label=""
                id="wordLevel"
                // value={wordLevel}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                // onChange={handleWordLevelChange}
                sx={{ width: 180 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>자동으로 대표 설정</MenuItem>
                <MenuItem value={'writer'}>수동으로 대표 설정</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <SearchButtonsHeader isDuplicationWordList={true} />

          {wordData !== null ? (
            <DataGrid
              autoHeight={true}
              pagination
              rows={wordData}
              columns={columns}
              checkboxSelection
              components={{ Pagination: PaginationSimple }}
              componentsProps={{
                pagination: {
                  totalPage: pageData.totalPage,
                  pageNo: pageNo,
                  setPageNo: setPageNo,
                  pageName: 'word',
                },
              }}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          ) : (
            renderNoResult
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

// 단어 조회 API 호출
export const getAllWord = async (pageNo: number, searchWord: string) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await ApiSSR.get(`${apiConfig.apiEndpoint}/word/duplication`, {
      data: { searchWord, pageNo: page, pageSize: 10, totalData: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNo, searchWord } = context.query;

  const result = await getAllWord(Number(pageNo), searchWord as string);

  const apiData: WordType[] = result === undefined ? null : result.items;
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

export default DuplicationWordList;
