import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import FullSpinner from '../../../SharedComponents/FullSpinner';
import {
  getQuizListAPI,
  getQuestionAPI,
  getQuizlistTranslationIdAPI,
  checkAnswerAPI,
  getAnswerAPI,
  createStatsAPI,
  getToken,
} from '../../../../apis';
import { shuffle } from '../../../../utils/math';
import { QUIZ_MODES, ANSWER_STATUS } from '../../../../constants';
import { AppContext } from '../../../../context/store';
import * as ACTION_TYPE from '../../../../context/types';

const QuizStandardPlay = ({ quizlistId }) => {
  const { state } = useContext(AppContext);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [curTranslationIndex, setCurTranslationIndex] = useState(-1);
  const [selectedQuizlist, setSelectedQuizlist] = useState({ id: -1 });
  const [translationIds, setTranslationIds] = useState([]);
  const [direction, setDirection] = useState(true);
  const [question, setQuestion] = useState({
    id: -1,
    vocabulary: '',
    sentence_1: '',
    answerSubmitted: false, //user submit answer at once
  });
  const [answer, setAnswer] = useState({ vocabulary: '' });
  const [result, setResult] = useState({ vocabulary: ANSWER_STATUS.NONE });
  const [showAnswer, setShowAnswer] = useState({
    show: false,
    vocabularyAnswer: '',
  });

  let componentMounted = true;

  const getInitialAPIData = async () => {
    setLoading(true);

    try {
      const resQuizlist = await getQuizListAPI({
        id: quizlistId,
      });
      setSelectedQuizlist({ ...resQuizlist });
    } catch (err) {
      console.log(err);
    }

    try {
      const resQuizlistTranslation = await getQuizlistTranslationIdAPI(
        quizlistId,
        state.auth.id
      );
      if (componentMounted) {
        setCurTranslationIndex(0);
        const randomIds = shuffle(resQuizlistTranslation);
        setTranslationIds(randomIds);
        if (resQuizlistTranslation.length > 0) getNextQuestion(randomIds[0]);
        else setLoading(false);
      }
    } catch (err) {
      console.log(err);
      if (componentMounted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getInitialAPIData();
    return () => {
      componentMounted = false;
    };
  }, [quizlistId]);

  const getNextQuestion = async (translationId, curDirection) => {
    setLoading(true);
    setResult({ vocabulary: ANSWER_STATUS.NONE });
    setAnswer({ vocabulary: '' });
    setSubmitted(false);
    setShowAnswer({ show: false, vocabularyAnswer: false });

    try {
      const res = await getQuestionAPI(
        translationId,
        QUIZ_MODES.STANDARD_MODE.value,
        curDirection,
        -1,
        state.auth.id
      );
      setQuestion({ ...res, answerSubmitted: false });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setQuestion({
        id: -1,
        vocabulary: '',
        sentence_1: '',
        answerSubmitted: false,
      });
    }
  };

  const checkAnswer = async () => {
    setSubmitted(true);
    setLoading(true);
    try {
      const res = await checkAnswerAPI({
        translationId: question.id,
        quizlistId: parseInt(quizlistId),
        vocabulary: answer.vocabulary,
        direction: direction,
      });
      setResult({
        vocabulary: res.vocabulary
          ? ANSWER_STATUS.CORRECT
          : ANSWER_STATUS.INCORRECT,
      });

      postTranslateStats(
        question.id,
        res.vocabulary ? ANSWER_STATUS.CORRECT : ANSWER_STATUS.INCORRECT
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setAnswer({ vocabulary: '' });
    setResult({ vocabulary: ANSWER_STATUS.NONE });
    setQuestion({
      id: -1,
      vocabulary: '',
      sentence_1: '',
      answerSubmitted: false,
    });
    setShowAnswer({ show: false, vocabulary: false });

    const randomIds = shuffle(translationIds);
    setCurTranslationIndex(0);
    setDirection(true);
    setTranslationIds([...randomIds]);
    getNextQuestion(randomIds[0], true);
  };

  const onClickExchange = () => {
    setDirection(!direction);
    getNextQuestion(translationIds[curTranslationIndex], !direction);
  };

  const postTranslateStats = (translationId, answer_vocabulary) => {
    if (answer_vocabulary === ANSWER_STATUS.CORRECT && question.answerSubmitted)
      return;
    setQuestion({
      ...question,
      answerSubmitted: true,
    });
    if (getToken() && state.auth.id !== -1)
      createStatsAPI({
        translation_id: translationId,
        quizlist_id: quizlistId,
        answer_vocabulary: answer_vocabulary,
        quiz_mode: QUIZ_MODES.STANDARD_MODE.value,
        owner_id: selectedQuizlist.user_id,
      });
  };

  const clickShowAnswer = () => {
    setLoading(true);
    getAnswerAPI(question.id, direction, state.auth.id)
      .then((res) => {
        setLoading(false);
        postTranslateStats(question.id, ANSWER_STATUS.INCORRECT);
        setShowAnswer({
          show: true,
          vocabulary: res.vocabulary,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const clickNext = (event) => {
    event.preventDefault();
    setCurTranslationIndex(curTranslationIndex + 1);
    getNextQuestion(translationIds[curTranslationIndex + 1], direction);
  };

  const clickFinish = (event) => {
    setCurTranslationIndex(curTranslationIndex + 1);
  };

  return (
    <ComponentContainer>
      {loading && <FullSpinner />}
      {!loading && translationIds.length === 0 && (
        <Col md={12}>
          <h5>This list has no translations</h5>
          <BackButton
            variant='secondary'
            onClick={() => {
              Router.push('/quiz');
            }}
          >
            Back
          </BackButton>
        </Col>
      )}

      {question.id !== -1 && (
        <>
          <Col md={12} style={{ textAlign: 'center' }}>
            <h4 style={{ textAlign: 'center' }}>
              Quizlist: {selectedQuizlist.name}
              <span
                style={{
                  fontSize: '12px',
                  color: 'grey',
                  marginLeft: '1rem',
                }}
              >
                {`${selectedQuizlist.language_1.language_name} to ${selectedQuizlist.language_2.language_name}`}
              </span>
            </h4>

            <BackButton
              variant='secondary'
              onClick={() => {
                Router.push('/quiz');
              }}
            >
              Back
            </BackButton>
          </Col>

          {translationIds.length > 0 &&
          curTranslationIndex >= translationIds.length ? (
            <>
              <Col md={12}>
                <h5 className='text-center'>Finished</h5>
              </Col>
              <Col
                md={12}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1rem',
                }}
              >
                <Button
                  variant='success'
                  style={{ marginRight: '0.5rem' }}
                  onClick={() => {
                    Router.push(
                      `/stats/${quizlistId}/${QUIZ_MODES.STANDARD_MODE.value}`
                    );
                  }}
                  disabled={!getToken() || state.auth.id === -1}
                >
                  Check Stats
                </Button>
                <Button
                  variant='primary'
                  style={{ marginLeft: '0.5rem' }}
                  onClick={restartQuiz}
                >
                  Again
                </Button>
              </Col>
            </>
          ) : (
            <>
              <Col md={12}>
                <h5
                  style={{
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  {question.vocabulary}
                </h5>
                <AnswerFormGroup>
                  <Form.Control
                    value={answer.vocabulary}
                    onChange={(event) => {
                      setAnswer({
                        ...answer,
                        vocabulary: event.target.value,
                      });
                    }}
                    isValid={submitted && result.vocabulary === 1}
                    isInvalid={submitted && result.vocabulary === 0}
                  />
                  {submitted && result.vocabulary === 0 && (
                    <Form.Control.Feedback type='invalid'>
                      Vocabulary Answer is incorrect
                    </Form.Control.Feedback>
                  )}
                  <Button
                    className='btn-exchange'
                    variant='outline-secondary'
                    onClick={onClickExchange}
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} />
                  </Button>
                </AnswerFormGroup>
                {question.sentence_1 && (
                  <h6
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      color: 'grey',
                      marginTop: '1rem',
                    }}
                  >
                    {question.sentence_1}
                  </h6>
                )}
              </Col>

              <AnswerBtnWrapper>
                {submitted &&
                  result.vocabulary === ANSWER_STATUS.INCORRECT &&
                  curTranslationIndex < translationIds.length - 1 && (
                    <Button variant='danger' onClick={clickNext}>
                      Skip
                    </Button>
                  )}

                {result.vocabulary !== ANSWER_STATUS.CORRECT && (
                  <Button type='submit' onClick={checkAnswer}>
                    Verify
                  </Button>
                )}

                {submitted &&
                  result.vocabulary === ANSWER_STATUS.CORRECT &&
                  curTranslationIndex < translationIds.length - 1 && (
                    <Button variant='success' onClick={clickNext}>
                      Next
                    </Button>
                  )}

                {submitted &&
                  question.answerSubmitted &&
                  curTranslationIndex === translationIds.length - 1 && (
                    <Button variant='success' onClick={clickFinish}>
                      Finish
                    </Button>
                  )}
              </AnswerBtnWrapper>

              <ShowAnswerWrapper>
                <Button
                  variant='info'
                  onClick={clickShowAnswer}
                  disabled={showAnswer.show}
                >
                  Show answer
                </Button>
                {showAnswer.show && showAnswer.vocabulary && (
                  <h6>{showAnswer.vocabulary}</h6>
                )}
              </ShowAnswerWrapper>
            </>
          )}
        </>
      )}
    </ComponentContainer>
  );
};

export default QuizStandardPlay;

const ComponentContainer = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 30px auto 0;
`;

const AnswerFormGroup = styled(Form.Group)`
  position: relative;
  input.form-control {
    width: calc(100% - 48px);
  }
  .btn-exchange {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 19px;
    padding: 0;
    top: 0;
    right: 0;
    .fa-exchange-alt {
      width: 20px;
      transform: rotate(-90deg);
    }
  }
`;

const BackButton = styled(Button)`
  width: 100px;
  margin: 1rem 0;
`;

const AnswerBtnWrapper = styled(Col)`
  text-align: center;
  .btn {
    margin: 20px 10px 10px;
    width: 160px;
  }
`;

const ShowAnswerWrapper = styled(Col)`
  text-align: center;
  .btn {
    width: 160px;
    margin: 10px 10px;
  }
`;
