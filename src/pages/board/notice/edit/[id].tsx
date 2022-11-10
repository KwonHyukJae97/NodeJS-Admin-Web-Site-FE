// ** Next Import
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types';

// ** Third Party Imports
import axios from 'axios';

// ** Types
import apiConfig from '../../../../configs/api';
import { noticeGrant, role } from '../list';
import { BoardType } from '../../../../types/apps/userTypes';

// ** Demo Components Imports
import NoticeEditPage from 'src/views/board/edit/NoticeEditPage';

const NoticeEdit = ({
  id,
  title,
  isTop,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <NoticeEditPage id={id} title={title} content={content} isTop={isTop} />;
};

// Notice 조회 API 요청 함수
export const getNotice = async () => {
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/notice`, {
      data: { role, noticeGrant, pageNo: 1, pageSize: 10, totalData: true },
    });

    return res.data.items;
  } catch (err) {
    console.log(err);
  }
};

// Notice 상세조회 API 요청 함수
export const getNoticeDetail = async (id: number) => {
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/notice/${id}`, {
      data: { role },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// getStaticPaths에서 동적 경로를 할당할 id값들을 지정해줘야, 해당 경로로 접근이 가능하기 때문에 모든 데이터 조회
export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getNotice();

  const apiData: BoardType[] = result;

  const paths = apiData.map((item: any) => ({
    params: { id: `${item.noticeId}` },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  // @ts-ignore
  const { id } = params;
  const result = await getNoticeDetail(id);

  // NoticeEditPage에서 defaultValues로 설정하기 위해 Props로 전달
  const title = result.notice.board.title;
  const isTop = result.notice.isTop;
  const content = result.notice.board.content;

  return {
    props: {
      id: params?.id,
      title: title,
      content: content,
      isTop: isTop,
    },
  };
};

export default NoticeEdit;
