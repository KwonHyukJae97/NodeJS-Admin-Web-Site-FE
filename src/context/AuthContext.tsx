// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

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

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [kakaoUser, setKakaoUser] = useState<KakaoUserDataType | null>(defaultProvider.kakaoUser)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params, { withCredentials: true })
      .then(async res => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
      })
      .then(() => {
        axios
          .get(authConfig.meEndpoint, {
            withCredentials: true,
            headers: {
              Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
            }
          })
          .then(async response => {
            const returnUrl = router.query.returnUrl

            setUser({ ...response.data.userData })
            await window.localStorage.setItem('userData', JSON.stringify(response.data.userData))

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

            router.replace(redirectURL as string)
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleKakaoLogin = async (params: any, errorCallback?: ErrCallbackType) => {
    console.log('params!!', params)
    axios
      .post(authConfig.loginEndPoint2, params, { withCredentials: true })
      .then(async res => {
        console.log('로그인 성공 시 응답', res.data)
      })
      .then(() => {
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
              name: res.data.name
            }
            console.log('로그인 테스트1', kakaoUser)

            setKakaoUser(kakaoUser)
            await window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(kakaoUser))

            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

            await router.replace(redirectURL as string)
          })
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
          handleLogin({ email: params.email, password: params.password })
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

export { AuthContext, AuthProvider }
