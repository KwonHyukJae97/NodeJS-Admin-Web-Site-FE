// Faq 타입 정의
export type FaqType = {
  id?: number;
  boardId: number;
  categoryId?: number;
  categoryName: string;
  isUse?: boolean;
  title: string;
  content?: string;
  viewCnt?: number;
  regDate: string;
  writer?: string;
  fileList?: any;
};

// 카테고리 타입 정의
export type CategoryType = {
  categoryId: number;
  categoryName: string;
  isUse: boolean;
};

// Qna 타입 정의
export type QnaType = {
  id?: number;
  boardId: number;
  isComment: boolean;
  title: string;
  content?: string;
  viewCnt?: number;
  regDate: string;
  writer?: string;
  fileList?: any;
};

// Comment 타입 정의
export type CommentType = {
  id?: number;
  commentId: number;
  writer: string;
  comment: string;
  regDate: string;
  adminId: number;
};
