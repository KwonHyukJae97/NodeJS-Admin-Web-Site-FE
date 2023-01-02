// ** Demo Components Imports
import NoticeViewPage from 'src/views/board/view/NoticeViewPage';

// ** Types Imports
import { useRouter } from 'next/router';

// 공지사항 상세 페이지
const NoticeView = () => {
  const router = useRouter();
  const { id } = router.query;

  return <NoticeViewPage id={Number(id)} />;
};

export default NoticeView;
