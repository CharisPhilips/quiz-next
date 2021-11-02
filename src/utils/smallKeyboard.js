import { QUIZ_MODES } from '../constants';

export const checkItemIsInAnswer = (answer, selectedItem) => {
  if (answer.length === 0 || selectedItem.length !== 2) return false;

  for (let i = 0; i < answer.length; i++) {
    for (let j = 0; j < answer[i].length; j++) {
      if (answer[i].length !== 2) return false;
      if (answer[i][0] === selectedItem[0] && answer[i][1] === selectedItem[1])
        return true;
    }
  }
  return false;
};

export const updateSmallKeyboardAnswer = (answer, selectedItem) => {
  if (answer.length === 0) return [selectedItem];
  if (checkItemIsInAnswer(answer, selectedItem)) {
    return answer.filter((item) => {
      if (item[0] === selectedItem[0] && item[1] === selectedItem[1])
        return false;
      return true;
    });
  } else {
    return [...answer, selectedItem];
  }
};

export const patternToArray = (patternStr) => {
  const rowCount = Math.sqrt(patternStr.length);
  const returnArr = [];
  for (let i = 0; i < rowCount; i++) {
    const rowArr = [];
    for (let j = 0; j < rowCount; j++) {
      rowArr.push(patternStr.substr(i * rowCount + j, 1));
    }
    returnArr.push(rowArr);
  }
  return returnArr;
};

export const getAnswerStr = (pattern, answer) => {
  if (pattern.length === 0 || pattern[0].length === 0) return '';
  if (answer.length === 0) return '';
  let returnAnswer = '';
  answer.forEach((item) => {
    returnAnswer += pattern[item[0]][item[1]];
  });
  return returnAnswer;
};

export const getQuizModeStrValue = (quizModeValue) => {
  let strQuizmodeValue = QUIZ_MODES.STANDARD_MODE.strValue;
  Object.keys(QUIZ_MODES).map((item) => {
    if (QUIZ_MODES[item].value === quizModeValue)
      strQuizmodeValue = QUIZ_MODES[item].strValue;
  });
  return strQuizmodeValue;
};

export const getQuizModeValue = (strQuizMode) => {
  let quizModeValue = -1;
  Object.keys(QUIZ_MODES).map((item) => {
    if (QUIZ_MODES[item].strValue === strQuizMode.toLowerCase())
      quizModeValue = QUIZ_MODES[item].value;
  });
  return quizModeValue;
};

export const getQuizModeTitle = (value) => {
  let quizmodeTitle = QUIZ_MODES.STANDARD_MODE.title;
  Object.keys(QUIZ_MODES).map((item) => {
    if (QUIZ_MODES[item].value === value)
      quizmodeTitle = QUIZ_MODES[item].title;
  });
  return quizmodeTitle;
};

// export const getSamllKeyboardPattern = (answer, length) => {
//   let normalPattern = '';
//   let characters = 'abcdefghijklmnopqrstuvwxyz';
//   let charactersLength = characters.length;
//   for (let i = 0; i < length; i++)
//     normalPattern += characters.charAt(
//       Math.floor(Math.random() * charactersLength)
//     );

//   let answersPattern = getRandomSubIndex(
//     Array.from(Array(length).keys()),
//     answer.length
//   );
// };
