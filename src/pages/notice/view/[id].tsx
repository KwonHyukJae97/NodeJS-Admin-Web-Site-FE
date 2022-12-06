// ** Next Import
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types';

// ** Demo Components Imports
import NoticeViewPage from 'src/views/board/view/NoticeViewPage';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// ** Types Imports
import { noticeGrant, role } from '../list';
import { NoticeType } from 'src/types/apps/boardTypes';

// 공지사항 상세 페이지
const NoticeView = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <NoticeViewPage id={id} />;
};

// 공지사항 조회 API 호출
export const getAllNotice = async () => {
  try {
    const res = await Api.get(`${apiConfig.apiEndpoint}/notice`, {
      data: { role, noticeGrant, pageNo: 1, pageSize: 10, totalData: true },
    });

    return res.data.items;
  } catch (err) {
    console.log(err);
  }
};

// getStaticPaths에서 동적 경로를 할당할 id값들을 지정해줘야, 해당 경로로 접근이 가능하기 때문에 모든 데이터 조회
export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getAllNotice();

  const apiData: NoticeType[] = result;

  const paths = apiData.map((item: any) => ({
    params: { id: `${item.noticeId}` },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id,
    },
  };
};

export default NoticeView;
