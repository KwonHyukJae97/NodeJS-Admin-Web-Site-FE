import 'axios';

// axios.defaults.headers.Cookie 타입 재정의
declare module 'axios' {
  export interface HeadersDefaults {
    Cookie?: string;
  }
}
