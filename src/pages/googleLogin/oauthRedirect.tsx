import axios from 'axios';
import { ReactNode, useEffect } from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { useAuth } from 'src/hooks/useAuth';

const OauthRedirect = () => {
  const auth = useAuth();

  useEffect(() => {
    console.log('google redirect test');
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('구글 인가 코드입니다.', code);

    async function getTest() {
      console.log('google get test');
      const body = getBody(code);
      console.log('google body', body);

      const googleAccessToken = await getGoogleToken(body);
      console.log('구글 토큰입니다.', googleAccessToken);

      if (googleAccessToken) {
        await getGoogleUserInfo(googleAccessToken);
      }
    }
    getTest();
  });

  const getBody = (code: any) => {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const qs = require('qs');
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      code: code,
      client_secret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`,
      redirect_uri: `${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`,
    });

    return body;
  };

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
      const { snsId, googleAccount } = googleUserInfo;
      console.log('google 유저 정보입니다.', googleAccount);
      console.log('google이메일11122', snsId);

      auth.googleLogin(googleUserInfo);
    }

    return null;
  };

  return <h4>구글 로그인 중입니다. 잠시만 기다려주세요.</h4>;
};

OauthRedirect.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
OauthRedirect.guestGuard = true;

export default OauthRedirect;
