// ** React Imports
import { SyntheticEvent, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { styled } from '@mui/material/styles';
import MuiTabList, { TabListProps } from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';

import { CategoryType } from '../../../types/apps/boardTypes';

interface Props {
  categoryList: CategoryType[];
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
  // ** Props
  const { categoryList } = props;

  // ** State
  const [value, setValue] = useState<string>('1');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ ml: 16, mr: 16, mt: 6 }}>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="customized tabs example">
          <Tab value="1" label="전체" />
          <Tab value="2" label="결제" />
          <Tab value="3" label="상품" />
          <Tab value="4" label="이용" />
          <Tab value="5" label="라이센스" />
        </TabList>
        <TabPanel value="1">
          <Typography>전체 탭에 대한 내용</Typography>
        </TabPanel>
        <TabPanel value="2">
          <Typography>결제 탭에 대한 내용</Typography>
        </TabPanel>
        <TabPanel value="3">
          <Typography>상품 탭에 대한 내용</Typography>
        </TabPanel>
        <TabPanel value="4">
          <Typography>이용 탭에 대한 내용</Typography>
        </TabPanel>
        <TabPanel value="5">
          <Typography>라이센스에 대한 내용</Typography>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TabsCustomButton;
