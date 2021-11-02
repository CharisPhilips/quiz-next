import Router, { useRouter } from 'next/router';
import QuizHead from '../../../components/Layouts/QuizHead';
import StatsPageContent from '../../../components/Pages/Stats';

const stats = () => {
  const router = useRouter();
  const { quizlistId } = router.query;

  if (!quizlistId) return null;

  return (
    <StatsPageContent quizlistId={quizlistId} quizMode={'all'}>
      <QuizHead>
        <title>Quiz App Stats</title>
        <meta name='description' content='Quiz App Stats'></meta>
      </QuizHead>
    </StatsPageContent>
  );
};

export default stats;
