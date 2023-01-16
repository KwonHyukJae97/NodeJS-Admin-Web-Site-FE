// ** Demo Components Imports
import { useRouter } from 'next/router';
import CommentViewPage from 'src/views/board/view/CommentViewPage';

// Comment 상세 페이지
const CommentView = () => {
  const router = useRouter();
  const { id } = router.query;

  return <CommentViewPage id={Number(id)} />;
};

export default CommentView;
