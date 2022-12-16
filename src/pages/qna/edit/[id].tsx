// ** Demo Components Imports
import QnaEditPage from 'src/views/board/edit/QnaEditPage';
import { useRouter } from 'next/router';

// QnA 수정 페이지
const QnaEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  return <QnaEditPage id={Number(id)} />;
};

export default QnaEdit;
