// ** React Imports
import { useEffect, useState } from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// ** Icons Imports
import { Account, AccountKey } from 'mdi-material-ui';

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar';

// ** Types
import { CompanyLayoutProps, CompanyType } from 'src/types/apps/companyTypes';

// ** axios
import axios from 'axios';

// ** Config
import apiConfig from 'src/configs/api';

// ** moment
import moment from 'moment';

// 회원사 정보 상세 페이지
const CompanyView = ({ company_id }: CompanyLayoutProps) => {
  console.log('viewpage:', company_id);

  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false),
    [error, setError] = useState<boolean>(false),
    [data, setData] = useState<null | CompanyType>(null);

  useEffect(() => {
    axios
      .get(`${apiConfig.apiEndpoint}/company/1`)
      .then((res) => {
        res.data.forEach((company: CompanyType) => {
          const companyData: CompanyType = {
            company_id: company.company_id,
            company_code: company.company_code,
            company_name: company.company_name,
            user_count: company.user_count,
            admin_count: company.admin_count,
            business_number: company.business_number,
            reg_date: moment(company.reg_date).format('YYYY-MM-DD'),
          };
          setData(companyData);
        });

        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  }, [company_id]);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h3" sx={{ mb: 4, mr: 3 }}>
                  {data.company_name}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    sx={{ mr: 1, mb: 4 }}
                    size="small"
                    onClick={handleEditClickOpen}
                  >
                    수정
                  </Button>
                </Box>
              </Box>
            </CardContent>

            <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 10, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ mr: 4, width: 44, height: 44 }}
                  >
                    <Account />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2">사용자 수</Typography>
                    <Typography variant="h5" sx={{ lineHeight: 1.3 }}>
                      {data.user_count} 명
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    sx={{ mr: 4, width: 44, height: 44 }}
                  >
                    <AccountKey />
                  </CustomAvatar>
                  <Box>
                    <Typography variant="body2">관리자 수</Typography>
                    <Typography variant="h5" sx={{ lineHeight: 1.3 }}>
                      {data.admin_count} 명
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant="h6">회원사 정보</Typography>
              <Divider sx={{ mt: 4 }} />
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    회원사 코드:
                  </Typography>
                  <Typography variant="body2">{data.company_code}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    사업자번호:
                  </Typography>
                  <Typography variant="body2">{data.business_number}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    등록일:
                  </Typography>
                  <Typography variant="body2">{data.reg_date}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" sx={{ mr: 2 }} onClick={handleEditClose}>
                확인
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby="user-view-edit"
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby="user-view-edit-description"
            >
              <DialogTitle
                id="user-view-edit"
                sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}
              >
                회원사 이름 수정
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  variant="body2"
                  id="user-view-edit-description"
                  sx={{ textAlign: 'center', mb: 7 }}
                >
                  회원사 이름을 수정하시려면 아래 내용을 입력해주세요.
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="회원사 이름" defaultValue={'ABC EDU'} />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="contained" sx={{ mr: 1 }} onClick={handleEditClose}>
                  수정
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleEditClose}>
                  취소
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Invoice with the id: {company_id} does not exist. Please check the list of invoices:{' '}
            <Link href="/company/list">목록으로</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default CompanyView;
