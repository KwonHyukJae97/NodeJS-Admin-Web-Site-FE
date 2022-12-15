// ** Next Import
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types';

// ** axios
import axios from 'axios';
import apiConfig from 'src/configs/api';

// ** Types
import { QnaType } from 'src/types/apps/boardTypes';

// ** Demo Components Imports
import QnaEditPage from 'src/views/board/edit/QnaEditPage';

// QnA 수정 페이지
const QnaEdit = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <QnaEditPage id={id} />;
};

// QnA 조회 API 호출
export const getAllQna = async () => {
  // 작성자만 본인의 내역 조회가 가능하기 때문에 임시값 할당
  const accountId = 27;

  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/qna`, {
      data: { accountId, pageNo: 1, pageSize: 10, totalData: true },
    });

    return res.data.items;
  } catch (err) {
    console.log(err);
  }
};

// getStaticPaths에서 동적 경로를 할당할 id값들을 지정해줘야, 해당 경로로 접근이 가능하기 때문에 모든 데이터 조회
export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getAllQna();

  const apiData: QnaType[] = result;

  const paths = apiData.map((item: any) => ({
    params: { id: `${item.qnaId}` },
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

export default QnaEdit;
