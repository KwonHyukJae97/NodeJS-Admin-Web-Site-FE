// 전체 단어 타입 정의
export type WordType = {
  id: number;
  wordId: number;
  wordLevelId?: number;
  projectId?: number;
  connectWordId?: number;
  wordName: string;
  mean: string;
  wordStatus: string;
  isMainWord: boolean;
  isAutoMain: boolean;
  wordFiles?: WordFileType[];
  examples?: ExampleType[];
  similarWords?: SimilarWordType[];
};

export type WordFileType = {
  wordFileId: number;
  fileCode: string;
  filePath: string;
  isExist?: string;
};

export type ExampleType = {
  exampleId: number;
  sentence: string;
  translation: string;
  source: string;
  exampleSequence: number;
};

export type SimilarWordType = {
  wordId: number;
  wordLevelId?: number;
  projectId?: number;
  connectWordId?: number;
  wordName: string;
  mean: string;
  wordStatus: string;
  isMainWord: boolean;
  isAutoMain: boolean;
  wordFiles?: WordFileType[];
  examples?: ExampleType[];
};
