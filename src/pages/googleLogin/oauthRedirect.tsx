import axios from 'axios';
import { ReactNode, useEffect } from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { useAuth } from 'src/hooks/useAuth';
import qs from 'qs';

// 리다이렉트 될 화면 (인가코드 받음) / 구글 로그인 처리 진행시 보여질 화면
const OauthRedirect = () => {
  const auth = useAuth();

  useEffect(() => {
    // 구글 인가코드
    const code = new URL(window.location.href).searchParams.get('code');

    async function getTest() {
      const body = getBody(code);
      const googleAccessToken = await getGoogleToken(body);

      if (googleAccessToken) {
        await getGoogleUserInfo(googleAccessToken);
      }
    }
    getTest();
  });

  //토큰 요청에 필요한 body값 정의
  const getBody = (code: any) => {
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      code: code,
      client_secret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`,
      redirect_uri: `${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`,
    });

    return body;
  };

  //구글 접근 토큰 요청
  const getGoogleToken = async (body: any) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    //응답받은 인가코드로 구글서버에 토큰 요청
    const response = await axios({
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
      timeout: 30000,
      headers,
      data: body,
    });

    if (response.status === 200) {
      const googleAccessToken = response.data.access_token;

      return googleAccessToken;
    }

    return null;
  };

  const getGoogleUserInfo = async (googleAccessToken: any) => {
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: 'Bearer ' + googleAccessToken,
    };

    //응답받은 토큰으로 구글 서버에 유저 정보 요청
    const responseUserInfo = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: headerUserInfo,
      timeout: 30000,
    });

    if (responseUserInfo.status === 200) {
      const googleUserInfo = {
        snsId: responseUserInfo.data.email,
        googleAccount: responseUserInfo.data,
        resGoogleAccessToken: googleAccessToken,
      };

      auth.googleLogin(googleUserInfo);
    }

    return null;
  };

  return <h4>구글 로그인 중입니다. 잠시만 기다려주세요.</h4>;
};

OauthRedirect.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
OauthRedirect.guestGuard = true;

export default OauthRedirect;
