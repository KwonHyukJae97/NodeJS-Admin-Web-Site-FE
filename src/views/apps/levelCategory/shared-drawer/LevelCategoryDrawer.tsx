// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// ** Icons Imports
import Close from 'mdi-material-ui/Close';

// ** React-beautiful-dnd Imports
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

// ** Config
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';

// 토글 type 정의
interface Props {
  open: boolean;
  toggle: () => void;
}

// header 스타일 지정
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}));

// 학습 레벨 리스트 페이지
const LevelCategoryDrawer = ({ open, toggle }: Props) => {
  // ** State
  const [wordLeveldata, setWordLevelData] = useState<any[]>([]);

  useEffect(() => {
    getAllWordLevel();
  }, [open]);

  // 단어 레벨 목록 조회 API 요청
  const getAllWordLevel = async () => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/word_level`);
      const wordLevelListData = res.data.items.map((value: any) => {
        const detailData = {
          wordLevelId: value.wordLevelId,
          wordLevelName: value.wordLevelName,
          wordLevelSequence: value.wordLevelSequence,
        };

        return detailData;
      });
      setWordLevelData(wordLevelListData);
    } catch (err) {
      console.log(err);
    }
  };

  // 레벨 드롭 시 핸들링 메소드
  const handleDropChange = (result: any) => {
    if (!result.destination) return;
    console.log(result);
    const items = [...wordLeveldata];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWordLevelData(items);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={toggle}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      ModalProps={{ keepMounted: true }}
    >
      <Header>
        <Typography variant="h6">학교</Typography>
        <Close fontSize="small" onClick={toggle} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">No</TableCell>
                  <TableCell align="center">레벨</TableCell>
                </TableRow>
              </TableHead>
              <DragDropContext onDragEnd={handleDropChange}>
                <Droppable droppableId="first-box">
                  {(provided: any) => (
                    <TableBody
                      className="top-container"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {wordLeveldata.map((item: any, index: number) => (
                        <Draggable
                          key={item.wordLevelId}
                          draggableId={item.wordLevelId}
                          index={index}
                        >
                          {(provided: any) => (
                            <TableRow
                              className="box-container"
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">{item.wordLevelName}</TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </TableContainer>
        </FormControl>
      </Box>
    </Drawer>
  );
};

export default LevelCategoryDrawer;
