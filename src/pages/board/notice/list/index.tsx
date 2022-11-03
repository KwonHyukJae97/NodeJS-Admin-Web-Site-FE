// ** React Imports
import { useEffect, useState } from 'react';

// ** Next Import
import { GetStaticProps, InferGetStaticPropsType } from 'next/types';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';

// ** Types Imports
import PageLeftInHeader from '../../../../@core/components/page-left-in-header';
import TableSearchHeader from '../../../../views/board/list/TableSearchHeader';

// ** axios
import axios from 'axios';
import apiConfig from '../../../../configs/api';
import moment from 'moment';
import { AlertCircleOutline } from 'mdi-material-ui';

// 게시글 타입 정의
interface BoardType {
  id: number;
  isTop: boolean;
  title: string;
  viewCnt: number;
  regDate: string;
}

// 테이블 행 데이터 타입 정의
interface CellType {
  row: BoardType;
}

// 테이블 컬럼 데이터 맵핑
const columns = [
  {
    flex: 0.06,
    minWidth: 60,
    field: 'id',
    headerName: '번호',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.isTop === true ? (
            <CustomChip
              skin="light"
              size="small"
              label="중요"
              color="primary"
              sx={{ '& .MuiChip-label': { lineHeight: '18px' }, fontWeight: 600 }}
            />
          ) : (
            <Typography variant="body2">{row.id}</Typography>
          )}
        </Box>
      );
    },
  },
  {
    flex: 0.4,
    minWidth: 200,
    field: 'title',
    headerName: '제목',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant="subtitle1" style={{ marginLeft: '20px' }}>
          {row.title}
        </Typography>
      );
    },
  },
  {
    flex: 0.04,
    minWidth: 60,
    headerName: '조회수',
    field: 'viewCnt',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.viewCnt}</Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerName: '등록일',
    field: 'regDate',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ margin: '0 auto' }}>
          <Typography variant="subtitle2">{row.regDate}</Typography>
        </Box>
      );
    },
  },
];

// 한국 시간으로 변경하는 메서드
export const getDateTime = (utcTime: Date) => {
  const kstTime = moment(utcTime).toDate();
  kstTime.setHours(kstTime.getHours() + 9);

  // yyyy-mm-dd 형식으로 반환
  return kstTime.toISOString().replace('T', ' ').substring(0, 11);
};

// 공지사항 목록 페이지
const NoticeList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [data, setData] = useState<BoardType[] | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchAction, setSearchAction] = useState<string>('');

  // API로 조회한 데이터 리스트를 타입에 맞게 할당(SSR)
  const noticeData: BoardType[] = apiData.map((data: any, idx: number) => {
    const notice: BoardType = {
      id: apiData.length - idx,
      isTop: data.isTop,
      title: data.board.title,
      viewCnt: data.board.viewCount,
      regDate: getDateTime(data.board.regDate),
    };

    return notice;
  });

  // ** Hooks
  // 검색어가 있는 상태에서 검색 버튼을 클릭할 때마다 화면 그려주도록 작성
  useEffect(() => {
    // 조회 권한과 역할에 대한 정보 임시 부여
    const role = '본사 관리자';
    const noticeGrant = '0|1|2';

    // 검색 결과에 대한 데이터 가져오는 함수
    const getSearchKeyword = async () => {
      try {
        const res = await axios.get(`${apiConfig.apiEndpoint}/notice`, {
          withCredentials: true,
          params: { role, noticeGrant, keyword: searchKeyword },
        });

        if (res.data && res.data.length) {
          setData(
            res.data.map((d: any, idx: number) => {
              const notice: BoardType = {
                id: res.data.length - idx,
                isTop: d.isTop,
                title: d.board.title,
                viewCnt: d.board.viewCount,
                regDate: getDateTime(d.board.regDate),
              };

              return notice;
            }),
          );
        } else {
          setData(null);
        }
      } catch (err) {
        console.log(err);
        setData(null);
      }
    };

    // 검색어가 있을 경우
    if (searchKeyword !== '') {
      getSearchKeyword();

      // 검색 결과 조회 후, 입력값 리셋
      setSearchKeyword('');
    } else {
      setData(noticeData);
    }
  }, [searchAction]);

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
      <Typography variant="h6">해당 검색에 대한 게시글이 없습니다.</Typography>
    </Box>
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <PageLeftInHeader
            title={'본사용 공지사항'}
            subtitle={'TenPick의 이벤트 및 업데이트 정보 등 다양한 소식을 알려드립니다.'}
            maincategory={'공지사항'}
            subcategory={'본사용'}
          />
          <TableSearchHeader
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            setSearchAction={setSearchAction}
          />
          {data !== null ? (
            <DataGrid
              autoHeight
              pagination
              rows={data}
              columns={columns}
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />
          ) : (
            renderNoResult
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

// Notice 조회 API 요청
export const getStaticProps: GetStaticProps = async () => {
  // 조회 권한과 역할에 대한 정보 임시 부여
  const role = '본사 관리자';
  const noticeGrant = '0|1|2';

  /* 서버사이드 렌더링 시, 브라우저와는 별개로 직접 쿠키를 넣어 요청해야하기 때문에 해당 작업 반영 예정 */
  // 현재는 테스트를 위해 backend 단에서 @UseGuard 주석 처리 후, 진행
  const res = await axios.get(`${apiConfig.apiEndpoint}/notice`, {
    withCredentials: true,
    params: { role, noticeGrant },
  });
  const apiData: BoardType = res.data;

  return {
    props: {
      apiData,
    },
  };
};

export default NoticeList;
