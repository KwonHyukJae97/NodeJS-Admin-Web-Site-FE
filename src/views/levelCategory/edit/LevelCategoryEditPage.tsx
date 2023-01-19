// ** React Imports
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// ** Types
import { LevelCategoryDetailType } from 'src/types/apps/levelTypes';

// ** Custom Components Imports
import LevelCategoryLeftInHeader from 'src/views/levelCategory/edit/LevelCategoryLeftInHeader';
import LevelCategoryDrawer from 'src/views/apps/levelCategory/shared-drawer/LevelCategoryDrawer';

// ** Config
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import searchAddOutline from '@iconify/icons-mdi/search-add-outline';
import { boolean } from 'yup';

// 레벨 카테고리 삭제 API 호출
// const deleteLevelCategory = async (id: number) => {
//   if (confirm('삭제 하시겠습니까?')) {
//     try {
//       await Api.delete(`${apiConfig.apiEndpoint}/levelCategory/${id}`, {
//         withCredentials: true,
//       });
//       alert('삭제가 완료되었습니다.');
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//       alert('삭제에 실패하였습니다.');
//     }
//   }
// };

// // 삭제 버튼 클릭 시 호출
// const handleDeleteLevelCategory = (id: number) => {
//   deleteLevelCategory(id);
// };

// 단어레벨 type 정의
interface wordLevelNameType {
  levelCategoryId: number;
  wordLevelName: string;
}

const LevelCategoryCell = (props: any, provided: any) => {
  const [isFirstCell, setFirstCell] = useState(false);
  const [isEmptyCell, setEmptyCell] = useState(false);
  const [levelInfo, setLevelInfo] = useState<any>({});

  useEffect(() => {
    setFirstCell(isFirstCellFunc(props.item, props.step));
    setEmptyCell(isEmptyCellFunc(props.item, props.step));

    const findWordLevelInfoDetail = props.item.wordLevelInfo
      .filter((wordLevelInfoDetail: any) => {
        return (
          wordLevelInfoDetail.levelStepStart <= props.step &&
          wordLevelInfoDetail.levelStepEnd >= props.step
        );
      })
      .pop();

    setLevelInfo(findWordLevelInfoDetail);
  }, []);

  // 단어 레벨 표시 컴포넌트
  const WordLevelTableCell = (item: any, step: number) => {
    const findWordLevelInfoDetail = item.wordLevelInfo
      .filter((wordLevelInfoDetail: any) => {
        return (
          wordLevelInfoDetail.levelStepStart <= step && wordLevelInfoDetail.levelStepEnd >= step
        );
      })
      .pop();

    return findWordLevelInfoDetail?.wordLevelName;
  };

  const isFirstCellFunc = (item: any, step: number): boolean => {
    const resultListLength = item.wordLevelInfo.filter((wordLevelInfoDetail: any) => {
      return wordLevelInfoDetail.levelStepStart == step;
    }).length;

    return resultListLength > 0;
  };

  const isEmptyCellFunc = (item: any, step: number): boolean => {
    // 현재 cell 이 어딘가에 속하고 첫번째인 경우, 아무데도 속하지 않는 경우
    const findWordLevelInfoDetail = item.wordLevelInfo
      .filter((wordLevelInfoDetail: any) => {
        return (
          wordLevelInfoDetail.levelStepStart <= step && wordLevelInfoDetail.levelStepEnd >= step
        );
      })
      .pop();

    return !findWordLevelInfoDetail;
  };

  // const getRowSpan =

  return (
    <>
      {/* {isEmptyCell || isFirstCell ? ( */}
      <Draggable
        key={props.item.levelDetailId}
        draggableId={props.item.levelDetailId}
        index={props.index}
      >
        {(provided: any) => (
          <TableCell
            sx={{ border: 1, borderColor: 'lightgrey' }}

            // rowSpan={isFirstCell ? levelInfo.levelStepEnd - levelInfo.levelStepStart + 1 : 1}
          >
            <Box
              align="center"
              sx={{ border: 1, borderColor: 'lightgrey' }}
              {...props}
              className="box-container"
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
            >
              {levelInfo?.wordLevelName}
            </Box>
          </TableCell>
        )}
      </Draggable>
      {/* ) : null} */}
    </>
  );
};

// 레벨 카테고리 수정 페이지
const LevelCategoryEdit = ({ id }: any) => {
  // ** State
  const [data, setData] = useState<any[]>([]),
    [levelStep, setLevelStep] = useState<any[]>([]),
    [levelCategoryNameData, setLevelCategoryNameData] = useState<any[]>([]),
    [wordLevelNameData, setWordLevelNameData] = useState<string>(''),
    [isHover, setIsHover] = useState<boolean>(false),
    [sendCategoryOpen, setSendCategoryOpen] = useState<boolean>(false);

  useEffect(() => {
    getDetailLevelCategory(id);
  }, []);

  const toggleLevelCategoryDrawer = () => setSendCategoryOpen(!sendCategoryOpen);

  // 레벨 카테고리 상세 정보 조회 API 요청
  const getDetailLevelCategory = async (id: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/level_category/${id}`);
      const levelCategoryData = res.data.map((value: any) => {
        const detailData = {
          levelCategoryId: value.levelCategoryId,
          levelCategoryName: value.levelCategoryName,
          levelDetailId: value.levelDetailId,
          levelSequence: value.levelSequence,
          wordLevelInfo: value.wordLevelInfo,
        };

        return detailData;
      });
      setData(levelCategoryData);

      // 학습 단계 담기
      const levelStepList: number[] = [];
      for (let index = 1; index <= 30; index++) {
        levelStepList.push(index);
      }
      setLevelStep(levelStepList);

      // 레벨 카테고리명 담기
      const levelCategoryNameList: string[] = [];
      levelCategoryData.forEach((value: any) => {
        if (!levelCategoryNameList.includes(value.levelCategoryName)) {
          levelCategoryNameList.push(value.levelCategoryName);
          setLevelCategoryNameData(levelCategoryNameList);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  console.log('data', data);

  // 단어 레벨 표시 컴포넌트
  const WordLevelTableCell = (item: any, step: number) => {
    // let wordLevelName = '';

    const findWordLevelInfoDetail = item.wordLevelInfo
      .filter((wordLevelInfoDetail: any) => {
        return (
          wordLevelInfoDetail.levelStepStart <= step && wordLevelInfoDetail.levelStepEnd >= step
        );
      })
      .pop();

    return findWordLevelInfoDetail?.wordLevelName;

    // levelStep.forEach((item: any) => {
    //   data.map((value) => {
    //     if (value.wordLevelInfo[0].levelStepStart == item) {
    //       for (let index = 1; index <= value.wordLevelInfo[0].levelStepEnd; index++) {
    //         wordLevelName = value.wordLevelInfo[0].wordLevelName;
    //       }

    //       return wordLevelName;
    //     }
    //   });
    // });

    // return wordLevelName;
  };

  // 레벨 드롭 시 핸들링 메소드
  const handleDropChange = (result: any) => {
    if (!result.destination) return;
    console.log(result);
    const items = [...data];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData(items);
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
                          <TableCell
                            align="center"
                            sx={{ pr: 7, border: 1, borderColor: 'lightgrey' }}
                          >
                            학습/레벨
                          </TableCell>
                          {levelCategoryNameData.map((name: any, idx: number) => (
                            <TableCell
                              sx={{ border: 1, borderColor: 'lightgrey' }}
                              key={idx}
                              align="center"
                              onMouseOver={() => setIsHover(true)}
                              onMouseOut={() => setIsHover(false)}
                            >
                              {name}
                              <Button
                                sx={{ minWidth: 0, p: 1.25 }}
                                onClick={toggleLevelCategoryDrawer}
                              >
                                {isHover ? (
                                  <Icon icon={searchAddOutline} color="grey" width="25" />
                                ) : null}
                              </Button>
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
                        {levelStep.map((step: number) => (
                          <TableRow key={step}>
                            <TableCell
                              align="center"
                              sx={{ pr: 15, border: 1, borderColor: 'lightgrey' }}
                            >
                              {step}
                            </TableCell>

                            {/* 레벨 카테고리 Data */}
                            {data &&
                              data.map((item: any, index: number) => (
                                // <Draggable
                                //   key={item.levelDetailId}
                                //   draggableId={item.levelDetailId}
                                //   index={index}
                                // >
                                // {(provided: any) => (
                                <>
                                  {}
                                  {/* <TableCell
                                        align="center"
                                        className="box-container"
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                        {...provided.draggableProps}
                                      >
                                        {WordLevelTableCell(item, step)}
                                      </TableCell> */}
                                  <LevelCategoryCell
                                    provided={provided}
                                    index={index}
                                    item={item}
                                    step={step}
                                  />
                                </>
                                // )}
                                // </Draggable>
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
            <LevelCategoryDrawer open={sendCategoryOpen} toggle={toggleLevelCategoryDrawer} />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LevelCategoryEdit;
