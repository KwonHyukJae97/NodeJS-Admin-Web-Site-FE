export type CompanyType = {
  id: number;
  companyName: string;
  adminCount: number;
  userCount: number;
  regDate: string;
};

export const CompanyData: CompanyType[] = [
  {
    id: 100,
    companyName: '클라이 에듀',
    adminCount: 5,
    userCount: 335,
    regDate: '2022-10-25',
  },
  {
    id: 99,
    companyName: '샘영어교습소',
    adminCount: 3,
    userCount: 39,
    regDate: '2022-10-23',
  },
  {
    id: 98,
    companyName: 'U2잉글리쉬',
    adminCount: 2,
    userCount: 23,
    regDate: '2022-10-20',
  },
  {
    id: 97,
    companyName: '이랩에듀',
    adminCount: 5,
    userCount: 266,
    regDate: '2022-10-15',
  },
  {
    id: 96,
    companyName: '하이프라임 어학원',
    adminCount: 2,
    userCount: 67,
    regDate: '2022-09-25',
  },
  {
    id: 95,
    companyName: '월스트리트 잉글리쉬',
    adminCount: 2,
    userCount: 88,
    regDate: '2022-09-08',
  },
  {
    id: 94,
    companyName: '랭귀지큐브',
    adminCount: 3,
    userCount: 123,
    regDate: '2022-09-02',
  },
];
