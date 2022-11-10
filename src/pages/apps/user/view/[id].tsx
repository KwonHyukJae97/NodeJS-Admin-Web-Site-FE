// ** Next Import
// import {
//   GetStaticPaths,
//   GetStaticProps,
//   GetStaticPropsContext,
//   InferGetStaticPropsType,
// } from 'next/types';

// // ** Third Party Imports
// import axios from 'axios';

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes';

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage';
import { useRouter } from 'next/router';

const UserView = () => {
  const router = useRouter();
  const { accountId } = router.query;
  console.log('accountId????', accountId);
  const invoiceData: InvoiceType[] = [];

  return <UserViewPage accountId={accountId} invoiceData={invoiceData} />;
};

//유저드롭박스에서 어카운트아이디 107번 을 UserViewPage에 id 값을 넘김

// export const getStaticPaths: GetStaticPaths = async () => {
//   const res = await axios.get('/apps/users/list');
//   const userDate: InvoiceType[] = await res.data.allData;

//   const paths = userDate.map((item: InvoiceType) => ({
//     params: { id: `${item.id}` },
//   }));

//   return {
//     paths,
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
//   const res = await axios.get('/apps/invoice/invoices');
//   const invoiceData: InvoiceType[] = res.data.allData;

//   return {
//     props: {
//       invoiceData,
//       id: params?.id,
//     },
//   };
// };

export default UserView;
