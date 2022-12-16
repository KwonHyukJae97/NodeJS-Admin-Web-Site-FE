// ** Next Imports
import { useRouter } from 'next/router';

// ** MUI Imports
import Pagination from '@mui/material/Pagination';

// props 타입 정의
interface PaginationSimpleProps {
  totalPage: number;
  pageNo: number;
  setPageNo: (value: number) => void;
  pageName: string;
}

// 페이징 UI 컴포넌트
const PaginationSimple = (props: PaginationSimpleProps) => {
  // ** Props
  const { totalPage, pageNo, setPageNo, pageName } = props;

  // ** Hooks
  const router = useRouter();

  // 페이지 번호 클릭 시 호출
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
    if (pageName !== 'notice' && pageName !== 'faq') {
      router.push(`/${pageName}/list/?pageNo=${value}`);
    }
  };

  return (
    <div className="demo-space-y">
      <Pagination count={totalPage} sx={{ mt: 2 }} page={pageNo} onChange={handleChange} />
    </div>
  );
};

export default PaginationSimple;
