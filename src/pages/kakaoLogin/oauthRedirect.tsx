import React, { ReactNode, useEffect } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import qs from 'qs';
import Api from 'src/utils/api';

// 리다이렉트 될 화면 (인가코드 받음) / 로그인 처리 진행시 보여질 화면
const OauthRedirect = () => {
  const auth = useAuth();

  useEffect(() => {
    //카카오 인가코드
    const code = new URL(window.location.href).searchParams.get('code');

    async function getTest() {
      const body = getBody(code);
      const kakaoAccessToken = await getKakaoToken(body);

      if (kakaoAccessToken) {
        await getKakaoUserInfo(kakaoAccessToken);
      }
    }
    getTest();
  });

  //토큰 요청에 필요한 body값 정의
  const getBody = (code: any) => {
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: `${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`,
      code: code,
    });

    return body;
  };

  //카카오 접근 토큰 요청
  const getKakaoToken = async (body: any) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    //응답받은 인가코드로 카카오서버에 토큰 발급 요청
    const response = await Api({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      timeout: 30000,
      headers,
      data: body,
    });

    if (response.status === 200) {
      const kakaoAccessToken = response.data.access_token;

      return kakaoAccessToken;
    }

    return null;
  };

  const getKakaoUserInfo = async (kakaoAccessToken: any) => {
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: 'Bearer ' + kakaoAccessToken,
    };

    // 응답 받은 토큰으로 카카오서버에 유저 정보 요청
    const responseUserInfo = await Api({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      timeout: 30000,
      headers: headerUserInfo,
    });

    if (responseUserInfo.status === 200) {
      const kakaoUserInfo = {
        //식별 정보
        snsId: responseUserInfo.data.kakao_account.email,
        name: responseUserInfo.data.kakao_account.profile.nickname,
        nickname: responseUserInfo.data.kakao_account.profile.nickname,
        birth: responseUserInfo.data.kakao_account.birthday,
        gender: responseUserInfo.data.kakao_account.gender,
        resKakaoAccessToken: kakaoAccessToken,
        kakaoAccount: responseUserInfo.data.kakao_account,
      };

      auth.kakaoLogin(kakaoUserInfo);
    }

    return null;
  };

  return <h4>카카오 로그인 중입니다. 잠시만 기다려주세요.</h4>;
};
OauthRedirect.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
OauthRedirect.guestGuard = true;

export default OauthRedirect;
