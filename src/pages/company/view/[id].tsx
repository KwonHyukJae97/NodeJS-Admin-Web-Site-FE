import View from 'src/views/apps/company/view/view';
import { useRouter } from 'next/router';

const CompanyView = () => {
  const router = useRouter();
  const { id } = router.query;

  return <View id={Number(id)} />;
};

export default CompanyView;
