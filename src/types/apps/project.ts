//프로젝트 타입 정의
export type ProjectType = {
  id?: number;
  projectId: number;
  wordLevelName: string;
  wordLevelId: number;
  projectName: string;
  isService: boolean;
  regBy: string;
  regDate: string;
  totalCount: number;
};
