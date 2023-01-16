// ** React Imports
import React, { SyntheticEvent, useEffect } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** MUI Imports
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { styled } from '@mui/material/styles';
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import Box from '@mui/material/Box';

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: 'transparent',
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    minHeight: 38,

    // minWidth: 110,
    minWidth: 80,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

// props 타입 정의
interface TabsCustomButtonCommentProps {
  searchKey: string;
  searchWord: string;
  setSearchWord: (value: string) => void;
  pageNo: number;
  setPageNo: (value: number) => void;
  pageName: string;
}

// Tab 버튼 컴포넌트
const TabsCustomButtonComment = (props: TabsCustomButtonCommentProps) => {
  const { searchKey, searchWord, setSearchWord, pageNo, setPageNo, pageName } = props;

  // ** Hooks
  const router = useRouter();

  // state 동기 처리
  useEffect(() => {
    setPageNo(1);
    searchWord != ''
      ? router.push(
          `/${pageName}/list/?pageNo=${pageNo}&searchWord=${searchWord}&searchKey=${searchKey}`,
        )
      : router.push('/comment/list');
  }, [searchWord]);

  // 탭 버튼 클릭 시 호출
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setSearchWord(newValue);
  };

  return (
    <Box>
      <TabContext value={searchWord}>
        <TabList sx={{ ml: 2.5 }} onChange={handleChange}>
          <Tab value="true" label="답변완료" />
          <Tab value="false" label="답변대기" />
        </TabList>
      </TabContext>
    </Box>
  );
};

export default TabsCustomButtonComment;
