// ** React Imports
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';
import { styled } from '@mui/material/styles';
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
    [levelStep, setLevelStep] = useState<any[]>([]),
    [levelCategoryItem, setLevelCategoryItem] = useState<any[]>([]);

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
          levelStepInfo: value.levelStepInfo,
        };

        return detailData;
      });
      setData(levelCategoryData);
      setLevelCategoryItem(levelCategoryData);

      const levelCategoryNameList: string[] = [];
      const tempStepList: number[] = [];
      const levelStepList: number[] = [];
      levelCategoryData.forEach((value: any) => {
        // 레벨 카테고리명 담기
        levelCategoryNameList.push(value.levelCategoryName);

        // 학습 단계 담기
        tempStepList.push(value.levelStepInfo[0].levelStepEnd);
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

  // 단어 레벨 표시 컴포넌트
  const WordLevelTableCell = () => {
    if (data) {
      data.forEach((item: any) => {
        const findLevelStepInfoId = item.levelStepInfo.filter((id: any) => {
          return item.levelCategoryId == id.levelStepInfoId;
        });

        console.log(
          'result1',
          findLevelStepInfoId[0].levelStepInfoId,
          'result2',
          item.levelCategoryId,
        );

        if (item.levelCategoryId === findLevelStepInfoId[0].levelStepInfoId) {
          console.log('test');

          return <TableCell>test</TableCell>;
        }
      });
    }
  };

  // 레벨 드롭 시 핸들링 메소드
  const handleDropChange = (result: any) => {
    if (!result.destination) return;
    console.log(result);
    const items = [...levelCategoryItem];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLevelCategoryItem(items);
  };

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
              m: 10,
              display: 'flex',
            }}
          >
            <DragDropContext onDragEnd={handleDropChange}>
              <Droppable droppableId="first-box">
                {(provided: any) => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">학습/레벨</TableCell>
                          {data &&
                            data.map((item: any, index: number) => (
                              <TableCell key={index} align="center">
                                {item.levelCategoryName}
                              </TableCell>
                            ))}
                        </TableRow>
                      </TableHead>

                      <TableBody
                        sx={{ minWidth: 650 }}
                        className="top-container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {/* 학습단계 Data */}
                        {levelStep.map((step: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{step}</TableCell>

                            {/* 레벨 카테고리 Data */}
                            {levelCategoryItem.map((item: any, index: number) => (
                              <Draggable
                                key={item.levelCategoryId}
                                draggableId={item.levelCategoryId}
                                index={index}
                              >
                                {(provided: any) => (
                                  <TableRow
                                    className="box-container"
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                  >
                                    {WordLevelTableCell()}
                                  </TableRow>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LevelCategoryEdit;
