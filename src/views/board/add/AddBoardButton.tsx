// ** Next Imports
import Link from 'next/link';

// ** Mui Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Plus } from 'mdi-material-ui';
import Typography from '@mui/material/Typography';

// props 타입 정의
interface AddBoardButtonProps {
  pageName: string;
}

// 게시글 등록 버튼 UI 컴포넌트
const AddBoardButton = ({ pageName }: AddBoardButtonProps) => {
  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        mt: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Link href={`/${pageName}/add`} passHref>
        <Button
          sx={{ mr: 10, mb: 2, padding: '10px 18px' }}
          variant="contained"
          startIcon={<Plus />}
        >
          <Typography variant="subtitle2" style={{ color: 'white', fontWeight: 700 }}>
            등록
          </Typography>
        </Button>
      </Link>
    </Box>
  );
};

export default AddBoardButton;
