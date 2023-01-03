// 레벨 카테고리 type 정의
export type LevelCategoryType = {
  id?: number;
  levelCategoryId: number;
  levelCategoryName: string;
  levelSequence: number;
  studyTypeCode: string;
  studyTypeName: string;
  levelCategoryCount: number;
  totalCount: number;
};

// 학습 영역 정보 type 정의
export type studyTypeCodeType = {
  studyTypeCode: number;
  studyTypeName: string;
};

// 회원사 props type 정의
export type CompanyLayoutProps = {
  id: number | undefined;
};
