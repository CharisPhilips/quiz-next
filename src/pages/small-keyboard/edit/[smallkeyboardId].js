import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import QuizHead from '../../../components/Layouts/QuizHead';
import SmallKeyboardEdit from '../../../components/SharedComponents/SmallKeyboardEdit';

const EditSmallKeyboard = () => {
  const router = useRouter();
  const { smallKeyboardId } = router.query;

  return (
    <Container className='mainContainer panel-section-one'>
      <QuizHead>
        <title>Quiz App SmallKeyboard Edit</title>
        <meta name='description' content='Quiz App SmallKeyboard Edit'></meta>
      </QuizHead>

      {smallKeyboardId && (
        <SmallKeyboardEdit smallKeyboard={{ id: smallKeyboardId }} />
      )}
    </Container>
  );
};

export default EditSmallKeyboard;
