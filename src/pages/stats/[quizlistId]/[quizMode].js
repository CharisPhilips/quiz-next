import { useRouter } from 'next/router';
import QuizHead from '../../../components/Layouts/QuizHead';
import StatsPageContent from '../../../components/Pages/Stats';
import { getToken } from '../../../apis';

const stats = () => {
  const router = useRouter();
  const { quizlistId, quizMode } = router.query;

  if (!quizlistId) return null;

  return (
    <StatsPageContent quizlistId={quizlistId} quizMode={quizMode}>
      <QuizHead>
        <title>Quiz App Stats</title>
        <meta name='description' content='Quiz App Stats'></meta>
      </QuizHead>
    </StatsPageContent>
  );
};

export default stats;
