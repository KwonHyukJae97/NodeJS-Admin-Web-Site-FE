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
  studyTypeCode: string;
  studyTypeName: string;
};

// 레벨 카테고리 상세 정보 type 정의
export type LevelCategoryDetailType = {
  id?: number;
  levelCategoryId: number;
  levelCategoryName: string;
  levelSequence: number;
  levelStepStart: number;
  levelStepEnd: number;
};
