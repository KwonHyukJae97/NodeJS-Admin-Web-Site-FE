// ** React Imports
import { useCallback, useEffect, useState } from 'react';

import { useDrag, useDrop } from 'react-dnd';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { AlertCircleOutline } from 'mdi-material-ui';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';
import { mdiSquareEditOutline, mdiTrashCanOutline } from '@mdi/js';

// ** Types
import { LevelCategoryDetailType } from 'src/types/apps/levelTypes';

// ** Custom Components Imports
import LevelCategoryLeftInHeader from 'src/views/levelCategory/edit/LevelCategoryLeftInHeader';

// ** Config
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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

// 레벨 카테고리 수정 페이지
const LevelCategoryEdit = ({ id }: any) => {
  // ** State
  const [data, setData] = useState<LevelCategoryDetailType>(),
    [levelCategoryName, setLevelCategoryName] = useState<any[]>([]),
    [levelStep, setLevelStep] = useState<any[]>([]);

  useEffect(() => {
    getDetailLevelCategory(id);
  }, []);

  // 레벨 카테고리 상세 정보 조회 API 요청
  const getDetailLevelCategory = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/level_category/${id}`);
      const levelCategoryData = res.data.map((value: any) => {
        const detailData = {
          levelCategoryId: value.levelCategoryId,
          levelCategoryName: value.levelCategoryName,
          levelSequence: value.levelSequence,
          levelStepStart: value.levelStepStart,
          levelStepEnd: value.levelStepEnd,
          wordLevelName: value.wordLevelName,
        };

        return detailData;
      });
      setData(levelCategoryData);

      const levelCategoryNameList: string[] = [];
      const tempStepList: number[] = [];
      const levelStepList: number[] = [];
      levelCategoryData.forEach((value: any) => {
        // 레벨 카테고리명 담기
        levelCategoryNameList.push(value.levelCategoryName);

        // 학습 단계 담기
        tempStepList.push(value.levelStepEnd);
      });
      setLevelCategoryName(levelCategoryNameList);
      const lastLevelStep = Math.max.apply(null, tempStepList);
      for (let index = 1; index <= lastLevelStep; index++) {
        levelStepList.push(index);
      }
      setLevelStep(levelStepList);
    } catch (err) {
      console.log(err);
    }
  };
  console.log('data', data);

  // const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
  //   if(data) {
  //     setData((prevCards: Item[]) =>
  //     update(prevCards, {
  //       $splice: [
  //         [dragIndex, 1],
  //         [hoverIndex, 0, prevCards[dragIndex] as Item],
  //       ],
  //     }),
  //   )
  //   }

  // }, [])

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

          <Box
            sx={{
              mt: 10,
              mb: 2,
              ml: 15,
              mr: 15,
              display: 'flex',
            }}
          >
            <TableContainer ref={(node) => resizeDrop(node)}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">학습/레벨</TableCell>
                    {levelCategoryName.map((name) => (
                      <TableCell key={name} align="center">
                        {name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {levelStep.map((step: any) => (
                    <TableRow key={step}>
                      <TableCell align="center">{step}</TableCell>
                      {data &&
                        data.map((item: any, index: number) => (
                          <>
                            <TableCell align="center">{item.wordLevelName}</TableCell>
                          </>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LevelCategoryEdit;
