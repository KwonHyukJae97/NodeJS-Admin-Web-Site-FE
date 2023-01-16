import axios from 'axios';
import apiConfig from 'src/configs/api';
import tokenAuth from 'src/hooks/tokenAuth';

//Api axios생성하여 Api를 사용한 통신은 이 부분을 통해 선 처리 후 리턴
const Api = axios.create({
  baseURL: apiConfig.apiEndpoint,
  timeout: 10000,
  params: {},
  withCredentials: true, //Api axios를 이용하여 BE와 통신 할 경우 쿠키 허용 설정값을 true 로 설정
});

export const ApiSSR = axios.create({
  baseURL: apiConfig.apiEndpoint,
  timeout: 10000,
  params: {},
  withCredentials: true, //Api axios를 이용하여 BE와 통신 할 경우 쿠키 허용 설정값을 true 로 설정
});

// axios.defaults.withCredentials = true;

//엑세스 토큰 검증을 위한 tokenAuth로 이동하여 검증
Api.interceptors.request.use(tokenAuth);
// ApiSSR.interceptors.request.use(tokenAuth);

export default Api;
