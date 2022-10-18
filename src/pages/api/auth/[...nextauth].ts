import NextAuth from "next-auth"
import Providers from "next-auth/providers"

// @ts-ignore
import {NextApiRequest} from "next";
import axios from "axios";
import authConfig from "../../../configs/auth";

// 로그인 인증을 처리할 파일 생성 (테스트용)

export default NextAuth({
  // 로그인 인증 방식 설정하기
  providers: [
    // 이메일과 패스워드 입력으로 인증
    Providers.Credentials({
      // 인증 방식 고유 id명
      id: "email-password-credential",

      // 해당 인증 방식 이름 설정
      name: 'Credentials',
      type: 'credentials',

      // nextAuth에서 자동으로 Form을 만들어주는데, 해당 Form에 들어갈 내용을 입력
      credentials: {
        email: {label: "Id", type: "id", placeholder: "admin"},
        password: {label: "Password", type: "password"}
      },

      // Sign up 버튼을 누르면 들어오는 함수
      // 해당 부분에서 들어온 데이터를 가지고 인증을 진행
      // (지금은 무조건 인증되는 방식으로 처리)
      async authorize(credentials: Record<any, any>, req: NextApiRequest) {
        const body = {
          id: credentials.id,
          password: credentials.password
        }

        const res = await axios.post(authConfig.loginEndpoint, body)

        console.log('req', req)

        const user = await res.data;

        console.log('user', user);

        const credentialsInfo = {
          id: credentials.id,
          accountId: user.account.accountId,
          name: user.account.name,
          email: user.account.email
        }

        if (res.status === 201) {
          console.log(credentialsInfo)
          return credentialsInfo;

        } else {
          return null;
        }
      }
    })
  ],

  // 커스텀 로그인 화면 맵핑
  pages: {
    signIn: '/login',
  },

  // session을 이용해 꺼낼 수 있는 데이터는 email, name, image인데,
  // 사용자마다 session에 저장하고싶은 데이터가 다를 수 있기 때문에 그럴 경우 callbacks 옵션을 추가하여 사용
  // callbacks: {
  //   // 로그인 인증 성공시, jwt()에서 토큰이 생성되고,
  //   async jwt(token, user, account, profile, isNewUser) {
  //     // 토큰 정보에다가 커스텀으로 넣어주고 싶은 데이터 작성
  //     token.accessToken = cookies.get("accessToken");
  //     token.loginSuccess = user?.loginSuccess;
  //
  //     return token
  //   },
  //
  //   // 생성된 토큰을 기반으로 session이 생성됨
  //   async session(session: any, userOrToken: any) {
  //     // userOrToken 파라미터로 토큰 정보를 전달받아 session에 데이터를 넣어줌
  //     session.user.accessToken = userOrToken.accessToken;
  //     session.user.loginSuccess = userOrToken.loginSuccess;
  //     console.log(session)
  //
  //     return session
  //   }
  // }
})
