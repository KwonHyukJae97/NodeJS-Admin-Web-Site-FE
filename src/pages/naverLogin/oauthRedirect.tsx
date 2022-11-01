import axios from 'axios';
import { ReactNode, useEffect } from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { useAuth } from 'src/hooks/useAuth';

const OauthRedirect = () => {
  const auth = useAuth();

  useEffect(() => {
    console.log('naver 리다이렉트 테스트');
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('네이버 인가 코드 값', code);

    async function getTest() {
      console.log('get Body Test');
      const body = getBody(code);
      console.log(body);

      const naverAccessToken = await getNaverToken(body);
      console.log('네이버 토큰 값', naverAccessToken);

      if (naverAccessToken) {
        await getNaverUserInfo(naverAccessToken);
      }
    }
    getTest();
  }, []);

  const getBody = (code: any) => {
    const qs = require('qs');
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: `${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`,
      client_secret: 'VbKqfxcl6e',
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

    const response = await axios({
      method: 'POST',
      url: 'https://nid.naver.com/oauth2.0/token',
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

    const responseUserInfo = await axios({
      method: 'GET',
      url: 'https://openapi.naver.com/v1/nid/me',
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
      const {
        discrimination,
        nickname,
        name,
        snsId,
        gender,
        age,
        birthday,
        profileImages,
        birthyear,
        phone,
        resNaverAccessToken,
        naverAccount,
      } = naverUserInfo;

      console.log('네이버 식별정보', discrimination);
      console.log('네이버 닉네임', nickname);
      console.log('네이버 이름', name);
      console.log('네이버 이메일', snsId);
      console.log('네이버 성별', gender);
      console.log('네이버 연령대', age);
      console.log('네이버 생일', birthday);
      console.log('네이버 이미지', profileImages);
      console.log('네이버 출생년도', birthyear);
      console.log('네이버 전화번호', phone);
      console.log('네이버 정보 전체', naverAccount);
      console.log('네이버 토큰', resNaverAccessToken);

      // auth.naverLogin(naverUserInfo);
    }
    return null;
  };

  return <h4>네이버 로그인중 입니다. 잠시만 기다려주세요.</h4>;
};
OauthRedirect.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
OauthRedirect.guestGuard = true;

export default OauthRedirect;
