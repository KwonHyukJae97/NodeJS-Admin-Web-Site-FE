/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import Grid from '@mui/material/Grid';
import { useState } from 'react';

// ** Custom Components Imports

import PageLeftInHeader from 'src/@core/components/page-left-in-header';

// ** Demo Components Imports
import RoleCards from 'src/views/apps/roles/RoleCards';

const RolesComponent = () => {
  // ** State
  const [pageNo, setPageNo] = useState<number>(1),
    [searchWord, setSearchWord] = useState<string>('');

  return (
    <Grid container spacing={6}>
      <PageLeftInHeader
        title={'역할 목록'}
        maincategory={'운영관리'}
        subcategory={'역할'}
        setPageNo={setPageNo}
        setSearchWord={setSearchWord}
      />
      <Grid item xs={12} sx={{ mb: 5 }}>
        <RoleCards />
      </Grid>
    </Grid>
  );
};

export default RolesComponent;
