import axios, { AxiosRequestConfig } from 'axios';
import moment from 'moment/moment';
import apiConfig from 'src/configs/api';
import authConfig from 'src/configs/auth';
import { ExpireAtDataType, TokenDataType, UserDataType } from 'src/context/types';

//withCredentials: true 설정 추가하기

const tokenAuth = async (config: any): Promise<AxiosRequestConfig> => {
  const accessToken = window.localStorage.getItem(authConfig.storageTokenDataKeyName)!;
  const expireAt = window.localStorage.getItem(authConfig.storageExpireAtDataKeyName)!;

  if (accessToken && expireAt) {
    const exp = JSON.parse(expireAt).expireAt;

    // const expDate = moment(exp).subtract(2, 'h').format('YYYY-MM-DD HH:mm:ss');
    const expDate = moment(exp).format('YYYY-MM-DD HH:mm:ss');

    // const momentDate = moment().add(24, 'milliseconds').format('YYYY-MM-DD HH:mm:ss');
    const momentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    console.log('토큰 만료', expDate);
    console.log('현재시간 ', momentDate);
    console.log(moment(expDate).diff(moment(momentDate)));

    //엑세스 토큰 만료시간 지나면 다시 갱신하는 메소드
    if (moment(expDate).diff(moment(momentDate)) < 0 && accessToken) {
      const response = await axios.get(`${apiConfig.apiEndpoint}/auth/refresh/accessToken`);

      const res = await axios.get(authConfig.meEndpoint);

      const user: UserDataType = {
        accountId: res.data.authInfo.accountId,
        id: res.data.authInfo.id,
        snsId: res.data.authInfo.snsId,
        name: res.data.authInfo.name,
        email: res.data.authInfo.email,
        nickname: res.data.authInfo.nickname,
        avatar: null,
      };
      const newAccessToken: TokenDataType = {
        accessToken: response.data.accessToken,
      };
      const newExpireAt: ExpireAtDataType = {
        expireAt: response.data.expireAt,
      };

      localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));
      localStorage.setItem(authConfig.storageTokenDataKeyName, JSON.stringify(newAccessToken));
      localStorage.setItem(authConfig.storageExpireAtDataKeyName, JSON.stringify(newExpireAt));
    } else {
      const res = await axios.get(authConfig.meEndpoint, {
        withCredentials: true,
      });

      const user: UserDataType = {
        accountId: res.data.authInfo.accountId,
        id: res.data.authInfo.id,
        snsId: res.data.authInfo.snsId,
        name: res.data.authInfo.name,
        email: res.data.authInfo.email,
        nickname: res.data.authInfo.nickname,
        avatar: null,
      };

      localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(user));
    }
  }

  return config;
};

export default tokenAuth;
