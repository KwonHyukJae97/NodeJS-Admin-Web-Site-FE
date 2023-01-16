// ** Demo Components Imports
import FaqEditPage from 'src/views/board/edit/FaqEditPage';
import { useRouter } from 'next/router';

// FAQ 수정 페이지
const FaqEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  return <FaqEditPage id={Number(id)} />;
};

export default FaqEdit;
