// ** Demo Components Imports
import FaqViewPage from 'src/views/board/view/FaqViewPage';
import { useRouter } from 'next/router';

// FAQ 상세 페이지
const FaqView = () => {
  const router = useRouter();
  const { id } = router.query;

  return <FaqViewPage id={Number(id)} />;
};

export default FaqView;
