// ** Demo Components Imports
import NoticeEditPage from 'src/views/board/edit/NoticeEditPage';

// ** Types Imports
import { useRouter } from 'next/router';

// 공지사항 수정 페이지
const NoticeEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  return <NoticeEditPage id={Number(id)} />;
};

export default NoticeEdit;
