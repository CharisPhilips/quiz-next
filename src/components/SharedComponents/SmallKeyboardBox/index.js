import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  checkItemIsInAnswer,
  updateSmallKeyboardAnswer,
} from '../../../utils/smallKeyboard';

const SmallKeyboardBox = ({
  wrapperClass = '',
  pattern = [[]],
  answer = [],
  setAnswer = () => {},
}) => {
  const renderArr = [];
  pattern.forEach((item, idx) => {
    const rowArr = [];
    item.forEach((itemOne, idxOne) => {
      rowArr.push(
        <StyledSelectLetter
          key={`${idx}-${idxOne}`}
          selected={checkItemIsInAnswer(answer, [idx, idxOne])}
          onClick={() => {
            setAnswer(updateSmallKeyboardAnswer(answer, [idx, idxOne]));
          }}
        >
          {itemOne}
        </StyledSelectLetter>
      );
    });
    renderArr.push(<div key={idx}>{rowArr}</div>);
  });
  return (
    <ComponentWrapper className={wrapperClass}>{renderArr}</ComponentWrapper>
  );
};

const ComponentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
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

export default React.memo(SmallKeyboardBox);
