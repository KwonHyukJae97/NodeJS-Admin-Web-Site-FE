//단어레벨 타입 정의
export type WordLevelType = {
  id?: number;
  projectId: number;
  wordLevelId: number;
  wordLevelSequence: number;
  wordLevelName: string;
  projectName: string;
  isService: boolean;
  regBy: string;
  regDate: string;
  totalCount: number;
};

export type WordLevelNameType = {
  wordLevelId: number;
  wordLevelName: string;
};
