// ** Demo Components Imports
import FaqEditPage from 'src/views/board/edit/FaqEditPage';
import { useRouter } from 'next/router';

// FAQ 수정 페이지
const FaqEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  return <FaqEditPage id={Number(id)} />;
};

// const FaqEdit = ({ id, categoryApiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
//   return <FaqEditPage id={id} categoryApiData={categoryApiData} />;
// };
//
// FAQ 조회 API 호출
// export const getAllFaq = async () => {
//   try {
//     const res = await axios.get(`${apiConfig.apiEndpoint}/faq`, {
//       data: { role, pageNo: 1, pageSize: 10, totalData: true },
//     });
//
//     return res.data.items;
//   } catch (err) {
//     console.log(err);
//   }
// };

// // getStaticPaths에서 동적 경로를 할당할 id값들을 지정해줘야, 해당 경로로 접근이 가능하기 때문에 모든 데이터 조회
// export const getStaticPaths: GetStaticPaths = async () => {
//   const result = await getAllFaq();
//
//   const apiData: FaqType[] = result;
//
//   const paths = apiData.map((item: any) => ({
//     params: { id: `${item.faqId}` },
//   }));
//
//   return {
//     paths,
//     fallback: false,
//   };
// };
//
// export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
//   const result = await getAllCategory();
//
//   const categoryApiData: CategoryType[] = result;
//
//   return {
//     props: {
//       id: params?.id,
//       categoryApiData: categoryApiData,
//     },
//   };
// };

export default FaqEdit;
