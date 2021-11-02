import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row, Col, Form, Button } from 'react-bootstrap';
import {
  checkItemIsInAnswer,
  updateSmallKeyboardAnswer,
} from '../../../utils/smallKeyboard';
import { SMALL_KEYBOARD_SIZE } from '../../../constants';

const CREATE_SMALLKEYBOARD_STEP = {
  EDIT_PATTERN: 'Edit Pattern',
  DEFINE_ANSWER: 'Define Answer',
};

const SmallKeyboardEdit = (props) => {
  const [curStep, setCurStep] = useState(
    CREATE_SMALLKEYBOARD_STEP.EDIT_PATTERN
  );
  const [smallKeyboard, setSmallKeyboard] = useState({
    id: -1,
    question: [[]],
    answer: [],
    size: -1,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (smallKeyboard.id !== -1) {
    }
  }, [props.smallKeyboard]);

  const formatQuestions = (newSize) => {
    const prevSize = smallKeyboard.size;
    if (prevSize === -1)
      return new Array(Math.sqrt(newSize))
        .fill('')
        .map(() => new Array(Math.sqrt(newSize)).fill(''));
    else if (prevSize < newSize) {
      let newArr = [];
      for (let i = 0; i < Math.sqrt(newSize); i++) {
        if (i < Math.sqrt(prevSize)) {
          const rowArr = [
            ...smallKeyboard.question[i],
            ...new Array(Math.sqrt(newSize) - Math.sqrt(prevSize)).fill(''),
          ];
          newArr.push(rowArr);
        }
      }
      newArr = [
        ...newArr,
        ...Array(Math.sqrt(newSize) - Math.sqrt(prevSize))
          .fill('')
          .map(() => new Array(Math.sqrt(newSize)).fill('')),
      ];
      return newArr;
    } else {
      const newArr = [];
      smallKeyboard.question.forEach((item, idx) => {
        if (idx < Math.sqrt(newSize))
          newArr.push(item.slice(0, Math.sqrt(newSize)));
      });
      return newArr;
    }
  };

  const renderKeyboardContent = () => {
    const renderArr = [];
    smallKeyboard.question.forEach((item, idx) => {
      const rowArr = [];
      item.forEach((itemOne, idxOne) => {
        if (curStep === CREATE_SMALLKEYBOARD_STEP.EDIT_PATTERN)
          rowArr.push(
            <SmallKeyboardInput
              key={`${idx}-${idxOne}`}
              value={itemOne}
              changeValue={(newValue) => {
                const newQuestion = smallKeyboard.question;
                newQuestion[idx][idxOne] = newValue;
                setSmallKeyboard({
                  ...smallKeyboard,
                  question: [...newQuestion],
                });
              }}
              hasError={submitted && !itemOne}
            />
          );
        else
          rowArr.push(
            <StyledSelectLetter
              key={`${idx}-${idxOne}`}
              selected={checkItemIsInAnswer(smallKeyboard.answer, [
                idx,
                idxOne,
              ])}
              onClick={() => {
                setSmallKeyboard({
                  ...smallKeyboard,
                  answer: [
                    ...updateSmallKeyboardAnswer(smallKeyboard.answer, [
                      idx,
                      idxOne,
                    ]),
                  ],
                });
              }}
            >
              {itemOne}
            </StyledSelectLetter>
          );
      });
      renderArr.push(<div key={idx}>{rowArr}</div>);
    });
    return <SmallKeyboardInputWrapper>{renderArr}</SmallKeyboardInputWrapper>;
  };

  const getSubmitBtnStr = () => {
    if (curStep === CREATE_SMALLKEYBOARD_STEP.EDIT_PATTERN) {
      return 'Define Pattern';
    } else if (curStep === CREATE_SMALLKEYBOARD_STEP.DEFINE_ANSWER) {
      if (smallKeyboard.id === -1) return 'Create SmallKeyboard';
      else return 'Update SmallKeyboard';
    }
  };

  const getAnswerStr = () => {
    let answer = '';
    smallKeyboard.answer.forEach((item) => {
      answer += smallKeyboard.question[item[0]][item[1]];
    });
    return answer;
  };

  const onSubmit = () => {
    setSubmitted(true);
    if (curStep === CREATE_SMALLKEYBOARD_STEP.EDIT_PATTERN) {
      for (let i = 0; i < smallKeyboard.question.length; i++) {
        for (let j = 0; j < smallKeyboard.question[i].length; j++) {
          if (
            !smallKeyboard.question[i][j] ||
            smallKeyboard.question[i][j].length === 0
          )
            return;
        }
      }
      setCurStep(CREATE_SMALLKEYBOARD_STEP.DEFINE_ANSWER);
      setSubmitted(false);
    } else if (curStep === CREATE_SMALLKEYBOARD_STEP.DEFINE_ANSWER) {
    }
  };

  return (
    <ComponentWrapper>
      <Col md={12}>
        <h1 className='title'>
          {smallKeyboard.id === -1 ? 'Create' : 'Edit'} Small Keyboard
        </h1>
      </Col>
      {curStep === CREATE_SMALLKEYBOARD_STEP.EDIT_PATTERN && (
        <>
          <Col md={{ span: 8, offset: 2 }}>{renderKeyboardContent()}</Col>
          <Col md={{ span: 8, offset: 2 }}>
            <Form.Control
              as='select'
              value={smallKeyboard.size}
              onChange={(e) => {
                setSmallKeyboard({
                  ...smallKeyboard,
                  size: parseInt(e.target.value),
                  question: formatQuestions(parseInt(e.target.value)),
                });
              }}
            >
              <option value={-1} disabled>
                Select a box size
              </option>
              {SMALL_KEYBOARD_SIZE.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </Form.Control>
          </Col>
        </>
      )}
      {curStep === CREATE_SMALLKEYBOARD_STEP.DEFINE_ANSWER && (
        <>
          <Col md={{ span: 8, offset: 2 }}>
            <h3 className='text-center' style={{ margin: '1rem 0 0' }}>
              Please select answer word
            </h3>
          </Col>
          <Col md={{ span: 8, offset: 2 }}>{renderKeyboardContent()}</Col>
          <Col md={{ span: 8, offset: 2 }}>
            <h5 className='text-center'>{getAnswerStr()}</h5>
          </Col>
        </>
      )}
      <ButtonWrapper className='text-center' md={12}>
        {curStep === CREATE_SMALLKEYBOARD_STEP.DEFINE_ANSWER && (
          <Button
            variant='outline-primary'
            onClick={() => {
              setCurStep(CREATE_SMALLKEYBOARD_STEP.EDIT_PATTERN);
            }}
          >
            Edit
          </Button>
        )}
        <Button onClick={onSubmit}>{getSubmitBtnStr()}</Button>
      </ButtonWrapper>
    </ComponentWrapper>
  );
};

export default SmallKeyboardEdit;

const ComponentWrapper = styled(Row)`
  .title {
    text-align: center;
  }
`;

const SmallKeyboardInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ButtonWrapper = styled(Col)`
  margin-top: 1rem;
  .btn {
    margin-left: 0.5rem;
  }
`;

const StyledKeyboardInput = styled(Form.Control)`
  margin: 0.5rem;
  width: 70px;
  height: 70px;
  text-align: center;
  font-size: 2rem;
  padding: 0 !important;
  background-image: none !important;
`;

const StyledSelectLetter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem;
  width: 70px;
  height: 70px;
  font-size: 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
  color: ${(props) => (props.selected ? '#664d03' : '#212529')};
  background-color: ${(props) => (props.selected ? '#fff3cd' : 'transparent')};
  border: 1px solid ${(props) => (props.selected ? '#ffecb5' : '#ced4da')};
`;

const SmallKeyboardInput = ({
  value = '',
  changeValue = () => {},
  hasError = false,
}) => {
  const onChange = (e) => {
    const newStr = e.target.value;
    if (newStr) {
      changeValue(newStr.substr(newStr.length - 1, 1));
    } else changeValue('');
  };

  return (
    <StyledKeyboardInput
      type='text'
      value={value}
      onChange={onChange}
      isInvalid={hasError}
    />
  );
};
