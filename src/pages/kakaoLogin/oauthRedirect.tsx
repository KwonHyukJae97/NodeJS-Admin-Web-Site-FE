import React, { ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from 'src/hooks/useAuth';
import BlankLayout from 'src/@core/layouts/BlankLayout';

// 리다이렉트 될 화면 (인가코드 받음) / 로그인 처리 진행시 보여질 화면
const OauthRedirect = () => {
  // const router = useRouter()
  const auth = useAuth();

  useEffect(() => {
    console.log('redirect test');
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('카카오 인가코드입니다', code);

    async function getTest() {
      console.log('getTest');
      const body = getBody(code);
      console.log(body);

      const kakaoAccessToken = await getKakaoToken(body);
      console.log('카카오 토큰입니다.', kakaoAccessToken);

      if (kakaoAccessToken) {
        await getKakaoUserInfo(kakaoAccessToken);
      }
    }
    getTest();
  }, []);

  const getBody = (code: any) => {
    const qs = require('qs');
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: '214f882001474304a397de3fa79c9de0',
      code: code,
    });
    return body;
  };

  const getKakaoToken = async (body: any) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    //응답받은 인가코드로 카카오서버에 토큰 발급 요청
    const response = await axios({
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
    const responseUserInfo = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      timeout: 30000,
      headers: headerUserInfo,
    });

    if (responseUserInfo.status === 200) {
      const kakaoUserInfo = {
        snsId: responseUserInfo.data.kakao_account.email,
        name: responseUserInfo.data.kakao_account.profile.nickname,
        nickname: responseUserInfo.data.kakao_account.profile.nickname,
        birth: responseUserInfo.data.kakao_account.birthday,
        gender: responseUserInfo.data.kakao_account.gender,
        resKakaoAccessToken: kakaoAccessToken,
        kakaoAccount: responseUserInfo.data.kakao_account,
      };
      const { name, nickname, birth, gender, snsId, resKakaoAccessToken } = kakaoUserInfo;

      console.log('카카오 이름.', name);
      console.log('카카오 닉네임.', nickname);
      console.log('카카오 snsID.', snsId);
      console.log('카카오 생일.', birth);
      console.log('카카오 성별.', gender);
      console.log('카카오 토큰.', resKakaoAccessToken);

      // return kakaoUserInfo
      auth.kakaoLogin(kakaoUserInfo);
    }

    return null;
  };

  return <h4>카카오 로그인 중입니다. 잠시만 기다려주세요.</h4>;
};
OauthRedirect.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
OauthRedirect.guestGuard = true;

export default OauthRedirect;
