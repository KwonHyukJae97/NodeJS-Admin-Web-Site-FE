// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CategoryType } from '../../../types/apps/boardTypes';

interface Props {
  categoryList: CategoryType[];
}

const TabCustomButton = (props: Props) => {
  // ** Props
  const { categoryList } = props;

  // ** State
  const [clickStatus, setClickStatus] = useState<string>('전체');

  return (
    <Box sx={{ ml: 16, mr: 16, mt: 6 }}>
      {categoryList.map((category) => {
        return (
          <Button variant="contained" key={category.categoryId}>
            {category.categoryName}
          </Button>
        );
      })}
    </Box>
  );
};

export default TabCustomButton;
