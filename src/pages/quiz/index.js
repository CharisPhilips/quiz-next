import { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';
import QuizHead from '../../components/Layouts/QuizHead';
import Main from '../../components/Main';
import { getQuizListAPI } from '../../apis';
import { getQuizModeStrValue } from '../../utils/smallKeyboard';
import { QUIZ_MODES } from '../../constants';
import { AppContext } from '../../context/store';
import * as ACTION_TYPE from '../../context/types';

export const QuizModeSelect = () => {
  const { state } = useContext(AppContext);
  const [selectedMode, setSelectedMode] = useState(-1);
  const [quizlist, setQuizlist] = useState([]);
  const [selectedQuizlist, setSelectedQuizlist] = useState(-1);

  let componentedMounted = true;

  useEffect(() => {
    getQuizListAPI({ id: null, user_id: state.auth.id, is_public: true })
      .then((res) => {
        if (componentedMounted) {
          setQuizlist([...res]);
        }
      })
      .catch((err) => {
        if (componentedMounted) {
          setQuizlist([]);
        }
      });

    return () => {
      componentedMounted = false;
    };
  }, []);

  const startQuiz = () => {
    if (selectedMode === QUIZ_MODES.ONE_OF_FOUR.value) {
      const selectedOne = quizlist.find((item) => item.id === selectedQuizlist);
      if (selectedOne && selectedOne.translation_count <= 1) {
        Swal.fire({
          title: 'Please add more translations to this list',
          text: '1 of 4 requires at least 2 translations and you have only 1',
          icon: 'warning',
          confirmButtonText: 'Ok',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed)
            Router.push(`/translation/create/quizlist/${selectedQuizlist}`);
        });
        return;
      }
    }
    Router.push(
      `/quiz/${getQuizModeStrValue(selectedMode)}/${selectedQuizlist}`
    );
  };

  return (
    <Main>
      <QuizHead>
        <title>Quiz App</title>
        <meta name='description' content='Quiz App'></meta>
      </QuizHead>
      <h1 className='title'>Quiz List</h1>
      <br />
      <Form.Group style={{ width: 300 }}>
        <Form.Control
          as='select'
          value={selectedMode}
          onChange={(e) => {
            setSelectedMode(parseInt(e.target.value));
          }}
        >
          <option value={-1} disabled>
            Please select quiz mode.
          </option>
          {Object.keys(QUIZ_MODES).map((item) => {
            return (
              <option
                key={QUIZ_MODES[item].value}
                value={QUIZ_MODES[item].value}
              >
                {QUIZ_MODES[item].title}
              </option>
            );
          })}
        </Form.Control>
      </Form.Group>
      <br />
      <Form.Group style={{ width: 300 }}>
        <Form.Control
          as='select'
          value={selectedQuizlist}
          onChange={(e) => {
            setSelectedQuizlist(parseInt(e.target.value));
          }}
        >
          <option value={-1} disabled>
            Please select quiz list.
          </option>
          {quizlist.map((item) => {
            return (
              <option
                key={item.id}
                value={item.id}
                disabled={item.translation_count === 0}
              >
                {`${item.name}  (Translations:${item.translation_count})`}
              </option>
            );
          })}
        </Form.Control>
      </Form.Group>
      <br />
      <CtrlBtnWrapper>
        <Button
          disabled={selectedQuizlist === -1 || selectedMode === -1}
          onClick={startQuiz}
        >
          Start Quiz
        </Button>
      </CtrlBtnWrapper>
    </Main>
  );
};

export default QuizModeSelect;

const CtrlBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    margin: 0 0.5rem;
  }
`;
