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

// import TableSearchHeader from 'src/views/board/list/TableSearchHeader';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';

// ** Types Imports
import { WordLevelType } from 'src/types/apps/wordLevelTypes';
import { PageType } from 'src/utils/pageType';

// ** Common Util Imports
import { getDateTime } from 'src/utils/getDateTime';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import router from 'next/router';

//버튼 컴포넌트
import { IoCheckmarkCircleSharp } from 'react-icons/io5';
import { HiOutlineNoSymbol } from 'react-icons/hi2';
import { ProjectType } from 'src/types/apps/project';
import EditPopup from 'src/@core/components/SidebarRightEdit/EditPopup';
import SearchHeaderPopup from './SearchHaederPopup';
import ActionButton from 'src/@core/components/ActionButton';
import { Button } from '@mui/material';
import { MdSystemUpdateAlt } from 'react-icons/md';

// import { mdiSquareEditOutline, mdiTrashCanOutline } from '@mdi/js';

//테이블 행 데이터 타입 정의
interface CellType {
  row: WordLevelType;
}

// 링크 스타일 적용
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

//삭제 만들기
// const handleDelete = async () => {
//   const res = await Api.delete(`${apiConfig.apiEndpoint}/word_level/${}`)
// }

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
    flex: 0.3,
    minWidth: 200,
    field: 'wordLevelName',
    headerName: '단어레벨명',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          {/* <Link href={`/project/list/?pageNo=&searchWord${row.wordLevelName}`} passHref>
            <StyledLink>{row.wordLevelName}</StyledLink>
          </Link> */}
          {/* <Typography variant="body2">{row.regBy}</Typography> */}
          {/* <Link href={`/wordLevel/view/${row.wordLevelName}`} passHref>
            <StyledLink>{row.wordLevelName}</StyledLink>

            <Typography variant="subtitle1" style={{ marginLeft: '20px' }}>
              {row.wordLevelName}
            </Typography>
          </Link> */}
          {/* <Link
            href={`/project/list/?pageNo=&searchWord=${row.wordLevelName}&searchKey=undefined/`}
          > */}
          <StyledLink>{row.wordLevelName}</StyledLink>
          {/* <StyledLink onClick={() => handleSearchKeyword(1, row.wordLevelName)}>
            {row.wordLevelName}
          </StyledLink> */}
          {/* </Link> */}
          {/* <StyledLink onClick={() => getWordLevelName()}>{row.wordLevelName}</StyledLink> */}
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
          <Link href={`/word_level/edit/${row.wordLevelId}`} passHref>
            <StyledLink>{row.regBy}</StyledLink>
          </Link>
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
  {
    flex: 0.1,
    minWidth: 100,
    field: 'actions',
    headerName: 'ACTIONS',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto', display: 'flex' }}>
          {/* <ActionButton
            actions={'editSide'}
            path={undefined}
            id={`${row.wordLevelId}`}
          ></ActionButton> */}
          {/* <EditPopup id={row.wordLevelId} /> */}
          {/* <Button onClick={handleDelete}>삭제</Button> */}
          {/* <Button onClick={EditPopup(row.wordLevelId)}>ss</Button> */}
          <ActionButton
            actions={'delete'}
            path={'/word_level/delete/'}
            id={row.wordLevelId}
          ></ActionButton>
        </Box>
      );
    },
  },
];

//단어레벨 목록 페이지
export const WordLevelList = ({
  apiData,
  pageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // ** state
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const wordLevelData: WordLevelType[] =
    apiData !== null
      ? apiData.map((data: any, index: number) => {
          const wordLevel: WordLevelType = {
            id: pageData.totalCount - pageData.pageSize * (pageData.currentPage - 1) - index,
            projectId: data.projectId,
            wordLevelId: data.wordLevelId,
            wordLevelSequence: data.wordLevelSequence,
            wordLevelName: data.wordLevelName,
            projectName: data.projectName,
            isService: data.isService,
            regBy: data.regBy,
            regDate: getDateTime(data.regDate),
            totalCount: data.totalCount,
          };

          return wordLevel;
        })
      : null;

  // 단어레벨 정보가 없을 경우 처리하는 컴포넌트
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
      <Typography variant="h6">해당 검색에 대한 단어레벨이 없습니다.</Typography>
    </Box>
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'단어레벨 리스트'}
            subtitle={'단어레벨 리스트입니다'}
            maincategory={'문제관리'}
            subcategory={'단어레벨관리'}
            setPageNo={setPageNo}
            setSearchWord={setSearchWord}
            pageName="word_level"
          />
          <SearchHeaderPopup
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            pageNo={pageNo}
            setPageNo={setPageNo}
            pageName="word_level"
          />

          {wordLevelData !== null ? (
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
                rows={wordLevelData}
                columns={columns}
                disableSelectionOnClick
                components={{ Pagination: PaginationSimple }}
                componentsProps={{
                  pagination: {
                    totalPage: pageData.totalPage,
                    pageNo: pageNo,
                    setPageNo: setPageNo,
                    pageName: 'word_level',
                  },
                }}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              />
            </>
          ) : (
            renderNoResult
          )}
        </Card>
        {/* <EditPopup id={wordLevelId} /> */}
      </Grid>
    </Grid>
  );
};

// const getSearchWordLevel = async (pageNo: number, searchWord: string, wordLevelId: number) => {
//   const page = pageNo == null ? 1 : pageNo;

//   try {
//     const res = await Api.get(`${apiConfig.apiEndpoint}/project/${wordLevelId}`, {
//       data: { searchWord, pageNo: page, pageSize: 10, totalData: false },
//     });

//     const id = res.data.items[0].wordLevelId;
//     console.log('qqqq', res.data.items);
//     console.log('클릭한 단어레벨아이디값', id);
//     router.replace(`/project/list?wordLevelId=${id}`);

//     return id;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const serverSideProps: GetServerSideProps = async (context) => {
//   const { pageNo, searchWord, wordLevelId } = context.query;

//   const result = await getSearchWordLevel(
//     Number(pageNo),
//     searchWord as string,
//     Number(wordLevelId),
//   );

//   const apiData: ProjectType = result === undefined ? null : result.items;
//   const pageData: PageType =
//     result === undefined
//       ? {
//           currentPage: 1,
//           pageSize: 1,
//           totalCount: 0,
//           totalPage: 1,
//         }
//       : {
//           currentPage: result.currentPage,
//           pageSize: result.pageSize,
//           totalCount: result.totalCount,
//           totalPage: result.totalPage,
//         };

//   return {
//     props: {
//       apiData,
//       pageData,
//     },
//   };
// };

//단어레벨 조회 api 호출
export const getAllWordLevelList = async (pageNo: number, searchWord: string) => {
  const page = pageNo == null ? 1 : pageNo;
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/word_level`, {
      data: { searchWord, pageNo: page, pageSize: 10, totalData: false, isTotal: false },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pageNo, searchWord } = context.query;

  const result = await getAllWordLevelList(Number(pageNo), searchWord as string);

  const apiData: WordLevelType = result === undefined ? null : result.items;
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

export default WordLevelList;
