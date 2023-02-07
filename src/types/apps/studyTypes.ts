//학습관리 타입 정의
export type StudyType = {
  id?: number;
  studyId: number;
  studyTypeCode: string;
  studyName: string;
  studyMode: string;
  isService: boolean;
  regBy: string;
  regDate: string;
  totalCount: number;
};
