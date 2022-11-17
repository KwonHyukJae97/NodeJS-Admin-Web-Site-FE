import { ReactNode } from 'react';

export type PageLeftHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  maincategory?: ReactNode;
  subcategory?: ReactNode;
  setPageNo: (value: number) => void;
  setSearchWord?: (value: string) => void;
  pageName: string;
  setSearchKey?: (value: string) => void;
};
