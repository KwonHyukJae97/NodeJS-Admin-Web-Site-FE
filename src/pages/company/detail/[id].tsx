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

import Detail from 'src/views/apps/company/detail/detail';

const CompanyDetail = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Detail id={id} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get(`${apiConfig.apiEndpoint}/company/`);
  const data: CompanyType[] = await res.data;
  const paths = data.map((item: CompanyType) => ({
    params: { id: `${item.companyId}` },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id,
    },
  };
};

export default CompanyDetail;
