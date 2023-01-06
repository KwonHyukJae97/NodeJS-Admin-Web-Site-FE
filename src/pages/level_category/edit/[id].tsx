import LevelCategoryEditPage from 'src/views/levelCategory/edit/LevelCategoryEditPage';

// ** Types Imports
import { useRouter } from 'next/router';

// 레벨 카테고리 수정 페이지
const LevelCategoryEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  return <LevelCategoryEditPage id={String(id)} />;
};
export default LevelCategoryEdit;
