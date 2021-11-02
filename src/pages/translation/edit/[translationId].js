import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { Container, Row, Col } from 'react-bootstrap';
import QuizHead from '../../../components/Layouts/QuizHead';
import TranslationEdit from '../../../components/SharedComponents/TranslationEdit';

const EditTranslation = () => {
  const router = useRouter();
  const { translationId } = router.query;

  return (
    <Container className='mainContainer panel-section-one'>
      <QuizHead>
        <title>Quiz App Create Translation</title>
        <meta name='description' content='Quiz App Create Translation'></meta>
      </QuizHead>
      <Row>
        <Col md={12}>
          {translationId && (
            <TranslationEdit
              translation={{
                id: translationId,
                vocabulary_1: '',
                vocabulary_2: '',
                sentence_1: '',
                sentence_2: '',
                quizlist: { id: -1, name: '' },
              }}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EditTranslation;
