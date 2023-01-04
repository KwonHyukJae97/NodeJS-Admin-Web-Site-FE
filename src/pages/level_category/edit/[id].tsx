import LevelCategoryEditPage from 'src/views/levelCategory/edit/LevelCategoryEditPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// ** Types Imports
import { useRouter } from 'next/router';

// 레벨 카테고리 수정 페이지
const LevelCategoryEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    //  <DndProvider backend={HTML5Backend}>
    <LevelCategoryEditPage id={String(id)} />
    // </DndProvider>
  );
};
export default LevelCategoryEdit;
