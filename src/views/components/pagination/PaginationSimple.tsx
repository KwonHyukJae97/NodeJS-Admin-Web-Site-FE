// ** Next Imports
import { useRouter } from 'next/router';

// ** MUI Imports
import Pagination from '@mui/material/Pagination';

// props 타입 정의
interface Props {
  totalPage: number;
  pageNo: number;
  setPageNo: (value: number) => void;
  pageName: string;
}

// 페이징 UI 컴포넌트
const PaginationSimple = (props: Props) => {
  // ** Props
  const { totalPage, pageNo, setPageNo, pageName } = props;

  // ** Hooks
  const router = useRouter();

  // 페이지 번호 클릭 시 실행되는 함수
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
    router.push(`/${pageName}/list/?pageNo=${value}`);
  };

  return (
    <div className="demo-space-y">
      <Pagination count={totalPage} sx={{ mt: 2 }} page={pageNo} onChange={handleChange} />
    </div>
  );
};

export default PaginationSimple;
