// ** React Imports
import { SyntheticEvent, useEffect } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** MUI Imports
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { styled } from '@mui/material/styles';
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import Box from '@mui/material/Box';

// ** Types
import { CategoryType } from 'src/types/apps/boardTypes';

interface Props {
  categoryList: CategoryType[];
  searchKey: string;
  setSearchKey: (value: string) => void;
  setSearchWord: (value: string) => void;
}

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

const TabsCustomButton = (props: Props) => {
  const { categoryList, searchKey, setSearchKey, setSearchWord } = props;

  // ** State
  // const [value, setValue] = useState<string>('전체');

  // ** Hooks
  const router = useRouter();

  // state 동기 처리
  useEffect(() => {
    searchKey !== '' ? router.push(`/faq/list/?searchKey=${searchKey}`) : router.push('/faq/list');
    setSearchWord('');
  }, [searchKey]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setSearchKey(newValue);
  };

  return (
    <Box sx={{ ml: 16, mr: 16, mt: 4, display: 'flex' }}>
      <TabContext value={searchKey}>
        <TabList onChange={handleChange}>
          <Tab value="" label="전체" />
        </TabList>
      </TabContext>

      {categoryList.map((category) => {
        return (
          <TabContext value={searchKey} key={category.categoryId}>
            <TabList onChange={handleChange}>
              <Tab value={category.categoryName} label={category.categoryName} />
            </TabList>
            {/*<TabPanel value="1">*/}
            {/*  <Typography>전체 탭에 대한 내용</Typography>*/}
            {/*</TabPanel>*/}
          </TabContext>
        );
      })}
    </Box>
  );
};

export default TabsCustomButton;
