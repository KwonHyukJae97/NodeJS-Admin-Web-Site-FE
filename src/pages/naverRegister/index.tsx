// ** React Imports
import { ReactNode } from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Components
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import Typography, { TypographyProps } from '@mui/material/Typography';
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';

// ** Icons Imports

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

//?????? 2??? ?????? ????????? ?????? ??????
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
  radio: string;
  companyCode: number;
  businessNumber: string;

  // division: boolean;
}

//????????? 2??????????????? ???????????????
const NaverRegister = () => {
  const router = useRouter();

  const { name, nickname, phone, birthday, birthyear, snsId, snsToken } = router.query;

  //input ?????????
  const defaultValues = {
    name: name,
    phone: phone,
    nickname: nickname,
    birth: birthyear + '-' + birthday,
    gender: '',
    snsId: snsId,
    snsToken: snsToken,
    companyName: '',
    businessNumber: '',
    radio: '',
    companyCode: null,
  };

  // ** Hooks
  const theme = useTheme();
  const auth = useAuth();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down('md'));

  // ** Vars
  const { skin } = settings;
  const schema = yup.object().shape({
    name: yup.string().min(1).required(),
    phone: yup.string().min(13).required(),
    nickname: yup.string().min(1).required(),
    snsId: yup.string().min(1).required(),
    birth: yup.string().min(10).required(),
    gender: yup.string().required(),
    companyName: yup.string().min(1).required(),
    companyCode: yup.number().required(),
    businessNumber: yup.string().min(12).max(12).required(),
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

  //2??? ?????? ?????? ?????? ????????? ?????????
  const onSubmit = (data: FormData) => {
    const {
      name,
      phone,
      nickname,
      birth,
      snsId,
      snsToken,
      gender,
      companyName,
      companyCode,
      businessNumber,
    } = data;
    auth.naverRegister(
      {
        name,
        phone,
        nickname,
        birth,
        snsId,
        snsToken,
        gender,
        companyName,
        companyCode,
        businessNumber,
      },
      () => {
        setError('snsId', {
          type: 'manual',
          message: '????????? ????????? ?????????.',
        }),
          setError('phone', {
            type: 'manual',
            message: '????????? ???????????? ?????????.',
          }),
          setError('nickname', {
            type: 'manual',
            message: '????????? ????????? ?????????.',
          }),
          setError('companyName', {
            type: 'manual',
            message: '????????? ???????????? ?????????.',
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
                ???Pick ???????????? ?????? ?????? ????????? ??????????????????!
              </TypographyStyled>
              <Typography variant="body2">?????? ?????? ??????!</Typography>
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
                      label="??????????????????"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.snsId)}
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
                      value={value}
                      onBlur={onBlur}
                      label="??????"
                      onChange={onChange}
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
                      label="????????????"
                      onChange={onChange}
                      placeholder="ex) 010-1234-5678"
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
                      label="?????????"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.nickname)}
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
                <FormLabel>??????</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label="gender" name="validation-basic-radio">
                      <FormControlLabel
                        value="0"
                        label="???"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value="1"
                        label="???"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="birth"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label="????????????"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.birth)}
                      placeholder="ex) 1997-11-13 ???????????? ??????????????????"
                    />
                  )}
                />
                {errors.birth && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="companyName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      value={value}
                      label="????????????"
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.companyName)}
                      placeholder="ex) ???????????????"
                    />
                  )}
                />
                {errors.companyName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.companyName.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 7 }}>
                <Controller
                  name="businessNumber"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      onBlur={onBlur}
                      label="???????????????"
                      onChange={onChange}
                      placeholder="ex 000-00-00000 ???????????? ??????????????????."
                      error={Boolean(errors.businessNumber)}
                    />
                  )}
                />
                {errors.businessNumber && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.businessNumber.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <FormLabel>???????????????</FormLabel>
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
                        label="??????"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value="2"
                        label="??????"
                        sx={errors.radio ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.radio ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
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
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>?????? ???????????????????</Typography>
                <Typography>
                  <Link passHref href="/login">
                    <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                      ???????????????
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};

NaverRegister.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

NaverRegister.guestGuard = true;

export default NaverRegister;
