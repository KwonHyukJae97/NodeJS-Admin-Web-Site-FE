// ** React Imports
import { ReactNode, useState } from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Components
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box, { BoxProps } from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings';

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2';

// ** axios
import apiConfig from 'src/configs/api';
import Api from 'src/utils/api';

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10),
  },
}));

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem',
  },
}));

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450,
  },
}));

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
  },
}));

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) },
}));

//아이디 찾기 페이지
const ForgotId = () => {
  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const inputChangeName = (e: any) => {
    setName(e.target.value);
  };
  const inputChangePhone = (e: any) => {
    setPhone(e.target.value);
  };

  //아이디 찾기 메소드
  const forgotId = async () => {
    if (confirm('아이디를 찾으시겠습니까?')) {
      try {
        const phn = phone;
        const phnTest = phn.search(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/);

        if (phnTest < 0) {
          alert('전화번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else {
          const resData = await Api.post(`${apiConfig.apiEndpoint}/auth/find_id`, {
            name: name,
            phone: phone,
          });
          const resID = JSON.stringify(await (await resData).data.id);
          alert(`회원님의 아이디는 ${resID.replace(/\"/gi, '')} 입니다.`);
        }
      } catch (err: any) {
        console.log(err);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  // ** Vars
  const { skin } = settings;
  const hidden = useMediaQuery(theme.breakpoints.down('md'));

  const imageSource =
    skin === 'bordered'
      ? 'auth-v2-forgot-password-illustration-bordered'
      : 'auth-v2-forgot-password-illustration';

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ForgotPasswordIllustrationWrapper>
            <ForgotPasswordIllustration
              alt="forgot-password-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </ForgotPasswordIllustrationWrapper>
          <FooterIllustrationsV2
            image={`/images/pages/auth-v2-forgot-password-mask-${theme.palette.mode}.png`}
          />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}
        }
      >
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width={47}
                fill="none"
                height={26}
                viewBox="0 0 268 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fillOpacity="0.4"
                  fill="url(#paint0_linear_7821_79167)"
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fillOpacity="0.4"
                  fill="url(#paint1_linear_7821_79167)"
                  transform="matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)"
                />
                <rect
                  rx="25.1443"
                  width="50.2886"
                  height="143.953"
                  fill={theme.palette.primary.main}
                  transform="matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)"
                />
                <defs>
                  <linearGradient
                    y1="0"
                    x1="25.1443"
                    x2="25.1443"
                    y2="143.953"
                    id="paint0_linear_7821_79167"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    y1="0"
                    x1="25.1443"
                    x2="25.1443"
                    y2="143.953"
                    id="paint1_linear_7821_79167"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <Typography
                variant="h6"
                sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant="h5">아이디를 잊으셨나요?</TypographyStyled>
              <Typography variant="body2">가입 시 등록한 이름과 연락처를 입력하세요</Typography>
            </Box>
            <form>
              <TextField
                autoFocus
                type="name"
                value={name}
                label="이름"
                onChange={inputChangeName}
                sx={{ display: 'flex', mb: 4 }}
              />
              <TextField
                type="phone"
                value={phone}
                label="연락처"
                onChange={inputChangePhone}
                sx={{ display: 'flex', mb: 4 }}
                placeholder=" ex) 010-1234-1234 형식으로 입력해주세요."
              />
              <Button
                fullWidth
                size="large"
                variant="contained"
                sx={{ mb: 5.25 }}
                onClick={() => forgotId()}
              >
                아이디 찾기
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link passHref href="/login">
                  <Typography
                    component={MuiLink}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      justifyContent: 'center',
                    }}
                  >
                    <ChevronLeft sx={{ mr: 1.5, fontSize: '2rem' }} />
                    <span>로그인으로</span>
                  </Typography>
                </Link>
              </Typography>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};

ForgotId.guestGuard = true;
ForgotId.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default ForgotId;
