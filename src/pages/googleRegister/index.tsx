// ** React Imports
import React, { ReactNode, MouseEvent } from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Components
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import Typography, { TypographyProps } from '@mui/material/Typography';
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';

// ** Icons Imports
import Google from 'mdi-material-ui/Google';
import Github from 'mdi-material-ui/Github';
import Twitter from 'mdi-material-ui/Twitter';
import Facebook from 'mdi-material-ui/Facebook';

// ** Third Party Imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

// ** Configs
import themeConfig from 'src/configs/themeConfig';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';
import { useSettings } from 'src/@core/hooks/useSettings';

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2';
import { useRouter } from 'next/router';
import { FormLabel, Radio, RadioGroup } from '@mui/material';

// const defaultValues = {
//   //카카오에서 가져옴
//   name: '',
//   phone: '',
//   //카카오에서 가져옴
//   nickname: '',
//   birth: '',
//   //카카오에서 가져옴
//   gender: '',
//   //카카오에서 가져옴
//   snsId: '',
//   terms: false,
//   snsType: '',
//   snsToken: '',
//   division: '',
// };

// interface FormData {
//   id: string
//   terms: boolean
//   username: string
//   password: string
// }

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10),
  },
}));

const RegisterIllustration = styled('img')(({ theme }) => ({
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

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

//카카오 2차 정보 추가
interface FormData {
  name: string;
  phone: string;
  nickname: string;
  birth: string;
  snsId: string;
  snsType: string;
  snsToken: string;
  gender: string;
  companyName: string;
  redio: string;
  companyCode: number;

  // division: boolean;
}

// const GoogleRegister = (params: any) => {
const GoogleRegister = () => {
  // ** States
  // const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  //   const { name, nickname, gender, snsId } = router.query;

  const { snsId, snsToken } = router.query;

  const defaultValues = {
    name: '',
    phone: '',
    nickname: '',
    birth: '',
    gender: '',
    snsId: snsId,

    // terms: false,
    snsToken: snsToken,
    companyName: '',
    radio: '',
    companyCode: null,
  };

  // ** Hooks
  const theme = useTheme();

  const auth = useAuth();

  // const { register } = useAuth()
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down('md'));

  // ** Vars
  const { skin } = settings;
  const schema = yup.object().shape({
    name: yup.string().min(1).required(),
    phone: yup.string().min(1).required(),
    nickname: yup.string().min(1).required(),
    birth: yup.string().min(1).required(),
    gender: yup.number().min(1).required(),
    snsId: yup.string().min(1).required(),
    companyName: yup.string().min(1).required(),
    companyCode: yup.number().min(1).required(),

    // terms: yup.bool().oneOf([true], 'You must accept the privacy policy & terms'),
  });

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

  //화면 넘기기까지 완료 -> 데이터 입력후 가입 버튼 누르면 동작을 안하는데 동작하게끔 해야함. 동작만 하면 처리 과정 콘솔찍고 확인하기
  const onSubmit = (data: FormData) => {
    const { name, phone, nickname, birth, snsId, snsToken, gender, companyName, companyCode } =
      data;
    auth.googleRegister(
      { name, phone, nickname, birth, snsId, snsToken, gender, companyName, companyCode },
      () => {
        setError('snsId', {
          type: 'manual',
          message: '중복된 아이디 입니다.',
        }),
          setError('phone', {
            type: 'manual',
            message: '중복된 전화번호 입니다.',
          }),
          setError('nickname', {
            type: 'manual',
            message: '중복된 닉네임 입니다.',
          }),
          setError('companyName', {
            type: 'manual',
            message: '중복된 회원사명 입니다.',
          });
      },
    );
  };

  const imageSource =
    skin === 'bordered'
      ? 'auth-v2-register-illustration-bordered'
      : 'auth-v2-register-illustration';

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
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt="register-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2
            image={`/images/pages/auth-v2-register-mask-${theme.palette.mode}.png`}
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
              <TypographyStyled variant="h5">
                열Pick 로그인을 위한 필수 정보를 입력해주세요!
              </TypographyStyled>
              <Typography variant="body2">아래 내용 입력!</Typography>
            </Box>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="snsId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="구글아이디"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.snsId)}

                      // placeholder="user"
                    />
                  )}
                />
                {errors.snsId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.snsId.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      value={value}
                      onBlur={onBlur}
                      label="이름"
                      onChange={onChange}

                      // placeholder="01012345678"
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.name.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      onBlur={onBlur}
                      label="전화번호"
                      onChange={onChange}
                      placeholder="ex) 01012345678"
                      error={Boolean(errors.phone)}
                    />
                  )}
                />
                {errors.phone && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.phone.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="nickname"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="닉네임"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.nickname)}

                      // placeholder="user"
                    />
                  )}
                />
                {errors.nickname && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.nickname.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <FormLabel>성별</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label="gender" name="validation-basic-radio">
                      <FormControlLabel
                        value="0"
                        label="남"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value="1"
                        label="여"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {/* <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="성별"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.gender)}
                      // placeholder="user"
                    />
                  )}
                />
                {errors.gender && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.gender.message}
                  </FormHelperText>
                )}
              </FormControl> */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="birth"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="생년월일"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.birth)}
                      placeholder="ex) 19971113 형식으로 작성해주세요"
                    />
                  )}
                />
                {errors.birth && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.birth.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="companyName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="회원사명"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.companyName)}
                      placeholder="ex) 클라이교육"
                    />
                  )}
                />
                {errors.companyName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.companyName.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <FormLabel>회원사코드</FormLabel>
                <Controller
                  name="companyCode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      {...field}
                      aria-label="companyCode"
                      name="validation-basic-radio"
                    >
                      <FormControlLabel
                        value="1"
                        label="기업"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value="2"
                        label="기관"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {/* <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="companyCode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="회원사코드"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.companyCode)}
                      placeholder="ex) 기업일 경우 1, 기관일 경우 2"
                    />
                  )}
                />
                {errors.companyCode && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.companyCode.message}
                  </FormHelperText>
                )}
              </FormControl> */}
              {/* <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="snsType"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      onBlur={onBlur}
                      label="snsType"
                      onChange={onChange}
                      // placeholder="01012345678"
                      error={Boolean(errors.snsType)}
                    />
                  )}
                />
                {errors.snsType && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.snsType.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="snsToken"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      onBlur={onBlur}
                      label="SnsToken"
                      onChange={onChange}
                      // placeholder="01012345678"
                      error={Boolean(errors.snsToken)}
                    />
                  )}
                />
                {errors.snsToken && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.snsToken.message}
                  </FormHelperText>
                )}
              </FormControl> */}
              {/* <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="division"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      onBlur={onBlur}
                      label="division"
                      onChange={onChange}
                      // placeholder="01012345678"
                      error={Boolean(errors.division)}
                    />
                  )}
                />
                {errors.division && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.division.message}
                  </FormHelperText>
                )}
              </FormControl> */}
              {/* <FormControl sx={{ my: 0 }} error={Boolean(errors.terms)}>
                <Controller
                  name="terms"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <FormControlLabel
                        sx={{
                          ...(errors.terms ? { color: 'error.main' } : null),
                          '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
                        }}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={onChange}
                            sx={errors.terms ? { color: 'error.main' } : null}
                          />
                        }
                        label={
                          <Fragment>
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{ color: errors.terms ? 'error.main' : '' }}
                            >
                              I agree to{' '}
                            </Typography>
                            <Link href="/" passHref>
                              <Typography
                                variant="body2"
                                component={MuiLink}
                                sx={{ color: 'primary.main' }}
                                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                              >
                                privacy policy & terms
                              </Typography>
                            </Link>
                          </Fragment>
                        }
                      />
                    );
                  }}
                />
                {errors.terms && (
                  <FormHelperText sx={{ mt: 0, color: 'error.main' }}>
                    {errors.terms.message}
                  </FormHelperText>
                )}
              </FormControl> */}
              <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 7 }}>
                Sign up
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>이미 가입하셨나요?</Typography>
                <Typography>
                  <Link passHref href="/login">
                    <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                      로그인으로
                    </Typography>
                  </Link>
                </Typography>
              </Box>
              <Divider sx={{ mt: 5, mb: 7.5, '& .MuiDivider-wrapper': { px: 4 } }}>or</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link href="/" passHref>
                  <IconButton
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Facebook sx={{ color: '#497ce2' }} />
                  </IconButton>
                </Link>
                <Link href="/" passHref>
                  <IconButton
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Twitter sx={{ color: '#1da1f2' }} />
                  </IconButton>
                </Link>
                <Link href="/" passHref>
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
                </Link>
                <Link href="/" passHref>
                  <IconButton
                    component="a"
                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                  >
                    <Google sx={{ color: '#db4437' }} />
                  </IconButton>
                </Link>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};

GoogleRegister.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

GoogleRegister.guestGuard = true;

export default GoogleRegister;
