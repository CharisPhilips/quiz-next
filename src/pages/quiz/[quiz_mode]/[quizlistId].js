import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Router, { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import QuizHead from '../../../components/Layouts/QuizHead';
import Main from '../../../components/Main';
import QuizStandardPlay from '../../../components/Pages/Quiz/Standard';
import QuizSmallKeyboardPlay from '../../../components/Pages/Quiz/SmallKeyboard';
import QuizOneOfFourPlay from '../../../components/Pages/Quiz/OneOfFour';
import { QUIZ_MODES } from '../../../constants';
import { getQuizModeValue } from '../../../utils/smallKeyboard';

const QuizPlay = () => {
  const router = useRouter();
  const { quiz_mode, quizlistId } = router.query;

  useEffect(() => {
    if (quiz_mode) {
      if (getQuizModeValue(quiz_mode) === -1) Router.push('/');
    }
  }, [quiz_mode]);

  return (
    <Container className='mainContainer'>
      <QuizHead>
        <title>Quiz App Translation</title>
        <meta name='description' content='Quiz App Translation'></meta>
      </QuizHead>

      {quizlistId && (
        <>
          {quiz_mode.toLowerCase() === QUIZ_MODES.STANDARD_MODE.strValue && (
            <QuizStandardPlay quizlistId={parseInt(quizlistId)} />
          )}
          {quiz_mode.toLowerCase() ===
            QUIZ_MODES.SMALL_KEYBOARD_MODE.strValue && (
            <QuizSmallKeyboardPlay quizlistId={parseInt(quizlistId)} />
          )}
          {quiz_mode.toLowerCase() === QUIZ_MODES.ONE_OF_FOUR.strValue && (
            <QuizOneOfFourPlay quizlistId={parseInt(quizlistId)} />
          )}
        </>
      )}
    </Container>
  );
};

export default QuizPlay;
