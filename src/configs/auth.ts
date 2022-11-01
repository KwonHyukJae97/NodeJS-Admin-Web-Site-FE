export default {
  meEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
  loginEndpoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login/admin`,

  loginEndPoint2: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/kakao`,
  kakaoLoginEndPoint: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
  storageUserDataKeyName: `userData`,
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
