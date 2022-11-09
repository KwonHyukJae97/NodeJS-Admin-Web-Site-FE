// company list type
export type CompanyType = {
  company_id: number;
  company_name: string;
  user_count: number;
  admin_count: number;
  business_number: string;
  company_code: number;
  reg_date: string;
};

export type CompanyLayoutProps = {
  id: number | undefined;
};
