// company list type
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

export type CompanyLayoutProps = {
  id: number | undefined;
};
