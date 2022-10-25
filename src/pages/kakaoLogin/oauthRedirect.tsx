import React, { useEffect } from 'react'
import axios from 'axios'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useAuth } from 'src/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// 리다이렉트 될 화면 (인가코드 받음) / 로그인 처리 진행시 보여질 화면
const OauthRedirect = () => {
  // const router = useRouter()
  const auth = useAuth()
  // const defaultValues = {
  //     email: 'admin@admin.com',
  //     password: 'admin'
  //   }

  //   const schema = yup.object().shape({
  //     email: yup.string().required('이메일을 입력해주세요.'),
  //     password: yup.string().required('비밀번호를 입력해주세요.')
  //   })
  //   const {
  //     control,
  //     setError,
  //     handleSubmit,
  //     formState: { errors }
  //   } = useForm({
  //     defaultValues,
  //     mode: 'onBlur',
  //     resolver: yupResolver(schema)
  //   })

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code')
    console.log('카카오 인가코드입니다', code)

    async function getTest() {
      console.log('getTest')
      const body = getBody(code)
      console.log(body)

      const kakaoAccessToken = await getKakaoToken(body)
      console.log('카카오 토큰입니다.', kakaoAccessToken)

      if (kakaoAccessToken) {
        await getKakaoUserInfo(kakaoAccessToken)
        // const kakaoUserInfo = await getKakaoUserInfo(kakaoAccessToken)
        // if (kakaoUserInfo) {
        //   await getAuthKakao(kakaoUserInfo)
        // }
      }
    }
    getTest()
  }, [])

  const getBody = (code: any) => {
    const qs = require('qs')
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: '214f882001474304a397de3fa79c9de0',
      code: code
    })
    return body
  }

  // const dispatch = useDispatch()
  // const navigate = useNavigate()
  // const [cookies, setCookie] = useCookies(['token'])
  // const code = new URL(window.location.href).searchParams.get('code')

  const getKakaoToken = async (body: any) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }

    //응답받은 인가코드로 카카오서버에 토큰 발급 요청
    const response = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      timeout: 30000,
      headers,
      data: body
    })

    if (response.status === 200) {
      const kakaoAccessToken = response.data.access_token
      return kakaoAccessToken
    }

    return null
  }

  const getKakaoUserInfo = async (kakaoAccessToken: any) => {
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: 'Bearer ' + kakaoAccessToken
    }

    // 응답 받은 토큰으로 카카오서버에 유저 정보 요청
    const responseUserInfo = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      timeout: 30000,
      headers: headerUserInfo
    })

    if (responseUserInfo.status === 200) {
      const kakaoUserInfo = {
        snsId: responseUserInfo.data.kakao_account.email,
        name: responseUserInfo.data.kakao_account.profile.nickname,
        birth: responseUserInfo.data.kakao_account.birthday,
        gender: responseUserInfo.data.kakao_account.gender,
        kakaoAccessToken2: kakaoAccessToken,
        kakaoAccount: responseUserInfo.data.kakao_account
        // snsId: responseUserInfo.data.kako_account.email
        // snsType: '01'
      }
      const { name, birth, gender, snsId, kakaoAccessToken2 } = kakaoUserInfo

      console.log('카카오 이름.', name)
      console.log('카카오 snsID.', snsId)
      console.log('카카오 생일.', birth)
      console.log('카카오 성별.', gender)
      console.log('카카오 토큰.', kakaoAccessToken2)

      // return kakaoUserInfo
      auth.kakaoLogin(kakaoUserInfo)
    }

    return null
  }

  // const getAuthKakao = async (kakaoUserInfo: any) => {
  //   const userInfo = await axios({
  //     method: 'POST',
  //     url: 'http://localhost:3000/auth/kakao',
  //     data: kakaoUserInfo
  //     // headers: headerUserInfo
  //   })
  //     .then(res => {
  //       //BE 에서 DB와 비교후 가입 기록이 있는지 확인한 결과값 받음.(가입기록 있음)
  //       console.log('DB조회 결과값: ', res.data.loginSuccess)
  //       console.log('토큰: ', res.data)
  //       const loginSuccess = res.data.loginSuccess

  //       const accessToken = res.data.accessToken

  //       console.log('accessToken??', accessToken)
  //       console.log('eamil??', kakaoUserInfo.email)

  //       if (loginSuccess == true) {
  //         console.log('test!!')
  //         auth.kakaoLogin(accessToken)
  //       }
  //     })
  //     .catch(err => {
  //       //BE 에서 DB와 비교후 가입 기록이 있는지 확인한 결과값 받음.(가입기록 없음)
  //       console.log('errorrerr', err)
  //     })
  // }

  // if (response.status === 200) {

  //   if (responseUserInfo.status === 200) {
  //     const kakaoUserInfo = {
  //       email: responseUserInfo.data.kakao_account.email,
  //       name: responseUserInfo.data.kakao_account.profile.nickname,
  //       birth: responseUserInfo.data.kakao_account.birthday,
  //       gender: responseUserInfo.data.kakao_account.gender,
  //       kakaoAccessToken: kakaoAccessToken,
  //       kakaoAccount: responseUserInfo.data.kakao_account
  //       // snsId: responseUserInfo.data.kako_account.email,
  //       // snsType: '01'
  //     }
  //     const { name, email, birth, gender } = kakaoUserInfo

  //     console.log('카카오 유저 정보입니다1.', name)
  //     console.log('카카오 유저 정보입니다2.', email)
  //     console.log('카카오 유저 정보입니다3.', birth)
  //     console.log('카카오 유저 정보입니다4.', gender)
  //     // console.log('카카오 유저 정보입니다5.', snsType)
  //     // console.log('카카오 유저 정보입니다5.', snsId)

  //     // const headerUserInfo = {
  //     //   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  //     //   Authorization: 'Bearer ' + kakaoAccessToken
  //     // }

  //     const userInfo = await axios({
  //       method: 'POST',
  //       url: 'http://localhost:3000/auth/kakao',
  //       data: kakaoUserInfo
  //       // headers: headerUserInfo
  //     })
  //       .then(res => {
  //         //BE 에서 DB와 비교후 가입 기록이 있는지 확인한 결과값 받음.(가입기록 있음)
  //         console.log('DB조회 결과값: ', res.data.loginSuccess)
  //         console.log('토큰: ', res.data)
  //         const loginSuccess = res.data.loginSuccess

  //         const accessToken = res.data.accessToken

  //         console.log('accessToken??', accessToken)
  //         console.log('eamil??', email)

  //         if (loginSuccess == true) {
  //           console.log('test!!')
  //           // auth.kakaoLogin(accessToken)
  //         }
  //       })
  //       .catch(err => {
  //         //BE 에서 DB와 비교후 가입 기록이 있는지 확인한 결과값 받음.(가입기록 없음)
  //         console.log('errorrerr', err)
  //       })
  //   }
  // }
  return <h4>로그인 중2입니다.</h4>
}

export default OauthRedirect
