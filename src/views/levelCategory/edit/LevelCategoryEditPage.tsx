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
import Paper from '@mui/material/Paper';

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

const grid = 8;
const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // dragging시 배경색 변경
  background: isDragging ? 'lightgreen' : 'lightgrey',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: any) => ({
  // background: isDraggingOver ? 'lightgrey' : 'white',
  padding: grid,
  width: 250,
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
          levelSequence: value.levelSequence,
          levelStepStart: value.levelStepStart,
          levelStepEnd: value.levelStepEnd,
          wordLevelName: value.wordLevelName,
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
          <Box sx={{ float: 'left', m: 10, width: 100 }}>
            <Grid>
              <Typography variant="subtitle1">학습/레벨</Typography>
            </Grid>
            <Grid>
              <Typography variant="subtitle1">레벨카테고리명</Typography>
            </Grid>

            {levelStep.map((step) => (
              <Typography variant="subtitle2" key={step}>
                {step}
              </Typography>
            ))}

            <DragDropContext onDragEnd={handleDropChange}>
              <Droppable droppableId="first-box">
                {(provided: any, snapshot: any) => (
                  <Box
                    className="top-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    <Grid>
                      {levelCategoryItem.map((item: any, index: number) => (
                        <>
                          <Draggable
                            key={item.levelCategoryId}
                            draggableId={item.levelCategoryId}
                            index={index}
                          >
                            {(provided: any) => (
                              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs>
                                  <Item
                                    className="box-container"
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                  >
                                    {item.wordLevelName}
                                  </Item>
                                </Grid>
                              </Grid>
                            )}
                          </Draggable>
                        </>
                      ))}
                      {provided.placeholder}
                    </Grid>
                  </Box>
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
