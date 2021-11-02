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

const OneOfFourPlay = ({ quizlistId }) => {
  const { state } = useContext(AppContext);

  const [submitted, setSubmitted] = useState(false);
  const [curTranslationIndex, setCurTranslationIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [selectedQuizlist, setSelectedQuizlist] = useState({ id: -1 });
  const [translationIds, setTranslationIds] = useState([]);
  const [direction, setDirection] = useState(true);
  const [question, setQuestion] = useState({
    id: -1,
    vocabulary: '',
    sentence_1: '',
    questions: [],
    answerSubmitted: false, //user submit answer at once
  });
  const [answer, setAnswer] = useState(-1);
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
      if (componentMounted) {
        setSelectedQuizlist({ ...resQuizlist });
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const resQuizlistTranslation = await getQuizlistTranslationIdAPI(
        quizlistId
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

  const getNextQuestion = (translationId, curDirection) => {
    setLoading(true);
    setResult({ vocabulary: ANSWER_STATUS.NONE });
    setAnswer(-1);
    setSubmitted(false);
    setShowAnswer({ show: false, vocabularyAnswer: false });

    getQuestionAPI(
      translationId,
      QUIZ_MODES.ONE_OF_FOUR.value,
      curDirection,
      quizlistId,
      state.auth.id
    )
      .then((res) => {
        setQuestion({ ...res, answerSubmitted: false });
        setLoading(false);
      })
      .catch((err) => {
        setQuestion({
          id: -1,
          vocabulary: '',
          sentence_1: '',
          questions: [],
          answerSubmitted: false,
        });
        setLoading(false);
      });
  };

  const checkAnswer = async (vocabulary) => {
    setSubmitted(true);
    setLoading(true);
    try {
      const res = await checkAnswerAPI({
        translationId: question.id,
        quizlistId: parseInt(quizlistId),
        vocabulary: vocabulary,
        direction: direction,
      });
      postTranslateStats(
        question.id,
        res.vocabulary ? ANSWER_STATUS.CORRECT : ANSWER_STATUS.INCORRECT
      );
      setResult({
        vocabulary: res.vocabulary
          ? ANSWER_STATUS.CORRECT
          : ANSWER_STATUS.INCORRECT,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setAnswer(-1);
    setResult({ vocabulary: 2 });
    setQuestion({
      id: -1,
      vocabulary: '',
      sentence_1: '',
      questions: [],
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
        quiz_mode: QUIZ_MODES.ONE_OF_FOUR.value,
        owner_id: selectedQuizlist.user_id,
      });
  };

  const clickShowAnswer = () => {
    setLoading(true);
    getAnswerAPI(question.id, direction)
      .then((res) => {
        postTranslateStats(question.id, ANSWER_STATUS.INCORRECT);
        setShowAnswer({
          show: true,
          vocabulary: res.vocabulary,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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

  const getAnswerItemClass = (idx) => {
    const classNameStr = ['answer-div'];
    if (idx === answer) {
      if (submitted) {
        if (result.vocabulary === 1) {
          classNameStr.push('alert alert-success show');
        } else if (result.vocabulary === 0) {
          classNameStr.push('alert alert-danger show');
        }
      } else classNameStr.push('selected');
    }
    return classNameStr.join(' ');
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
                      `/stats/${quizlistId}/${QUIZ_MODES.ONE_OF_FOUR.value}`
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
                <QuestionHeader>
                  <h5>
                    {question.vocabulary}
                    <Button
                      className='btn-exchange'
                      variant='outline-secondary'
                      onClick={onClickExchange}
                    >
                      <FontAwesomeIcon icon={faExchangeAlt} />
                    </Button>
                  </h5>
                  {question.sentence_1 && <h6>{question.sentence_1}</h6>}
                </QuestionHeader>

                <AnswerFormGroup>
                  {question.questions.map((item, idx) => {
                    return (
                      <div
                        className={getAnswerItemClass(idx)}
                        key={idx}
                        onClick={() => {
                          if (result.vocabulary === 1) return;
                          setSubmitted(false);
                          setAnswer(idx);
                          checkAnswer(question.questions[idx]);
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                  {submitted && result.vocabulary === ANSWER_STATUS.CORRECT && (
                    <Form.Control.Feedback type='valid'>
                      Correct
                    </Form.Control.Feedback>
                  )}
                  {submitted &&
                    result.vocabulary === ANSWER_STATUS.INCORRECT && (
                      <Form.Control.Feedback type='invalid'>
                        {answer === -1
                          ? 'Please select answer'
                          : 'Vocabulary Answer is incorrect'}
                      </Form.Control.Feedback>
                    )}
                </AnswerFormGroup>
              </Col>

              <AnswerBtnWrapper>
                {curTranslationIndex < translationIds.length - 1 && (
                  <Button
                    variant={
                      result.vocabulary === ANSWER_STATUS.CORRECT
                        ? 'success'
                        : 'danger'
                    }
                    onClick={clickNext}
                  >
                    {result.vocabulary === ANSWER_STATUS.CORRECT
                      ? 'Next'
                      : 'Skip'}
                  </Button>
                )}

                {result.vocabulary !== ANSWER_STATUS.NONE &&
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
                  disabled={showAnswer.show || result.vocabulary === 1}
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

export default OneOfFourPlay;

const ComponentContainer = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 30px auto 0;
`;

const QuestionHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  h5 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;

    .btn-exchange {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 19px;
      padding: 0;
      margin-left: 1rem;
      .fa-exchange-alt {
        width: 20px;
        transform: rotate(-90deg);
      }
    }
  }
  h6 {
    width: 100%;
    margin: 1rem 0 0 0;
    color: grey;
    text-align: center;
  }
`;

const AnswerFormGroup = styled(Form.Group)`
  position: relative;
  margin: 1rem 0 0 0;
  padding-bottom: 21px;
  .answer-div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin: 0 0 0.5rem 0;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;

    &.selected {
      color: #084298;
      background-color: #cfe2ff;
      border-color: #b6d4fe;
    }
  }
  .valid-feedback {
    display: block;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 21px;
  }
  .invalid-feedback {
    display: block;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 21px;
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
