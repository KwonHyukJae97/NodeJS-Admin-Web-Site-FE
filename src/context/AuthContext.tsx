// ** React Imports
import {createContext, useEffect, useState, ReactNode} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  KakaoLoginParams,
  KakaoUserDataType
} from './types'
import auth from 'src/configs/auth'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  kakaoUser: null,
  setKakaoUser: () => null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  kakaoLogin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({children}: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [kakaoUser, setKakaoUser] = useState<KakaoUserDataType | null>(defaultProvider.kakaoUser)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  // 사이트 접속 시, 사용자 정보 유무로 로그인 여부 체크
  useEffect(() => {
    const initAuth = async () : Promise<void> => {
      setIsInitialized(true)

      const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!
      console.log('userData', userData)

      // localstorage에 사용자 정보가 있으면
      if (userData) {
        setLoading(true)
        console.log('사용자 정보 있음')

        await axios.get(authConfig.meEndpoint, {withCredentials: true})
          .then(async response => {
            console.log('사용자 정보 조회 성공 시, 응답', response)

            const user : UserDataType = {
              accountId: response.data.accountId,
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              nickname: response.data.nickname,
              avatar: null
            }
            setLoading(false)
            setUser(user)
          })
          .catch(() => {
            // 토큰 만료 시, 로그인 페이지로 이동 / 로컬스토리지에 저장되어있는 userData 삭제
            router.push('login')
            localStorage.removeItem(authConfig.storageUserDataKeyName)
            setUser(null)
            setLoading(false)
            console.log('사용자 정보 조회 실패')
          })
      } else {
        setLoading(false)
        console.log('사용자 정보 없음')
      }
    }
    initAuth()
  }, [])


  // 로그인 요청 시, 실행
  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params, {withCredentials: true})
      .then(async response => {
        console.log('로그인 성공 시 응답', response)
      })
      .then( () => {
        axios
          .get(authConfig.meEndpoint, {
            withCredentials: true
          })
          .then(async response => {
            const returnUrl = router.query.returnUrl
            console.log('returnUrl', returnUrl)

            console.log('사용자 정보 조회 성공 시, 응답', response)

            const user : UserDataType = {
              accountId: response.data.accountId,
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              nickname: response.data.nickname,
              avatar: null
            }

            setUser(user)
            await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user))

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

            await router.replace(redirectURL as string)
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  //카카오 로그인 요청 시 실행
  const handleKakaoLogin = (params: any, errorCallback?: ErrCallbackType) => {
    console.log('params!!', params)
    axios
      .post(authConfig.loginEndPoint2, params, { withCredentials: true })
      .then(res => {
        console.log('로그인 성공 시 응답', res.data)
        if (res.data.loginSuccess == true) {
          axios
            .get(authConfig.kakaoLoginEndPoint, {
              withCredentials: true
            })
            .then(async res => {
              const returnUrl = router.query.returnUrl
              console.log('returnUrl', returnUrl)

              console.log('사용자 정보 조회 성공 시 응답', res)

              const kakaoUser: KakaoUserDataType = {
                accountId: res.data.accountId,
                snsId: res.data.email,
                name: res.data.name,
                email: res.data.email,
                birth: res.data.birth,
                gender: res.data.gender
              }
              console.log('로그인 테스트', kakaoUser)

              setKakaoUser(kakaoUser)
              await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(kakaoUser))

              const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

              await router.replace(redirectURL as string)
            })
        } else {
          console.log('loginSuccess 값 false일경우')
          // router.replace('/login')
          // window.location.href = '/register')
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({id: params.id, password: params.password})
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    kakaoUser,
    setKakaoUser,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    kakaoLogin: handleKakaoLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export {AuthContext, AuthProvider}
