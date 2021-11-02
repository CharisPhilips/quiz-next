import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import QuizHead from '../../components/Layouts/QuizHead';
import SmallKeyboardEdit from '../../components/SharedComponents/SmallKeyboardEdit';

const SmallKeyboardCreate = () => {
  return (
    <Container className='mainContainer panel-section-one'>
      <QuizHead>
        <title>Quiz App Create Translation</title>
        <meta name='description' content='Quiz App Create Translation'></meta>
      </QuizHead>
      <SmallKeyboardEdit smallKeyboard={{ id: -1 }} />
    </Container>
  );
};

export default SmallKeyboardCreate;
