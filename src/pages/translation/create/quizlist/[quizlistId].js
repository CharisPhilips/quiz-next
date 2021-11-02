import React from 'react';
import Router, { useRouter } from 'next/router';
import { Container, Row, Col } from 'react-bootstrap';
import QuizHead from '../../../../components/Layouts/QuizHead';
import TranslationEdit from '../../../../components/SharedComponents/TranslationEdit';

const CreateTranslation = () => {
  const router = useRouter();
  const { quizlistId } = router.query;

  return (
    <Container className='mainContainer panel-section-one'>
      <QuizHead>
        <title>Quiz App Create Translation</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Quiz App Create Translation'></meta>
      </QuizHead>
      <Row>
        <Col md={12}>
          {quizlistId && (
            <TranslationEdit
              translation={{
                id: -1,
                vocabulary_1: '',
                vocabulary_2: '',
                sentence_1: '',
                sentence_2: '',
                quizlist: { id: parseInt(quizlistId), name: '' },
              }}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTranslation;
