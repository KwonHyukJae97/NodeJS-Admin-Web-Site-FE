// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Axios
import axios from 'axios';

// ** Config
import authConfig from 'src/configs/auth';

// ** Config
import apiConfig from 'src/configs/api';

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
} from './types';

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
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

        await axios
          .get(authConfig.meEndpoint, { withCredentials: true })
          .then(async (response) => {
            console.log('사용자 정보 조회 성공 시, 응답', response);

            const user: UserDataType = {
              accountId: response.data.accountId,
              id: response.data.id,
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
            router.push('login');
            localStorage.removeItem(authConfig.storageUserDataKeyName);
            setUser(null);
            setLoading(false);
            console.log('사용자 정보 조회 실패');
          });
      } else {
        setLoading(false);
        console.log('사용자 정보 없음');
        router.push('login');
      }
    };
    initAuth();
  }, []);

  // 로그인 요청 시, 실행
  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params, { withCredentials: true })
      .then(async (response) => {
        console.log('로그인 성공 시 응답', response);
      })
      .then(() => {
        axios
          .get(authConfig.meEndpoint, {
            withCredentials: true,
          })
          .then(async (response) => {
            const returnUrl = router.query.returnUrl;
            console.log('returnUrl', returnUrl);

            console.log('사용자 정보 조회 성공 시, 응답', response);

            const user: UserDataType = {
              accountId: response.data.accountId,
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              nickname: response.data.nickname,
              avatar: null,
            };

            setUser(user);
            await window.localStorage.setItem(
              authConfig.storageUserDataKeyName,
              JSON.stringify(user),
            );

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

            await router.replace(redirectURL as string);
          });
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  };

  //카카오 로그인 요청 시 실행
  const handleKakaoLogin = async (params: any, errorCallback?: ErrCallbackType) => {
    console.log('params!!', params);

    try {
      const responseData = await axios.post(`${apiConfig.apiEndpoint}/auth/kakao`, params, {
        withCredentials: true,
      });

      // const data = responseData.data;

      if (responseData.data.loginSuccess == true) {
        const res = await axios.get(`${apiConfig.apiEndpoint}/auth/me`, {
          withCredentials: true,
        });
        const returnUrl = router.query.returnUrl;
        console.log('returnUrl', returnUrl);

        console.log('사용자 정보 조회 성공 시 응답', res);

        const user: UserDataType = {
          accountId: res.data.accountId,
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          nickname: res.data.nickname,
          avatar: null,
        };

        setUser(user);
        await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        await router.replace(redirectURL as string);
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
      const responseData = await axios.post(`${apiConfig.apiEndpoint}/auth/google`, params, {
        withCredentials: true,
      });

      // const data = responseData.data;

      if (responseData.data.loginSuccess == true) {
        const res = await axios.get(`${apiConfig.apiEndpoint}/auth/me`, {
          withCredentials: true,
        });
        const returnUrl = router.query.returnUrl;
        console.log('네이버 사용자 정보 조회 성공 시 응답', res);

        const user: UserDataType = {
          accountId: res.data.accountId,
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          nickname: res.data.nickname,
          avatar: null,
        };

        setUser(user);
        await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        await router.replace(redirectURL as string);
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
      const responseData = await axios.post(`${apiConfig.apiEndpoint}/auth/naver`, params, {
        withCredentials: true,
      });

      // const data = responseData.data;

      if (responseData.data.loginSuccess == true) {
        const res = await axios.get(`${apiConfig.apiEndpoint}/auth/me`, {
          withCredentials: true,
        });
        const returnUrl = router.query.returnUrl;
        console.log('네이버 사용자 정보 조회 성공 시 응답', res);

        const user: UserDataType = {
          accountId: res.data.accountId,
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          nickname: res.data.nickname,
          avatar: null,
        };

        setUser(user);
        await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        await router.replace(redirectURL as string);
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

  const handleLogout = () => {
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem('userData');
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push('/login');
  };

  // async await 형식으로 변환
  // 회원가입 요청 시 실행
  const handleRegister = async (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    console.log('companyName 추가', params);

    try {
      const res = await axios.post(authConfig.registerEndpoint, params);

      if (res.data.error) {
        if (errorCallback) errorCallback(res.data.error);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.log(errorCallback);
      console.log(err);
    }

    // axios
    //   .post(authConfig.registerEndpoint, params)
    //   .then((res) => {
    //     if (res.data.error) {
    //       if (errorCallback) errorCallback(res.data.error);
    //     } else {
    //       //회원가입 완료 시 즉시 로그인 할 경우
    //       // handleLogin({ id: params.id, password: params.password });
    //       //회원가입 완료 시 로그인 페이지로 갈 경우
    //       router.push('/login');
    //     }
    //   })
    //   .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null));
  };

  // async await 형식으로 변환
  //카카오 2차 정보 가입 요청 시 실행
  const handleKakaoRegister = async (
    params: KakaoRegisterParams,
    errorCallback?: ErrCallbackType,
  ) => {
    try {
      const res = await axios.post(`${apiConfig.apiEndpoint}/auth/register/kakao/admin`, params);
      if (res.data.error) {
        if (errorCallback) errorCallback(res.data.error);
      } else {
        // router.replace('/dashboards/crm');
        const returnUrl = router.query.returnUrl;
        console.log('returnUrl', returnUrl);

        console.log('사용자 정보 조회 성공 시, 응답', res);

        const user: UserDataType = {
          accountId: res.data.accountId,
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          nickname: res.data.nickname,
          avatar: null,
        };

        setUser(user);
        window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        router.replace(redirectURL as string);
      }
    } catch (err) {
      console.log(errorCallback);
      console.log(err);
    }

    // axios
    //   .post(authConfig.kakaoRegisterEndpoint, params)
    //   .then((res) => {
    //     if (res.data.error) {
    //       if (errorCallback) errorCallback(res.data.error);
    //     } else {
    //       // router.replace('/dashboards/crm');
    //       const returnUrl = router.query.returnUrl;
    //       console.log('returnUrl', returnUrl);

    //       console.log('사용자 정보 조회 성공 시, 응답', res);

    //       const user: UserDataType = {
    //         accountId: res.data.accountId,
    //         id: res.data.id,
    //         name: res.data.name,
    //         email: res.data.email,
    //         nickname: res.data.nickname,
    //         avatar: null,
    //       };

    //       setUser(user);
    //       window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

    //       const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

    //       router.replace(redirectURL as string);
    //     }
    //   })
    //   .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null));
  };

  //네이버 2차 정보 가입 요청 시 실행
  const handleNaverRegister = async (
    params: NaverRegisterParams,
    errorCallback?: ErrCallbackType,
  ) => {
    try {
      const res = await axios.post(`${apiConfig.apiEndpoint}/auth/register/naver/admin`, params);
      if (res.data.error) {
        if (errorCallback) errorCallback(res.data.error);
      } else {
        const returnUrl = router.query.returnUrl;
        console.log('returnUrl', returnUrl);

        console.log('사용자 정보 조회 성공 시, 응답', res);

        const user: UserDataType = {
          accountId: res.data.accountId,
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          nickname: res.data.nickname,
          avatar: null,
        };

        setUser(user);
        window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        router.replace(redirectURL as string);
      }
    } catch (err) {
      console.log(errorCallback);
      console.log(err);
    }
  };

  //구글 2차 정보 가입 요청 시 실행
  const handleGoogleRegister = async (
    params: GoogleRegisterParams,
    errorCallback?: ErrCallbackType,
  ) => {
    try {
      const res = await axios.post(`${apiConfig.apiEndpoint}/auth/register/google/admin`, params);
      if (res.data.error) {
        if (errorCallback) errorCallback(res.data.error);
      } else {
        const returnUrl = router.query.returnUrl;
        console.log('returnUrl', returnUrl);

        console.log('사용자 정보 조회 성공 시, 응답', res);

        const user: UserDataType = {
          accountId: res.data.accountId,
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          nickname: res.data.nickname,
          avatar: null,
        };

        setUser(user);
        window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

        router.replace(redirectURL as string);
      }
    } catch (err) {
      console.log(errorCallback);
      console.log(err);
    }
  };

  const values = {
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
