import RootContainer from '../../components/Layouts/RootContainer';
import QuizHead from '../../components/Layouts/QuizHead';
import MainNavbar from '../../components/Layouts/MainNavbar';
import StatsPageContent from '../../components/Pages/Stats';

const stats = () => {
  return (
    <StatsPageContent quizlistId={'all'} quizMode={'all'}>
      <QuizHead>
        <title>Quiz App Stats</title>
        <meta name='description' content='Quiz App Stats'></meta>
      </QuizHead>
    </StatsPageContent>
  );
};

export default stats;
