// ** React Imports
import React, { useState } from 'react';

// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';

// ** MUI Imports
import Box from '@mui/material/Box';
import { AlertCircleOutline } from 'mdi-material-ui';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// ** Custom Components Imports
import PageLeftInHeader from 'src/@core/components/page-left-in-header';
import SearchFilterHeader from 'src/views/word/SearchFilterHeader';
import SearchButtonsHeader from 'src/views/word/SearchButtonsHeader';
import WordTable from 'src/views/word/WordTable';

// ** axios
import { ApiSSR } from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Types Imports
import { WordType } from 'src/types/apps/wordTypes';
import { PageType } from 'src/utils/pageType';

// 전체 단어 리스트 페이지
const WordList = ({
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
            similarWords: data.similarWords,
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
            title={'전체 단어 정보'}
            maincategory={'문제관리'}
            subcategory={'전체 단어'}
            setPageNo={setPageNo}
            setSearchWord={setSearchWord}
            pageName="word"
          />

          <SearchFilterHeader />

          <SearchButtonsHeader isWordList={true} />

          {wordData !== null ? (
            <WordTable
              wordData={wordData}
              totalPage={pageData.totalPage}
              pageNo={pageNo}
              setPageNo={setPageNo}
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
    const res = await ApiSSR.get(`${apiConfig.apiEndpoint}/word`, {
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

export default WordList;
