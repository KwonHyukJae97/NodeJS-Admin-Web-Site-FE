// ** React Imports
import { useState, ReactNode } from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Components
// import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import useMediaQuery from '@mui/material/useMediaQuery';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled, useTheme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import Typography, { TypographyProps } from '@mui/material/Typography';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';

// ** Third Party Imports
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';

// import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2';

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10),
  },
}));

const LoginIllustration = styled('img')(({ theme }) => ({
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

//RememberMe
// const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
//   '& .MuiFormControlLabel-label': {
//     fontSize: '0.875rem',
//     color: theme.palette.text.secondary,
//   },
// }));

// 로그인 입력값에 대한 유효성 체크
const schema = yup.object().shape({
  id: yup.string().required('아이디를 입력해주세요.'),
  password: yup.string().required('비밀번호를 입력해주세요.'),
});

// 로그인 입력 고정값 정의
const defaultValues = {
  id: 'admin223',
  password: '12341234',

  // id: 'super',
  // password: 'admin0000'
};

// 로그인 입력값 타입 정의
interface FormData {
  id: string;
  password: string;
}

// 로그인 화면 실행
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // ** Hooks
  const auth = useAuth();
  const theme = useTheme();

  //const bgClasses = useBgColor()
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down('md'));

  // ** Vars
  const { skin } = settings;

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // 로그인 버튼 클릭 시, 로그인 요청
  const onSubmit = async (data: FormData) => {
    const { id, password } = data;
    auth.login({ id, password }, () => {
      setError('id', {
        type: 'manual',
        message: '아이디를 확인해주세요.',
      }),
        setError('password', {
          type: 'manual',
          message: '비밀번호를 확인해주세요.',
        });
    });
  };

  const imageSource =
    skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration';

  // 카카오 로그인 버튼 클릭 시 실행
  function loginWithKakao() {
    const CLIENT_ID = `${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    // const test = window.location.replace(KAKAO_AUTH_URL)
    window.location.href = KAKAO_AUTH_URL;
  }

  // 네이버 로그인 버튼 클릭 시 실행
  function loginWithNaver() {
    const CLIENT_ID = `${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`;
    const STATE_STRING = `${process.env.NEXT_PUBLIC_NAVER_STATE_STRING}`;
    const CALLBACK_URL = `${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}`;
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE_STRING}&redirect_uri=${CALLBACK_URL}`;
    console.log(NAVER_AUTH_URL);
    window.location.href = NAVER_AUTH_URL;
  }

  //구글 로그인 버튼 클릭 시 실행
  function loginWithGoogle() {
    const CLIENT_ID = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`;

    //scope=email => 이메일 값. scope=profile => 이름
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=email&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = GOOGLE_AUTH_URL;
  }

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
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt="login-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </LoginIllustrationWrapper>
          <FooterIllustrationsV2 />
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
              <TypographyStyled variant="h5">{`Welcome to ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
              <Typography variant="body2">로그인 후 이용해 주세요!</Typography>
            </Box>
            {/*<Alert icon={false} sx={{ py: 3, mb: 6, ...bgClasses.primaryLight, '& .MuiAlert-message': { p: 0 } }}>*/}
            {/*  <Typography variant='caption' sx={{ mb: 2, display: 'block', color: 'primary.main' }}>*/}
            {/*    Admin: <strong>admin@materialize.com</strong> / Pass: <strong>admin</strong>*/}
            {/*  </Typography>*/}
            {/*  <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>*/}
            {/*    Client: <strong>client@materialize.com</strong> / Pass: <strong>client</strong>*/}
            {/*  </Typography>*/}
            {/*</Alert>*/}

            {/* onSubmit에 handleSubmit() 함수 등록 */}
            <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label="Id"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.id)}
                      placeholder="admin"
                    />
                  )}
                />
                {errors.id && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.id.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="auth-login-v2-password" error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="auth-login-v2-password"
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id="">
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                {/* <FormControlLabel
                  label="Remember Me"
                  control={<Checkbox />}
                  sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
                /> */}
                <Link passHref href="/forgotId">
                  <Typography component={MuiLink} variant="body2" sx={{ color: 'primary.main' }}>
                    아이디를 잊으셨나요?
                  </Typography>
                </Link>
                <Link passHref href="/forgotPassword">
                  <Typography component={MuiLink} variant="body2" sx={{ color: 'primary.main' }}>
                    비밀번호를 잊으셨나요?
                  </Typography>
                </Link>
              </Box>
              <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 7 }}>
                Login
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>계정이 없으신가요?</Typography>
                <Typography>
                  <Link passHref href="/register">
                    <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                      회원가입으로
                    </Typography>
                  </Link>
                </Typography>
              </Box>
              <Divider sx={{ mt: 5, mb: 7.5, '& .MuiDivider-wrapper': { px: 4 } }}>or</Divider>
              {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
              {/* <Link href="/" passHref>
                  <IconButton
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Facebook sx={{ color: '#497ce2' }} />
                  </IconButton>
                </Link> */}
              {/* <Link href="/" passHref>
                  <IconButton
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Twitter sx={{ color: '#1da1f2' }} />
                  </IconButton>
                </Link> */}
              {/* <Link href="/" passHref>
                  <IconButton
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Github
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300],
                      }}
                    />
                  </IconButton>
                </Link> */}
              {/* <Link href="/" passHref>
                  <IconButton
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Google sx={{ color: '#db4437' }} />
                  </IconButton>
                </Link> */}
              {/* <Divider sx={{ mt: 5, mb: 7.5, '& .MuiDivider-wrapper': { px: 4 } }}>or</Divider> */}
              <Box
                sx={{
                  mb: 5,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <img
                  onClick={() => loginWithKakao()}
                  alt={'kakao-login'}
                  src="/images/avatars/kakao.png"

                  // src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
                  width="190"
                />
              </Box>
              <Box
                sx={{
                  mb: 5,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <img
                  onClick={() => loginWithNaver()}
                  alt={'naver-login'}
                  src="/images/avatars/naver.png"
                  width="185"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <img
                  onClick={() => loginWithGoogle()}
                  alt={'google-login'}
                  src="/images/avatars/google.png"
                  width="190"
                />
              </Box>
              {/* </Box> */}
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

LoginPage.guestGuard = true;

export default LoginPage;
