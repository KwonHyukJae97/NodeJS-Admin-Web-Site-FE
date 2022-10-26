export type ErrCallbackType = (err: { [key: string]: string }) => void

// 로그인 파라미터 타입 정의
export type LoginParams = {
  id: string
  password: string
}

export type KakaoLoginParams = {
  email: string
  // password: string
}

export type RegisterParams = {
  id: string
  username: string
  password: string
}

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
  accountId: number
  id: string
  name: string
  email: string
  nickname: string
  avatar?: string | null
}

export type KakaoUserDataType = {
  accountId: number
  snsId: string
  name: string
  email: string
  birth: string
  gender: string
  // email: string
  //몇개 더 추가
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  kakaoUser: KakaoUserDataType | null
  setKakaoUser: (value: KakaoUserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  kakaoLogin: (params: any) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
