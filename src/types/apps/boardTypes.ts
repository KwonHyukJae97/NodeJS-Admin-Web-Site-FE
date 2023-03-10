// 공지사항 타입 정의
export type NoticeType = {
  id?: number;
  boardId: number;
  isTop: boolean;
  title: string;
  content?: string;
  viewCnt?: number;
  regDate: string;
  writer?: string;
  fileList?: any;
  noticeGrant?: string;
};

export const noticeGrantList = [
  {
    name: '본사용',
    value: '0',
  },

  // {
  //   name: '회원사용',
  //   value: '0|1',
  // },
  // {
  //   name: '사용자용',
  //   value: '0|1|2',
  // },
];

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
  isComment?: boolean;
  title: string;
  content?: string;
  viewCnt?: number;
  regDate: string;
  writer?: string;
  commenter?: string | null;
  fileList?: any;
};

// Comment 타입 정의
export type CommentType = {
  id?: number;
  commentId: number;
  commenter: string;
  comment: string;
  regDate: string;
  adminId: number;
};
