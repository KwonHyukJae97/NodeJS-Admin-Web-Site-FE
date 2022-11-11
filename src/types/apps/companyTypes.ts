// 회원사 리스트 type 정의
export type CompanyType = {
  id?: number;
  companyId: number;
  companyName: string;
  userCount: number;
  adminCount: number;
  businessNumber?: string;
  companyCode?: number;
  regDate: string;
};

// 회원사 props type 정의
export type CompanyLayoutProps = {
  id: number | undefined;
};
