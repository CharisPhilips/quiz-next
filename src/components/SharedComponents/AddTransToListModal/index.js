import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import {
  getTranslationAPI,
  createQuizlistTranslationAPI,
  getListTranslationAPI,
} from '../../../apis';
import { AppContext } from '../../../context/store';
import * as ACTION_TYPE from '../../../context/types';

const AddTransToListModal = (props) => {
  const { state } = useContext(AppContext);
  const [translationList, setTranslationList] = useState([]);
  const [quizlistTranslations, setQuizlistTranslations] = useState([]);
  const [seletedTranslation, setSelectedTranslation] = useState(-1);
  const [submitted, setSubmitted] = useState(false);

  let componentedMounted = true;
  useEffect(() => {
    getTranslationAPI('all', state.auth.id)
      .then((res) => {
        if (componentedMounted) {
          setTranslationList([...res]);
        }
      })
      .catch((err) => {
        console.log('AddTransToListModal');
        console.log('Get Translations API Error');
        console.log(err);
      });

    getListTranslationAPI(props.listData.id, userInfo.id)
      .then((res) => {
        if (componentedMounted) {
          setQuizlistTranslations([...res.data]);
        }
      })
      .catch((err) => {
        console.log('AddTransToListModal');
        console.log('Get QuizList API Error');
        console.log(err);
      });
  }, []);

  const addTranslationToList = () => {
    setSubmitted(true);

    if (seletedTranslation === -1) return;

    createQuizlistTranslationAPI({
      quizlist_id: props.listData.id,
      translation_id: seletedTranslation,
    })
      .then((res) => {
        props.updateTranslation(
          translationList.find((item) => item.id === seletedTranslation)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkTranslationDisabled = (translationId) => {
    const findOne = quizlistTranslations.find(
      (item) => item.id === translationId
    );
    if (findOne) return true;
    return false;
  };

  return (
    <Modal show={props.showModal} onHide={props.closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add translation to {props.listData.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group style={{ marginBottom: '1rem' }}>
          <Form.Label>List</Form.Label>
          <Form.Control
            as='select'
            value={props.listData.id}
            onChange={(e) => {
              console.log(e);
            }}
            disabled
          >
            <option value={props.listData.id}>{props.listData.name}</option>
          </Form.Control>
        </Form.Group>
        <StyledFormGroup>
          <Form.Label>Vocabulary</Form.Label>
          <Form.Control
            label='Vocabulary'
            as='select'
            value={seletedTranslation}
            onChange={(e) => {
              setSelectedTranslation(parseInt(e.target.value));
            }}
            isInvalid={submitted && seletedTranslation}
          >
            <option value={-1} disabled>
              Please select a translation
            </option>
            {translationList.map((item, idx) => {
              return (
                <option
                  key={idx}
                  value={item.id}
                  disabled={checkTranslationDisabled(item.id)}
                >
                  {item.vocabulary_1}
                </option>
              );
            })}
          </Form.Control>
          {submitted && seletedTranslation === -1 && (
            <Form.Control.Feedback type='invalid'>
              This field is required.
            </Form.Control.Feedback>
          )}
        </StyledFormGroup>
        <Row>
          <Col style={{ textAlign: 'right', marginTop: '1rem' }}>
            <Button variant='secondary' onClick={props.closeModal}>
              Cancel
            </Button>
            <Button
              variant='primary'
              style={{ marginLeft: '1rem' }}
              onClick={addTranslationToList}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(AddTransToListModal);

const StyledFormGroup = styled(Form.Group)`
  .invalid-feedback {
    display: block;
  }
`;
