// ** Next Import
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types';

// ** Third Party Imports
import axios from 'axios';
import { getCategory } from '../list';
import apiConfig from 'src/configs/api';

// ** Types
import { role } from '../../notice/list';
import { BoardType } from 'src/types/apps/userTypes';
import { CategoryType } from 'src/types/apps/boardTypes';

// ** Demo Components Imports
import FaqEditPage from 'src/views/board/edit/FaqEditPage';

// FAQ 수정 페이지
const FaqEdit = ({ id, categoryApiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <FaqEditPage id={id} categoryApiData={categoryApiData} />;
};

// FAQ 조회 API 호출
export const getFaq = async () => {
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/faq`, {
      data: { role, pageNo: 1, pageSize: 10, totalData: true },
    });

    return res.data.items;
  } catch (err) {
    console.log(err);
  }
};

// FAQ 상세조회 API 호출
export const getFaqDetail = async (id: number) => {
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/faq/${id}`, {
      data: { role },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// getStaticPaths에서 동적 경로를 할당할 id값들을 지정해줘야, 해당 경로로 접근이 가능하기 때문에 모든 데이터 조회
export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getFaq();

  const apiData: BoardType[] = result;

  const paths = apiData.map((item: any) => ({
    params: { id: `${item.faqId}` },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const categoryResult = await getCategory();

  const categoryApiData: CategoryType[] = categoryResult;

  return {
    props: {
      id: params?.id,
      categoryApiData: categoryApiData,
    },
  };
};

export default FaqEdit;
