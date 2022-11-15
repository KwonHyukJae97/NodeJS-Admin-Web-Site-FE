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
import { styled } from '@mui/material/styles';

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
import router from 'next/router';

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.common.white,
}));

// 회원사 정보 상세 페이지
const CompanyDetail = ({ id }: CompanyLayoutProps) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false),
    [error, setError] = useState<boolean>(false),
    [data, setData] = useState<null | CompanyType>(null),
    [value, setValue] = useState<string>('');

  // 회원사 상세 정보 API 호출
  useEffect(() => {
    axios
      .get(`${apiConfig.apiEndpoint}/company/${id}`, { params: { id } })
      .then((res) => {
        res.data.forEach((company: CompanyType) => {
          const companyData: CompanyType = {
            companyId: company.companyId,
            companyCode: company.companyCode,
            companyName: company.companyName,
            userCount: company.userCount,
            adminCount: company.adminCount,
            businessNumber: company.businessNumber,
            regDate: moment(company.regDate).format('YYYY-MM-DD'),
          };
          setData(companyData);
        });

        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  }, [id]);

  // 회원사 정보 수정 API호출
  const updateCompany = async () => {
    if (confirm('수정 하시겠습니까?')) {
      try {
        /* eslint-disable */
        const req = await axios.patch(`${apiConfig.apiEndpoint}/company/${id}`, {
          companyName: value,
        });
        alert('수정이 완료 되었습니다.');
        location.reload();
      } catch (err: any) {
        console.log('err', err.response.data);
        alert('수정에 실패 하였습니다.');
      }
    }
  };

  // 회원사 정보 삭제 API호출
  const deleteCompany = async () => {
    if (confirm('삭제 하시겠습니까?')) {
      try {
        /* eslint-disable */
        const req = await axios.delete(`${apiConfig.apiEndpoint}/company/${id}`, {
          data: {
            // TODO: 삭제 권한자 체크 적용해야함.
            roleId: 13,
          },
          withCredentials: true,
        });
        alert('삭제 되었습니다.');
        router.push('/company/list');
      } catch (err: any) {
        console.log('err', err.response.data);
        alert('삭제에 실패 하였습니다.');
      }
    }
  };

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ mt: 10, ml: 14, display: 'flex', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  회원사 정보
                </Typography>
              </Box>
              <Divider sx={{ ml: 3, mr: 3, borderLeftWidth: 'unset', height: 16 }} />
              <Box sx={{ display: 'flex' }}>
                <Typography variant="body2">회원사 관리</Typography>
                <Box sx={{ ml: 1.2, mr: 1.2 }}>
                  <Typography variant="body2">{'>'}</Typography>
                </Box>
                <Typography variant="body2">회원사 정보</Typography>
              </Box>
            </Box>

            <Divider sx={{ ml: 12, mr: 12, borderBottomWidth: 'unset' }} />
            <CardContent
              sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h3" sx={{ mb: 4, mr: 3 }}>
                  {data.companyName}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
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
                      {data.userCount} 명
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
                      {data.adminCount} 명
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
                  <Typography variant="body2">{data.companyCode}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    사업자번호:
                  </Typography>
                  <Typography variant="body2">{data.businessNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    등록일:
                  </Typography>
                  <Typography variant="body2">{data.regDate}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" sx={{ mr: 2 }} onClick={handleEditClose}>
                <Link href={`/company/list`} passHref>
                  <StyledLink>확인</StyledLink>
                </Link>
              </Button>
              <Button variant="contained" sx={{ mr: 2 }} onClick={deleteCompany}>
                삭제
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
                  회원사 이름을 수정하시려면 내용을 입력해주세요.
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="회원사 이름"
                        defaultValue={data.companyName}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="contained" sx={{ mr: 1 }} onClick={updateCompany}>
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
            회원사 정보가 존재하지 않습니다.
            <Link href="/company/list">목록으로</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default CompanyDetail;
