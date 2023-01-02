export default {
  meEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
  loginEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login/admin`,
  kakaoLoginEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/kakao`,
  LoginInfoEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
  LogoutEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout/admin`,
  storageUserDataKeyName: `userData`,
  storageTokenDataKeyName: `accessToken`,
  storageExpireAtDataKeyName: `expireAt`,
  registerEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register/admin`,
  kakaoRegisterEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register/kakao/admin`,
  storageTokenKeyName: `authorization`,
};

// export default {
//   meEndpoint: '/auth/me',
//   loginEndpoint: '/jwt/login',
//   registerEndpoint: '/jwt/register',
//   storageTokenKeyName: 'authorization'
// }
//--force npm install
