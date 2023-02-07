import View from 'src/views/apps/word_level/edit/WordLevelEditPage';
import { useRouter } from 'next/router';

const WordLevelEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  return <View id={Number(id)} />;
};

export default WordLevelEdit;
