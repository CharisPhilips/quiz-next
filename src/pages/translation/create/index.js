import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getToken } from '../../../apis';
import QuizHead from '../../../components/Layouts/QuizHead';
import TranslationEdit from '../../../components/SharedComponents/TranslationEdit';

const CreateTranslation = () => {
  return (
    <Container className='mainContainer panel-section-one'>
      <QuizHead>
        <title>Quiz App Create Translation</title>
        <meta name='description' content='Quiz App Create Translation'></meta>
      </QuizHead>
      <Row>
        <Col md={12}>
          <TranslationEdit
            translation={{
              id: -1,
              vocabulary_1: '',
              vocabulary_2: '',
              sentence_1: '',
              sentence_2: '',
              quizlist: { id: -1, name: '' },
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTranslation;
