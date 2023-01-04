// ** React Imports
import { useEffect, useState } from 'react';

import { useDrag, useDrop } from 'react-dnd';

// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { AlertCircleOutline } from 'mdi-material-ui';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';
import { mdiSquareEditOutline, mdiTrashCanOutline } from '@mdi/js';

// ** Custom Components Imports
import TableSearchHeader from 'src/views/levelCategory/list/TableSearchHeader';
import PageLeftInHeader from 'src/@core/components/page-left-in-header';
import PaginationSimple from 'src/views/components/pagination/PaginationSimple';

// ** Types
import { LevelCategoryDetailType } from 'src/types/apps/levelTypes';

// ** Custom Components Imports
import LevelCategoryLeftInHeader from 'src/views/levelCategory/edit/LevelCategoryLeftInHeader';

// ** Config
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';

// 레벨 카테고리 삭제 API 호출
const deleteLevelCategory = async (id: number) => {
  if (confirm('삭제 하시겠습니까?')) {
    try {
      await Api.delete(`${apiConfig.apiEndpoint}/levelCategory/${id}`, {
        withCredentials: true,
      });
      alert('삭제가 완료되었습니다.');
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert('삭제에 실패하였습니다.');
    }
  }
};

// 삭제 버튼 클릭 시 호출
const handleDeleteLevelCategory = (id: number) => {
  deleteLevelCategory(id);
};

// 테이블 컬럼 데이터 맵핑
const columns = [];

// 레벨 카테고리 수정 페이지
const LevelCategoryEdit = ({ id }: any) => {
  // ** State
  const [data, setData] = useState<LevelCategoryDetailType>();

  useEffect(() => {
    getDetailLevelCategory(id);
  }, []);

  // 레벨 카테고리 상세 정보 조회 API 요청
  const getDetailLevelCategory = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/level_category/${id}`);
      const levelCategoryData = res.data.map((value: any) => {
        const detailData: LevelCategoryDetailType = {
          levelCategoryId: value.levelCategoryId,
          levelCategoryName: value.levelCategoryName,
          levelSequence: value.levelSequence,
          levelStepStart: value.levelStepStart,
          levelStepEnd: value.levelStepEnd,
        };

        return detailData;
      });
      setData(levelCategoryData);
    } catch (err) {
      console.log(err);
    }
  };
  console.log('data', data);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <LevelCategoryLeftInHeader
            title={'레벨 카테고리 정보'}
            maincategory={'문제관리'}
            subcategory={'레벨 카테고리'}
            subject={'수정'}
          />
          <>
            <Box
              sx={{
                mb: 2,
                ml: 15,
                display: 'flex',
              }}
            >
              <Typography> test</Typography>
            </Box>
          </>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LevelCategoryEdit;
