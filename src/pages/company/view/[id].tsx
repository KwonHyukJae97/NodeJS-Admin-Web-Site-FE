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
import { CompanyType } from 'src/types/apps/companyTypes';

// ** Config
import apiConfig from 'src/configs/api';

import View from 'src/views/apps/company/view/view';

const CompanyView = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <View id={id} />;
};

// 회원사 상세 정보 조회 API 호출
export const getCompany = async () => {
  try {
    const res = await axios.get(`${apiConfig.apiEndpoint}/company`, {
      data: { pageNo: 1, pageSize: 10, totalData: true },
    });

    return res.data.items;
  } catch (err) {
    console.log(err);
  }
};

// getStaticPaths에서 동적 경로를 할당할 id값들을 지정해줘야, 해당 경로로 접근이 가능하기 때문에 모든 데이터 조회
export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getCompany();

  const apiData: CompanyType[] = result;

  const paths = apiData.map((item: any) => ({
    params: { id: `${item.companyId}` },
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

export default CompanyView;
