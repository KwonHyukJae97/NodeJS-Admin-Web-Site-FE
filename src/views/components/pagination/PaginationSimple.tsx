// ** MUI Imports
import Pagination from '@mui/material/Pagination';
import { useRouter } from 'next/router';

// props 타입 정의
interface Props {
  totalPage: number;
  pageNo: number;
  setPageNo: (value: number) => void;
  searchWord: string;
}

// 페이징 UI 컴포넌트
const PaginationSimple = (props: Props) => {
  // ** Props
  const { totalPage, pageNo, setPageNo, searchWord } = props;

  // ** Hooks
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
    if (searchWord !== '') {
      router.push(`/board/notice/list/?pageNo=${value}&searchWord=${searchWord}`);
    } else {
      router.push(`/board/notice/list/?pageNo=${value}`);
    }
  };

  return (
    <div className="demo-space-y">
      <Pagination count={totalPage} sx={{ mt: 2 }} page={pageNo} onChange={handleChange} />
    </div>
  );
};

export default PaginationSimple;
