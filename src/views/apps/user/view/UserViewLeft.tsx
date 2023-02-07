// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// import Button from '@mui/material/Button';
// import { Button } from 'reactstrap';
import Dialog from '@mui/material/Dialog';

// import Select from '@mui/material/Select';
// import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';

// import MenuItem from '@mui/material/MenuItem';
// import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';

// import CardActions from '@mui/material/CardActions';
import DialogTitle from '@mui/material/DialogTitle';

// import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// import InputAdornment from '@mui/material/InputAdornment';
// import LinearProgress from '@mui/material/LinearProgress';
// import FormControlLabel from '@mui/material/FormControlLabel';
import DialogContentText from '@mui/material/DialogContentText';

// ** Icons Imports
// import Check from 'mdi-material-ui/Check';
// import Circle from 'mdi-material-ui/Circle';
// import StarOutline from 'mdi-material-ui/StarOutline';

// ** Custom Components
// import CustomChip from 'src/@core/components/mui/chip';
import CustomAvatar from 'src/@core/components/mui/avatar';

// ** Types
import { UsersType } from 'src/types/apps/userTypes';

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials';

import apiConfig from 'src/configs/api';
import Button from '@mui/material/Button';
import Api from 'src/utils/api';
import moment from 'moment';
import { AccountChild } from 'mdi-material-ui';

//수정 데이터 타입 정의
interface Props {
  data: UsersType;
}

//내정보 페이지
const UserViewLeft = ({ data }: Props) => {
  // ** States
  const [email, setEmail] = useState<string>(data.email),
    [phone, setPhone] = useState<string>(data.phone),
    [nickname, setNickname] = useState<string>(data.nickname),
    [openEditEmail, setOpenEditEmail] = useState<boolean>(false),
    [openEditPhone, setOpenEditPhone] = useState<boolean>(false),
    [openEditNickname, setOpenEditNickname] = useState<boolean>(false);

  // Handle Edit dialog
  const handleEditClickOpenEmail = () => setOpenEditEmail(true),
    handleEditClickOpenPhone = () => setOpenEditPhone(true),
    handleEditClickOpenNickname = () => setOpenEditNickname(true),
    handleEditClickCloseEmail = () => setOpenEditEmail(false),
    handleEditClickClosePhone = () => setOpenEditPhone(false),
    handleEditClickCloseNickname = () => setOpenEditNickname(false);

  const birthDate = moment(data.birth).format('YYYY-MM-DD');
  const phoneNumber = data.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  if (data.id == null) {
    data.id = '---정보 없음---';
  }
  if (data.email == null) {
    data.email = '---정보 없음---';
  }
  if (data.snsId == null) {
    data.snsId = '---정보 없음---';
  }

  //이메일 수정 메소드
  const editEmail = async () => {
    if (confirm('이메일을 수정하시겠습니까?')) {
      try {
        //이메일형식 검사
        const em = email;
        const emailTest = em.search(
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
        );
        if (emailTest < 0) {
          alert('이메일 형식에 맞게 다시 입력해주세요.');

          return false;
        } else {
          await Api.patch(`${apiConfig.apiEndpoint}/admin/me`, {
            accountId: data.accountId,
            email: email,
          });

          // await Api.patch(`${apiConfig.apiEndpoint}/admin/me${data.accountId}`, {
          console.log('이메일수정테스트');
          location.reload();
          alert('이메일 수정이 완료되었습니다.');
        }
      } catch (err: any) {
        console.log(err);
        if (err.response.data.message == 'email must be an email') {
          return alert('이메일 형식에 맞게 다시 입력해주세요.');
        }
      }
    }
  };

  //연락처 수정 메소드
  const editPhone = async () => {
    if (confirm('연락처를 수정하시겠습니까?')) {
      try {
        //전화번호 형식 검사
        const phn = phone;
        const phnTest = phn.search(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/);
        if (phnTest < 0) {
          alert('전화번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else {
          await Api.patch(`${apiConfig.apiEndpoint}/admin/me`, {
            accountId: data.accountId,
            phone: phone,
          });
          location.reload();
          alert('연락처 수정이 완료되었습니다.');
        }
      } catch (err: any) {
        console.log(err);
        console.log(err.response.data.message);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  //닉네임 수정 메소드
  const editNickname = async () => {
    if (confirm('닉네임을 수정하시겠습니까?')) {
      try {
        const nick = nickname;
        const nickTest = nick.search(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/);
        if (nickTest < 0) {
          alert('한글, 영문, 숫자만 입력해주세요.');

          return false;
        } else {
          await Api.patch(`${apiConfig.apiEndpoint}/admin/me`, {
            accountId: data.accountId,
            nickname: nickname,
          });
          location.reload();
          alert('닉네임 수정이 완료되었습니다.');
        }
      } catch (err: any) {
        console.log(err);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  const renderUserAvatar = () => {
    if (data) {
      if (data.name.length) {
        return (
          <CustomAvatar
            alt="User Image"
            variant="rounded"
            sx={{ width: 120, height: 120, mb: 4 }}
          />
        );
      } else {
        return (
          <CustomAvatar
            skin="light"
            variant="rounded"
            sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
          >
            {getInitials(data.nickname)}
          </CustomAvatar>
        );
      }
    } else {
      return null;
    }
  };

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            >
              {renderUserAvatar()}
              <Typography variant="h6" sx={{ mb: 4 }}>
                {data.nickname}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography variant="h6">내 정보</Typography>
              <Divider sx={{ mt: 4 }} />
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    이 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;름 :
                  </Typography>
                  <Typography variant="body2">{data.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    이&nbsp;&nbsp;메&nbsp;&nbsp;일 :
                  </Typography>
                  <Typography variant="body2">{data.email}</Typography>
                  &emsp;
                  <Button
                    onClick={handleEditClickOpenEmail}
                    size={'small'}
                    color={'primary'}
                    variant={'outlined'}
                  >
                    수정
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    연&nbsp;&nbsp;락&nbsp;&nbsp;처 :
                  </Typography>
                  <Typography variant="body2">{phoneNumber}</Typography>
                  &emsp;
                  <Button
                    onClick={handleEditClickOpenPhone}
                    size={'small'}
                    color={'primary'}
                    variant={'outlined'}
                  >
                    수정
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    닉&nbsp;&nbsp;네&nbsp;&nbsp;임 :
                  </Typography>
                  <Typography variant="body2">{data.nickname}</Typography>
                  &emsp;
                  <Button
                    onClick={handleEditClickOpenNickname}
                    size={'small'}
                    color={'primary'}
                    variant={'outlined'}
                  >
                    수정
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    생 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;일 :
                  </Typography>
                  <Typography variant="body2">{birthDate}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    아&nbsp;&nbsp;이&nbsp;&nbsp;디 :
                  </Typography>
                  <Typography variant="body2">{data.id}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    SNS 아이디 :
                  </Typography>
                  <Typography variant="body2">{data.snsId}</Typography>
                </Box>
              </Box>
            </CardContent>
            <Dialog
              open={openEditEmail}
              onClose={handleEditClickCloseEmail}
              aria-labelledby="user-view-edit"
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby="user-view-edit-description"
            >
              <DialogTitle
                id="user-view-edit"
                sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}
              >
                이메일 수정
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  variant="body2"
                  id="user-view-edit-description"
                  sx={{ textAlign: 'center', mb: 7 }}
                ></DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        fullWidth
                        type="email"
                        label="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Grid>

                    <DialogActions sx={{ justifyContent: 'center' }}>
                      <Button variant="contained" sx={{ mr: 1 }} onClick={() => editEmail()}>
                        수정
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleEditClickCloseEmail}
                      >
                        취소
                      </Button>
                    </DialogActions>
                  </Grid>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={openEditPhone}
              onClose={handleEditClickClosePhone}
              aria-labelledby="user-view-edit"
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby="user-view-edit-description"
            >
              <DialogTitle
                id="user-view-edit"
                sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}
              >
                연락처 수정
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  variant="body2"
                  id="user-view-edit-description"
                  sx={{ textAlign: 'center', mb: 7 }}
                ></DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="phone"
                        label="연락처"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Grid>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                      <Button variant="contained" sx={{ mr: 1 }} onClick={() => editPhone()}>
                        수정
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleEditClickClosePhone}
                      >
                        취소
                      </Button>
                    </DialogActions>
                  </Grid>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={openEditNickname}
              onClose={handleEditClickCloseNickname}
              aria-labelledby="user-view-edit"
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby="user-view-edit-description"
            >
              <DialogTitle
                id="user-view-edit"
                sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}
              >
                닉네임 수정
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  variant="body2"
                  id="user-view-edit-description"
                  sx={{ textAlign: 'center', mb: 7 }}
                ></DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="nickname"
                        label="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </Grid>

                    <DialogActions sx={{ justifyContent: 'center' }}>
                      <Button variant="contained" sx={{ mr: 1 }} onClick={() => editNickname()}>
                        수정
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleEditClickCloseNickname}
                      >
                        취소
                      </Button>
                    </DialogActions>
                  </Grid>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default UserViewLeft;
