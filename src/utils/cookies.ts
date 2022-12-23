import { Cookies } from 'react-cookie';

const cookies = new Cookies();

//Cookies 에 저장된 AccessToken 삭제 메소드
export const removeCookieAccessToken = () => {
  return cookies.remove('authentication', { sameSite: 'strict', path: '/' });
};
