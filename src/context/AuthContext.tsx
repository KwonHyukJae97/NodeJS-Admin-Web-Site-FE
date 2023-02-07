// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Axios
import Api from 'src/utils/api';

// ** Config
import authConfig from 'src/configs/auth';

// ** Config
import apiConfig from 'src/configs/api';

import { removeCookieAccessToken } from 'src/utils/cookies';

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  KakaoRegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  NaverRegisterParams,
  GoogleRegisterParams,
  TokenDataType,
  ExpireAtDataType,
} from './types';

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  accessToken: null,
  setAccessToken: () => null,
  expireAt: null,
  setExpireAt: () => null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  kakaoLogin: () => Promise.resolve(),
  naverLogin: () => Promise.resolve(),
  googleLogin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  kakaoRegister: () => Promise.resolve(),
  naverRegister: () => Promise.resolve(),
  googleRegister: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [accessToken, setAccessToken] = useState<TokenDataType | null>(defaultProvider.accessToken);
  const [expireAt, setExpireAt] = useState<ExpireAtDataType | null>(defaultProvider.expireAt);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized);

  // ** Hooks
  const router = useRouter();

  // 사이트 접속 시, 사용자 정보 유무로 로그인 여부 체크
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true);

      const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!;
      console.log('userData', userData);

      // localstorage에 사용자 정보가 있으면
      if (userData) {
        setLoading(true);
        console.log('사용자 정보 있음');

        //Api 를 사용 할 경우 엑세스 토큰 만료된 후 페이지 이동, 동작 시에 자동으로 엑세스토큰 갱신
        //axios 를 사용 할 경우 엑세스토큰 만료 후 페이지 이동, 동작 시에 로컬스토리지 비우고 로그인 화면으로 이동
        await Api.get(authConfig.meEndpoint, { withCredentials: true })
          .then(async (response) => {
            const user: UserDataType = {
              accountId: response.data.accountId,
              id: response.data.id,
              snsId: response.data.snsId,
              name: response.data.name,
              email: response.data.email,
              nickname: response.data.nickname,
              avatar: null,
            };
            setLoading(false);
            setUser(user);
          })
          .catch(() => {
            // 토큰 만료 시, 로그인 페이지로 이동 / 로컬스토리지에 저장되어있는 userData 삭제
            alert('다시 로그인해주세요.');
            router.push('login');

            // localStorage.removeItem(authConfig.storageUserDataKeyName);
            window.localStorage.clear();
            removeCookieAccessToken();
            setUser(null);
            setLoading(false);
            console.log('사용자 정보 조회 실패');
          });
      } else {
        setLoading(false);
        console.log('사용자 정보 없음');
        router.push('/login');
      }
    };
    initAuth();
  }, []);

  // 로그인 요청 시, 실행
  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      const responseData = await Api.post(authConfig.loginEndpoint, params, {
        withCredentials: true,
      });

      if (responseData) {
        const res = await Api.get(authConfig.meEndpoint, {
          withCredentials: true,
        });

        const returnUrl = router.query.returnUrl;

        const user: UserDataType = {
          accountId: res.data.authInfo.accountId,
          id: res.data.authInfo.id,
          snsId: res.data.authInfo.snsId,
          name: res.data.authInfo.name,
          email: res.data.authInfo.email,
          nickname: res.data.authInfo.nickname,
          avatar: null,
        };
        const token: TokenDataType = {
          accessToken: res.data.accessToken,
        };
        const expireAt: ExpireAtDataType = {
          expireAt: res.data.expireAt,
        };

        setUser(user);
        await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        //accessToken 로컬스토리지에 저장
        setAccessToken(token);
        await window.localStorage.setItem(
          authConfig.storageTokenDataKeyName,
          JSON.stringify(token),
        );

        //expireAt 토큰 만료시간 로컬스토리지에 저장
        setExpireAt(expireAt);
        await window.localStorage.setItem(
          authConfig.storageExpireAtDataKeyName,
          JSON.stringify(expireAt),
        );
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        await router.replace(redirectURL as string);
      }
    } catch (err) {
      alert('아이디 또는 비밀번호를 확인해주세요.');
      console.log(errorCallback);
      console.log(err);
    }
  };

  //카카오 로그인 요청 시 실행
  const handleKakaoLogin = async (params: any, errorCallback?: ErrCallbackType) => {
    console.log('params!!', params);

    try {
      const responseData = await Api.post(
        `${apiConfig.apiEndpoint}/auth/login/admin/kakao`,
        params,
        {
          withCredentials: true,
        },
      );

      // const data = responseData.data;

      if (responseData.data.loginSuccess == true) {
        const res = await Api.get(`${apiConfig.apiEndpoint}/auth/me`, {
          withCredentials: true,
        });
        const returnUrl = router.query.returnUrl;
        console.log('returnUrl', returnUrl);

        const user: UserDataType = {
          accountId: res.data.authInfo.accountId,
          id: res.data.authInfo.id,
          snsId: res.data.authInfo.snsId,
          name: res.data.authInfo.name,
          email: res.data.authInfo.email,
          nickname: res.data.authInfo.nickname,
          avatar: null,
        };

        const token: TokenDataType = {
          accessToken: res.data.accessToken,
        };
        const expireAt: ExpireAtDataType = {
          expireAt: res.data.expireAt,
        };

        setUser(user);
        await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        //accessToken 로컬스토리지에 저장
        setAccessToken(token);
        await window.localStorage.setItem(
          authConfig.storageTokenDataKeyName,
          JSON.stringify(token),
        );

        //expireAt 토큰 만료시간 로컬스토리지에 저장
        setExpireAt(expireAt);
        await window.localStorage.setItem(
          authConfig.storageExpireAtDataKeyName,
          JSON.stringify(expireAt),
        );

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        await router.replace(redirectURL as string);

        location.reload();
      } else {
        console.log('loginSuccess 값 false일경우');

        await router.replace({
          pathname: '/kakaoRegister/',
          query: {
            name: params.name,
            nickname: params.name,
            gender: params.gender,
            snsId: params.snsId,
            snsToken: params.resKakaoAccessToken,
          },
        });
      }
    } catch (err) {
      console.log(errorCallback);
      console.log(err);
    }
  };

  //구글 로그인 요청 시 실행
  const handleGoogleLogin = async (params: any, errorCallback?: ErrCallbackType) => {
    console.log('구글 params', params);

    try {
      const responseData = await Api.post(
        `${apiConfig.apiEndpoint}/auth/login/admin/google`,
        params,
        {
          withCredentials: true,
        },
      );

      // const data = responseData.data;

      if (responseData.data.loginSuccess == true) {
        const res = await Api.get(`${apiConfig.apiEndpoint}/auth/me`, {
          withCredentials: true,
        });
        const returnUrl = router.query.returnUrl;

        const user: UserDataType = {
          accountId: res.data.authInfo.accountId,
          id: res.data.authInfo.id,
          snsId: res.data.authInfo.snsId,
          name: res.data.authInfo.name,
          email: res.data.authInfo.email,
          nickname: res.data.authInfo.nickname,
          avatar: null,
        };

        const token: TokenDataType = {
          accessToken: res.data.accessToken,
        };
        const expireAt: ExpireAtDataType = {
          expireAt: res.data.expireAt,
        };

        setUser(user);
        await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        //accessToken 로컬스토리지에 저장
        setAccessToken(token);
        await window.localStorage.setItem(
          authConfig.storageTokenDataKeyName,
          JSON.stringify(token),
        );

        //expireAt 토큰 만료시간 로컬스토리지에 저장
        setExpireAt(expireAt);
        await window.localStorage.setItem(
          authConfig.storageExpireAtDataKeyName,
          JSON.stringify(expireAt),
        );

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        await router.replace(redirectURL as string);

        location.reload();
      } else {
        console.log('loginFailed!');
        console.log('param.email', params.snsId);
        console.log('param.token', params.resGoogleAccessToken);

        await router.replace({
          pathname: '/googleRegister',
          query: {
            snsId: params.snsId,
            snsToken: params.resGoogleAccessToken,
          },
        });
      }
    } catch (err) {
      console.log(errorCallback);
      console.log(err);
    }
  };

  //네이버 로그인 요청 시 실행
  const handleNaverLogin = async (params: any, errorCallback?: ErrCallbackType) => {
    console.log('네이버 params !', params);

    try {
      const responseData = await Api.post(
        `${apiConfig.apiEndpoint}/auth/login/admin/naver`,
        params,
        {
          withCredentials: true,
        },
      );

      // const data = responseData.data;

      if (responseData.data.loginSuccess == true) {
        const res = await Api.get(`${apiConfig.apiEndpoint}/auth/me`, {
          withCredentials: true,
        });
        console.log('네이버 데이터', res);
        const returnUrl = router.query.returnUrl;

        const user: UserDataType = {
          accountId: res.data.authInfo.accountId,
          id: res.data.authInfo.id,
          snsId: res.data.authInfo.snsId,
          name: res.data.authInfo.name,
          email: res.data.authInfo.email,
          nickname: res.data.authInfo.nickname,
          avatar: null,
        };

        const token: TokenDataType = {
          accessToken: res.data.accessToken,
        };
        const expireAt: ExpireAtDataType = {
          expireAt: res.data.expireAt,
        };

        setUser(user);
        await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        //accessToken 로컬스토리지에 저장
        setAccessToken(token);
        await window.localStorage.setItem(
          authConfig.storageTokenDataKeyName,
          JSON.stringify(token),
        );

        //expireAt 토큰 만료시간 로컬스토리지에 저장
        setExpireAt(expireAt);
        await window.localStorage.setItem(
          authConfig.storageExpireAtDataKeyName,
          JSON.stringify(expireAt),
        );

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        await router.replace(redirectURL as string);

        location.reload();
      } else {
        console.log('loginSuccess 실패 시');

        await router.replace({
          pathname: '/naverRegister/',
          query: {
            discrimination: params.discrimination,
            nickname: params.nickname,
            name: params.name,
            snsId: params.snsId,
            gender: params.gender,
            age: params.age,
            birthday: params.birthday,
            profileImages: params.profileImages,
            birthyear: params.birthyear,
            phone: params.phone,
            snsToken: params.resNaverAccessToken,
          },
        });
      }
    } catch (err) {
      console.log(errorCallback);
      console.log(err);
    }
  };

  //로그아웃 요청 시 실행
  const handleLogout = async () => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/auth/logout/admin`);
      console.log('프론트 로그아웃 테스트', res);
      setUser(null);
      setIsInitialized(false);
      window.localStorage.clear();
      removeCookieAccessToken();
      router.push('/login');
    } catch (err) {
      console.log('로그아웃 실패...', err);
    }
  };

  // 회원가입 요청 시 실행
  const handleRegister = async (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    console.log('companyName 추가', params);
    if (confirm('회원가입을 하시겠습니까?')) {
      try {
        if (params.password !== params.confirmPassword) {
          return alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요!');
        }

        //회원가입 데이터 검증
        const pw = params.password;
        const clsl = pw.search(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/,
        );
        const phone = params.phone;
        const phn = phone.search(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/);
        const birth = params.birth;
        const bir = birth.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        const businessNumber = params.businessNumber;
        const bus = businessNumber.search(/^[0-9]{3}-[0-9]{2}-[0-9]{5}/);
        const nickname = params.nickname;
        const nick = nickname.search(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/);

        if (pw.length < 8 || pw.length > 16) {
          alert('8자리 ~ 16자리 이내로 입력해주세요.');

          return false;
        } else if (pw.search(/\s/) != -1) {
          alert('비밀번호는 공백 없이 입력해주세요.');

          return false;
        } else if (clsl < 0) {
          alert('영문 대, 소문자, 숫자, 특수문자를 혼합하여 입력해주세요.');

          return false;
        } else if (phn < 0) {
          alert('전화번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bir < 0) {
          alert('생년월일 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bus < 0) {
          alert('사업자 번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (nick < 0) {
          alert('한글, 영문, 숫자만 입력해주세요.');

          return false;
        } else {
          const res = await Api.post(authConfig.registerEndpoint, params);

          if (res.data.error) {
            if (errorCallback) errorCallback(res.data.error);
          } else {
            alert('회원가입이 완료되었습니다! 로그인 후 이용해주세요.');
            router.push('/login');
          }
        }
      } catch (err: any) {
        console.log(errorCallback);
        console.log(err.response.data.message);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  //카카오 2차 정보 가입 요청 시 실행
  const handleKakaoRegister = async (
    params: KakaoRegisterParams,
    errorCallback?: ErrCallbackType,
  ) => {
    if (confirm('회원가입을 하시겠습니까?')) {
      try {
        //회원가입 데이터 검증
        const phone = params.phone;
        const phn = phone.search(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/);
        const birth = params.birth;
        const bir = birth.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        const businessNumber = params.businessNumber;
        const bus = businessNumber.search(/^[0-9]{3}-[0-9]{2}-[0-9]{5}/);
        const nickname = params.nickname;
        const nick = nickname.search(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/);

        if (phn < 0) {
          alert('전화번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bir < 0) {
          alert('생년월일 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bus < 0) {
          alert('사업자 번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (nick < 0) {
          alert('한글, 영문, 숫자만 입력해주세요.');

          return false;
        } else {
          await Api.post(`${apiConfig.apiEndpoint}/auth/register/kakao/admin`, params, {
            withCredentials: true,
          });
          const responseData = await Api.post(
            `${apiConfig.apiEndpoint}/auth/login/admin/kakao`,
            params,
            {
              withCredentials: true,
            },
          );

          if (responseData.data.loginSuccess == true) {
            const res = await Api.get(`${apiConfig.apiEndpoint}/auth/me`, {
              withCredentials: true,
            });

            const returnUrl = router.query.returnUrl;

            const user: UserDataType = {
              accountId: res.data.authInfo.accountId,
              id: res.data.authInfo.id,
              snsId: res.data.authInfo.snsId,
              name: res.data.authInfo.name,
              email: res.data.authInfo.email,
              nickname: res.data.authInfo.nickname,
              avatar: null,
            };

            const token: TokenDataType = {
              accessToken: res.data.accessToken,
            };
            const expireAt: ExpireAtDataType = {
              expireAt: res.data.expireAt,
            };

            setUser(user);
            await window.localStorage.setItem(
              authConfig.storageUserDataKeyName,
              JSON.stringify(user),
            );

            //accessToken 로컬스토리지에 저장
            setAccessToken(token);
            await window.localStorage.setItem(
              authConfig.storageTokenDataKeyName,
              JSON.stringify(token),
            );

            //expireAt 토큰 만료시간 로컬스토리지에 저장
            setExpireAt(expireAt);
            await window.localStorage.setItem(
              authConfig.storageExpireAtDataKeyName,
              JSON.stringify(expireAt),
            );

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

            await router.replace(redirectURL as string);
          }
        }
      } catch (err: any) {
        console.log(errorCallback);

        // console.log(err);
        console.log(err.response.data.message);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  //네이버 2차 정보 가입 요청 시 실행
  const handleNaverRegister = async (
    params: NaverRegisterParams,
    errorCallback?: ErrCallbackType,
  ) => {
    if (confirm('회원가입을 하시겠습니까?')) {
      try {
        //회원가입 데이터 검증
        const phone = params.phone;
        const phn = phone.search(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/);
        const birth = params.birth;
        const bir = birth.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        const businessNumber = params.businessNumber;
        const bus = businessNumber.search(/^[0-9]{3}-[0-9]{2}-[0-9]{5}/);
        const nickname = params.nickname;
        const nick = nickname.search(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/);

        if (phn < 0) {
          alert('전화번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bir < 0) {
          alert('생년월일 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bus < 0) {
          alert('사업자 번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (nick < 0) {
          alert('한글, 영문, 숫자만 입력해주세요.');

          return false;
        } else {
          await Api.post(`${apiConfig.apiEndpoint}/auth/register/naver/admin`, params, {
            withCredentials: true,
          });
          const responseData = await Api.post(
            `${apiConfig.apiEndpoint}/auth/login/admin/naver`,
            params,
            {
              withCredentials: true,
            },
          );

          if (responseData.data.loginSuccess == true) {
            const res = await Api.get(`${apiConfig.apiEndpoint}/auth/me`, {
              withCredentials: true,
            });

            const returnUrl = router.query.returnUrl;

            const user: UserDataType = {
              accountId: res.data.authInfo.accountId,
              id: res.data.authInfo.id,
              snsId: res.data.authInfo.snsId,
              name: res.data.authInfo.name,
              email: res.data.authInfo.email,
              nickname: res.data.authInfo.nickname,
              avatar: null,
            };
            console.log('네이버 회원가입 시 데이터 불러오기', user);
            console.log('네이버 회원가입 시 데이터 불러오기', res);
            console.log('네이버 회원가입 시 데이터 불러오기', res.data.snsId);

            const token: TokenDataType = {
              accessToken: res.data.accessToken,
            };
            const expireAt: ExpireAtDataType = {
              expireAt: res.data.expireAt,
            };

            setUser(user);
            await window.localStorage.setItem(
              authConfig.storageUserDataKeyName,
              JSON.stringify(user),
            );

            //accessToken 로컬스토리지에 저장
            setAccessToken(token);
            await window.localStorage.setItem(
              authConfig.storageTokenDataKeyName,
              JSON.stringify(token),
            );

            //expireAt 토큰 만료시간 로컬스토리지에 저장
            setExpireAt(expireAt);
            await window.localStorage.setItem(
              authConfig.storageExpireAtDataKeyName,
              JSON.stringify(expireAt),
            );

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

            await router.replace(redirectURL as string);
          }
        }
      } catch (err: any) {
        console.log(errorCallback);

        // console.log(err);
        console.log(err.response.data.message);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  //구글 2차 정보 가입 요청 시 실행
  const handleGoogleRegister = async (
    params: GoogleRegisterParams,
    errorCallback?: ErrCallbackType,
  ) => {
    if (confirm('회원가입을 하시겠습니까?')) {
      try {
        //회원가입 데이터 검증
        const phone = params.phone;
        const phn = phone.search(/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/);
        const birth = params.birth;
        const bir = birth.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        const businessNumber = params.businessNumber;
        const bus = businessNumber.search(/^[0-9]{3}-[0-9]{2}-[0-9]{5}/);
        const nickname = params.nickname;
        const nick = nickname.search(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/);

        if (phn < 0) {
          alert('전화번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bir < 0) {
          alert('생년월일 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (bus < 0) {
          alert('사업자 번호 형식을 확인하여 다시 입력해주세요.');

          return false;
        } else if (nick < 0) {
          alert('한글, 영문, 숫자만 입력해주세요.');

          return false;
        } else {
          await Api.post(`${apiConfig.apiEndpoint}/auth/register/google/admin`, params, {
            withCredentials: true,
          });
          const responseData = await Api.post(
            `${apiConfig.apiEndpoint}/auth/login/admin/google`,
            params,
            {
              withCredentials: true,
            },
          );

          if (responseData.data.loginSuccess == true) {
            const res = await Api.get(`${apiConfig.apiEndpoint}/auth/me`, {
              withCredentials: true,
            });

            const returnUrl = router.query.returnUrl;

            const user: UserDataType = {
              accountId: res.data.authInfo.accountId,
              id: res.data.authInfo.id,
              snsId: res.data.authInfo.snsId,
              name: res.data.authInfo.name,
              email: res.data.authInfo.email,
              nickname: res.data.authInfo.nickname,
              avatar: null,
            };

            const token: TokenDataType = {
              accessToken: res.data.accessToken,
            };
            const expireAt: ExpireAtDataType = {
              expireAt: res.data.expireAt,
            };

            setUser(user);
            await window.localStorage.setItem(
              authConfig.storageUserDataKeyName,
              JSON.stringify(user),
            );

            //accessToken 로컬스토리지에 저장
            setAccessToken(token);
            await window.localStorage.setItem(
              authConfig.storageTokenDataKeyName,
              JSON.stringify(token),
            );

            //expireAt 토큰 만료시간 로컬스토리지에 저장
            setExpireAt(expireAt);
            await window.localStorage.setItem(
              authConfig.storageExpireAtDataKeyName,
              JSON.stringify(expireAt),
            );

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

            await router.replace(redirectURL as string);
          }
        }
      } catch (err: any) {
        console.log(errorCallback);

        // console.log(err);
        console.log(err.response.data.message);
        const message = err.response.data.message;

        return alert(message);
      }
    }
  };

  const values = {
    accessToken,
    expireAt,
    setExpireAt,
    setAccessToken,
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    kakaoLogin: handleKakaoLogin,
    naverLogin: handleNaverLogin,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
    register: handleRegister,
    kakaoRegister: handleKakaoRegister,
    naverRegister: handleNaverRegister,
    googleRegister: handleGoogleRegister,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
