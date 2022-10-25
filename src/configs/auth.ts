// export default {
//   meEndpoint: 'http://localhost:3000/auth/me',
//   loginEndpoint: 'http://localhost:3000/auth/login/admin',
//   registerEndpoint: '/jwt/register',
//   storageTokenKeyName: 'authorization'
// }

// export default {
//   meEndpoint: 'http://localhost:3002/auth/me',
//   loginEndpoint: 'http://localhost:3002/auth/login/admin',
//   storageUserDataKeyName: 'kakaoUserData',
//   registerEndpoint: '/jwt/register',
//   storageTokenKeyName: 'authorization'
// }

export default {
  meEndpoint: '/auth/me',
  // loginEndpoint: '/dashboards/crm',
  loginEndpoint: '/jwt/login',
  loginEndPoint2: 'http://localhost:3000/auth/kakao',
  kakaoLoginEndPoint: 'http://localhost:3000/auth/me',
  storageUserDataKeyName: 'kakaoUserData',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'authorization'
}
