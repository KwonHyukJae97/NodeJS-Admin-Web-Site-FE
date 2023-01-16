// ** MUI Imports
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';

// ** Icons Imports
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { studyTypeCodeType } from 'src/types/apps/levelTypes';

// props 타입 정의
interface TableSearchHeaderProps {
  pageNo: number;
  setPageNo: (value: number) => void;
  searchKey: string | null;
  setSearchKey: (value: string) => void;
  pageName: string;
  categoryData: any;
}

// levelCategory 테이블 헤더 컴포넌트 (검색창)
const TableSearchHeader = (props: TableSearchHeaderProps) => {
  // ** Props
  const { searchKey, setSearchKey, pageNo, setPageNo, pageName, categoryData } = props;
  const [categoryType, setCategoryType] = useState(' ');

  // ** Hooks
  const router = useRouter();

  // 영역 검색 카테고리 정의
  const studyCategoryData = categoryData.map((data: any) => {
    const category: studyTypeCodeType = {
      studyTypeCode: data.studyTypeCode,
      studyTypeName: data.studyTypeName,
    };

    return category;
  });

  // 영역 검색 카테고리 스크롤바 생성
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 3;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSearchKey(event.target.value);
    setCategoryType(event.target.value);
    setPageNo(1);
    router.push(`/${pageName}/list/?pageNo=${pageNo}&searchKey=${searchKey}`);
  };

  // 검색 후 페이지 번호 상태가 바뀔 때마다 요청
  useEffect(() => {
    router.push(`/${pageName}/list/?pageNo=${pageNo}&searchKey=${searchKey}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, categoryType, searchKey]);

  return (
    <Box sx={{ ml: 14, mr: 14, mt: 6 }}>
      <Typography variant="h6" sx={{ ml: 0.5, mb: 2 }}>
        검색
      </Typography>
      <FormControl sx={{ flexWrap: 'wrap', flexDirection: 'row' }}>
        <Select
          value={categoryType || ' '}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'Without label' }}
          size="small"
          sx={{ mt: 2, mb: 4 }}
          MenuProps={MenuProps}
        >
          <MenuItem value=" ">전체</MenuItem>
          {studyCategoryData.map((category: any) => (
            <MenuItem key={category.studyTypeCode} value={category.studyTypeCode}>
              {category.studyTypeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TableSearchHeader;
