// ** MUI Imports
import Pagination from '@mui/material/Pagination';
import { useRouter } from 'next/router';

// props 타입 정의
interface Props {
  totalPage: number;
  pageNo: number;
  setPageNo: (value: number) => void;
  searchWord: string;
  boardType: string;
  searchKey: string;
}

// 페이징 UI 컴포넌트
const PaginationSimple = (props: Props) => {
  // ** Props
  const { totalPage, pageNo, setPageNo, searchWord, boardType, searchKey } = props;

  // ** Hooks
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
    if (searchWord !== '') {
      router.push(
        `/board/${boardType}/list/?pageNo=${value}&searchWord=${searchWord}&searchKey=${searchKey}`,
      );
    } else {
      router.push(`/board/${boardType}/list/?pageNo=${value}&searchKey=${searchKey}`);
    }
  };

  return (
    <div className="demo-space-y">
      <Pagination count={totalPage} sx={{ mt: 2 }} page={pageNo} onChange={handleChange} />
    </div>
  );
};

export default PaginationSimple;
