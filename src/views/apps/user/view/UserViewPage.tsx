// ** React Imports
import { useState, useEffect } from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

// ** Third Party Components
import axios from 'axios';

// ** Config
import apiConfig from 'src/configs/api';

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes';
import { UsersType } from 'src/types/apps/userTypes';

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft';
import UserViewRight from 'src/views/apps/user/view/UserViewRight';

// type Props = UserLayoutType & {
//   invoiceData: InvoiceType[];
// };

//그럼 여기서 그아이디값을 받아 아이디값으로 axios를 통해 상새정보를 요청
//요청받은 데이터를 UserViewLeft로 data로 넘겨서
//accountId 까지는 넘어오는데 벡엔드 axios호출이 안됨

const UserView = ({ accountId, invoiceData }: any) => {
  // ** State
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<null | UsersType>(null);

  useEffect(() => {
    axios
      .get(`${apiConfig.apiEndpoint}/auth/${accountId}`)
      .then((response) => {
        setData(response.data);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  }, [accountId]);

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft data={data} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight invoiceData={invoiceData} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            User with the id: {accountId} does not exist. Please check the list of users:{' '}
            <Link href="/apps/user/list">User List</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default UserView;
