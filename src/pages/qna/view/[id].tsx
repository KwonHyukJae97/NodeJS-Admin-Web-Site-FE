// ** Demo Components Imports
import QnaViewPage from 'src/views/board/view/QnaViewPage';
import { useRouter } from 'next/router';

// QnA 상세 페이지
const QnaView = () => {
  const router = useRouter();
  const { id } = router.query;

  return <QnaViewPage id={Number(id)} />;
};

export default QnaView;
