export type ErrCallbackType = (err: { [key: string]: string }) => void;

// 로그인 파라미터 타입 정의
export type LoginParams = {
  id: string;
  password: string;
};

// export type RegisterParams = {
//   id: string;
//   username: string;
//   password: string;
// };

// 회원가입 데이터 정의
export type RegisterParams = {
  id: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  nickname: string;
  birth: string;
  gender: string;
  companyName: string;
  companyCode: number;
};

//카카오 2차정보 데이터 정의
export type KakaoRegisterParams = {
  name: string;
  phone: string;
  nickname: string;
  birth: string;
  gender: string;
  snsId: string;
  snsToken: string;
  companyName: string;
  companyCode: number;
};

//네이버 2차정보 데이터 정의
export type NaverRegisterParams = {
  name: string;
  phone: string;
  nickname: string;
  birth: string;
  gender: string;
  snsId: string;
  snsToken: string;
  companyName: string;
  companyCode: number;
};

//구글 2차정보 데이터 정의
export type GoogleRegisterParams = {
  name: string;
  phone: string;
  nickname: string;
  birth: string;
  gender: string;
  snsId: string;
  snsToken: string;
  companyName: string;
  companyCode: number;
};

// export type UserDataType = {
//   id: number
//   role: string
//   email: string
//   nickname: string
//   username: string
//   password: string
//   avatar?: string | null
// }

// 사용자 정보 타입 정의
export type UserDataType = {
  accountId: number;
  id: string;
  snsId: string;
  name: string;
  email: string;
  nickname: string;
  avatar?: string | null;
};

export type AuthValuesType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
  isInitialized: boolean;
  user: UserDataType | null;
  setUser: (value: UserDataType | null) => void;
  setIsInitialized: (value: boolean) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  kakaoLogin: (params: any) => void;
  naverLogin: (params: any) => void;
  googleLogin: (params: any) => void;
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void;
  kakaoRegister: (params: KakaoRegisterParams, errorCallback?: ErrCallbackType) => void;
  naverRegister: (params: NaverRegisterParams, errorCallback?: ErrCallbackType) => void;
  googleRegister: (params: NaverRegisterParams, errorCallback?: ErrCallbackType) => void;
};
