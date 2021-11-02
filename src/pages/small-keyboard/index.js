import { useState, useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { Container, Row, Col, Button } from 'react-bootstrap';
import QuizHead from '../../components/Layouts/QuizHead';
import SmallKeyboardEdit from '../../components/SharedComponents/SmallKeyboardEdit';

const SmallKeyboard = () => {
  return (
    <Container className='mainContainer'>
      <QuizHead>
        <title>Quiz App Small Keyboard</title>
        <meta name='description' content='Quiz App Create Translation'></meta>
      </QuizHead>

      <h1 className='title'>Quiz App Manage SmallKeyboard</h1>
      <Button
        onClick={() => {
          Router.push('/small-keyboard/create');
        }}
      >
        Create Small Keyboard
      </Button>
    </Container>
  );
};

export default SmallKeyboard;
