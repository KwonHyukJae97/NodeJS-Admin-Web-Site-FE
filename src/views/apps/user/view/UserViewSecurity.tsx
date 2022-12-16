// ** React Imports
import { Fragment, MouseEvent, useState } from 'react';

// ** MUI Imports
// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

// import Table from '@mui/material/Table';
import Button from '@mui/material/Button';

// import Dialog from '@mui/material/Dialog';
// import Divider from '@mui/material/Divider';
// import TableRow from '@mui/material/TableRow';
// import TableHead from '@mui/material/TableHead';
// import TableCell from '@mui/material/TableCell';
// import TableBody from '@mui/material/TableBody';
// import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import AlertTitle from '@mui/material/AlertTitle';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';

// import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

// import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

// import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

// import TableContainer from '@mui/material/TableContainer';

// ** Config
import authConfig from 'src/configs/auth';
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';

// import DeleteOutline from 'mdi-material-ui/DeleteOutline';
// import PencilOutline from 'mdi-material-ui/PencilOutline';

//비밀번호 입력값 타입 정의
interface State {
  newPassword: string;
  showNewPassword: boolean;
  confirmNewPassword: string;
  showConfirmNewPassword: boolean;
}

//비밀번호 수정 페이지
const UserViewSecurity = () => {
  // ** States
  const [password, setPassword] = useState<string>(''),
    [confirmPassword, setConfirmPassword] = useState<string>('');
  const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!;
  const resData = JSON.parse(userData);
  const [values, setValues] = useState<State>({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false,
  });

  //비밀번호 수정 메소드
  const editPassword = async () => {
    if (password !== confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
    }
    if (confirm('비밀번호를 수정하시겠습니까?')) {
      try {
        await Api.patch(`${apiConfig.apiEndpoint}/auth/update_password/${resData.accountId}`, {
          password: password,
        });
        location.reload();
        alert('비밀번호를 수정하였습니다.');
      } catch (err: any) {
        console.log(err);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  const inputChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const inputChangeConfirmPassword = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const hasError = (passwordEntered: any) => (password.length < 8 ? true : false);

  const hasNotSameError = (passwordEntered: any) => (password != confirmPassword ? true : false);

  //비밀번호 눈으로 보기
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  //비밀번호 눈으로 보기
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  //비밀번호 확인 눈으로 보기
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword });
  };

  //비밀번호 확인 눈으로 보기
  const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <Card sx={{ mb: 6 }}>
        <CardHeader title="비밀번호 수정" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Alert icon={false} severity="warning" sx={{ mb: 4 }}>
            <AlertTitle sx={{ mb: (theme) => `${theme.spacing(1)} !important` }}>
              영문, 대소문자, 숫자, 특수문자 조합으로 8~16자 이내로 작성하세요.
            </AlertTitle>
          </Alert>
          <form>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel htmlFor="user-view-security-new-password">새 비밀번호</InputLabel>
                  <OutlinedInput
                    autoFocus
                    type={values.showNewPassword ? 'text' : 'password'}
                    value={password}
                    onChange={inputChangePassword}
                    label="비밀번호1"
                    sx={{ display: 'flex', mb: 4 }}
                    error={hasError('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowNewPassword}
                          aria-label="toggle password visibility"
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel htmlFor="user-view-security-confirm-new-password">
                    비밀번호 확인
                  </InputLabel>
                  <OutlinedInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    id="user-view-security-confirm-new-password"
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    onChange={inputChangeConfirmPassword}
                    error={hasNotSameError('confirmPassword')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmNewPassword}
                          onMouseDown={handleMouseDownConfirmNewPassword}
                        >
                          {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ mt: 1.5 }}>
                <Button variant="contained" onClick={() => editPassword()}>
                  수정하기
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default UserViewSecurity;
