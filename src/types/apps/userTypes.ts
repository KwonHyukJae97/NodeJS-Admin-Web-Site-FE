// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UserLayoutType = {
  id: string | undefined
}

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  nickname: string
  username: string

  // Table 컴포넌트에서 발생하는 에러 처리를 위해 임시로 name 필드 추가
  name: string
  currentPlan: string
  avatarColor?: ThemeColor
}

export type BoardType = {
  id: number
  isTop: boolean
  title: string
  viewCnt: number
  regDate: string
}

export const boardData: BoardType[] = [
  {
    id: 100,
    isTop: true,
    title: '서비스 이용 점검 안내',
    viewCnt: 23541,
    regDate: '2022-10-25'
  },
  {
    id: 99,
    isTop: true,
    title: 'TenPick 일부 기능의 사양 변경 및 종료 안내',
    viewCnt: 265,
    regDate: '2022-10-23'
  },
  {
    id: 98,
    isTop: true,
    title: '서비스 이용 방식 안내',
    viewCnt: 26985,
    regDate: '2022-10-20'
  },
  {
    id: 97,
    isTop: false,
    title: 'TenPick 비정기 업데이트 소식',
    viewCnt: 8952,
    regDate: '2022-10-15'
  },
  {
    id: 96,
    isTop: false,
    title: '일부 라이센스 변경 안내',
    viewCnt: 26588,
    regDate: '2022-09-25'
  },
  {
    id: 95,
    isTop: false,
    title: '일부 기능 종료 안내',
    viewCnt: 965,
    regDate: '2022-09-08'
  },
  {
    id: 94,
    isTop: false,
    title: '서비스 공식 지원 환경 변경 사전 안내',
    viewCnt: 120,
    regDate: '2022-09-02'
  },
  {
    id: 93,
    isTop: false,
    title: '업데이트에 따른 로그인 오류 안내',
    viewCnt: 3694,
    regDate: '2022-08-29'
  },
  {
    id: 92,
    isTop: false,
    title: 'TenPick 서비스 이용약관 변경 안내',
    viewCnt: 8452,
    regDate: '2022-08-22'
  },
  {
    id: 91,
    isTop: false,
    title: '연휴 기간 고객센터 휴무 안내',
    viewCnt: 1247,
    regDate: '2022-08-17'
  },
]
