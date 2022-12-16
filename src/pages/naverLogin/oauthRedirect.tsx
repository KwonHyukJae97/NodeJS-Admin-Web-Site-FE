import axios from 'axios';
import { ReactNode, useEffect } from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { useAuth } from 'src/hooks/useAuth';
import qs from 'qs';

// 리다이렉트 될 화면 (인가코드 받음) / 네이버 로그인 처리 진행시 보여질 화면
const OauthRedirect = () => {
  const auth = useAuth();

  useEffect(() => {
    //네이버 인가코드
    const code = new URL(window.location.href).searchParams.get('code');

    async function getTest() {
      const body = getBody(code);
      const naverAccessToken = await getNaverToken(body);

      if (naverAccessToken) {
        await getNaverUserInfo(naverAccessToken);
      }
    }
    getTest();
  });

  //토큰 요청에 필요한 body값 정의
  const getBody = (code: any) => {
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: `${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`,
      client_secret: `${process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET}`,
      code: code,
      state: encodeURI(`${process.env.NEXT_PUBLIC_NAVER_STATE_STRING}`),
    });

    return body;
  };

  //네이버 접근 토큰 요청
  const getNaverToken = async (body: any) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    //응답받은 인가코드로 네이버 서버에 토큰 발급 요청
    const response = await axios({
      method: 'POST',
      url: '/nid_naver/oauth2.0/token',
      timeout: 30000,
      headers,
      data: body,
    });

    if (response.status === 200) {
      const naverAccessToken = response.data.access_token;

      return naverAccessToken;
    }

    return null;
  };

  const getNaverUserInfo = async (naverAccessToken: any) => {
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: 'Bearer ' + naverAccessToken,
    };

    // 응답 받은 토큰으로 네이버서버에 유저 정보 요청
    const responseUserInfo = await axios({
      method: 'GET',
      url: '/openapi_naver/v1/nid/me',
      timeout: 30000,
      headers: headerUserInfo,
    });

    if (responseUserInfo.status === 200) {
      const naverUserInfo = {
        //식별 정보
        discrimination: responseUserInfo.data.response.id,
        nickname: responseUserInfo.data.response.nickname,
        name: responseUserInfo.data.response.name,
        snsId: responseUserInfo.data.response.email,
        gender: responseUserInfo.data.response.gender,
        age: responseUserInfo.data.response.age,
        birthday: responseUserInfo.data.response.birthday,
        profileImages: responseUserInfo.data.response.profile_image,
        birthyear: responseUserInfo.data.response.birthyear,
        phone: responseUserInfo.data.response.mobile,
        naverAccount: responseUserInfo.data.response,
        resNaverAccessToken: naverAccessToken,
      };

      auth.naverLogin(naverUserInfo);
    }

    return null;
  };

  return <h4>네이버 로그인중 입니다. 잠시만 기다려주세요.</h4>;
};
OauthRedirect.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
OauthRedirect.guestGuard = true;

export default OauthRedirect;
