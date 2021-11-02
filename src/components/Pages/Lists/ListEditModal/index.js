import React, { useEffect, useState, useContext } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import {
  createQuizListAPI,
  udpateQuizListAPI,
  getLanguageAPI,
} from '../../../../apis';
import { AppContext } from '../../../../context/store';
import * as ACTION_TYPE from '../../../../context/types';

const ListEditModal = ({ showModal, closeModal, listData, updateList }) => {
  const { state } = useContext(AppContext);

  let componentedMounted = true;

  const [selectedQuizList, setSelectedQuizList] = useState({
    id: -1,
    name: '',
    role: 1,
    is_public: 1,
    language_1: -1,
    language_2: -1,
  });
  const [languages, setLanguages] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getLanguageAPI()
      .then((res) => {
        if (componentedMounted) setLanguages([...res]);
      })
      .catch((err) => {
        console.log('Get Language API error');
      });
    return () => {
      componentedMounted = false;
    };
  }, []);

  useEffect(() => {
    if (listData.id !== -1)
      setSelectedQuizList({
        ...listData,
        language_1: listData.language_1.id,
        language_2: listData.language_2.id,
      });
  }, [listData.id]);

  const updateQuizList = () => {
    setSubmitted(true);

    if (
      !selectedQuizList.name ||
      selectedQuizList.language_1 === -1 ||
      selectedQuizList.language_2 === -1
    )
      return;

    if (selectedQuizList.id === -1) {
      createQuizListAPI({
        name: selectedQuizList.name,
        is_public: selectedQuizList.is_public,
        role: selectedQuizList.role,
        language_1: selectedQuizList.language_1,
        language_2: selectedQuizList.language_2,
      })
        .then((res) => {
          updateList({
            ...res,
            translation_count: 0,
            user: state.auth,
            language_1: languages.find(
              (item) => item.id === selectedQuizList.language_1
            ),
            language_2: languages.find(
              (item) => item.id === selectedQuizList.language_2
            ),
          });
          closeModal();
        })
        .catch((err) => {
          closeModal();
        });
    } else {
      udpateQuizListAPI({
        id: selectedQuizList.id,
        name: selectedQuizList.name,
        is_public: selectedQuizList.is_public,
        role: selectedQuizList.role,
        language_1: selectedQuizList.language_1,
        language_2: selectedQuizList.language_2,
      })
        .then((res) => {
          updateList({
            ...selectedQuizList,
            ...res,
            language_1: languages.find(
              (item) => item.id === selectedQuizList.language_1
            ),
            language_2: languages.find(
              (item) => item.id === selectedQuizList.language_2
            ),
          });
          closeModal();
        })
        .catch((err) => {
          closeModal();
        });
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedQuizList.id === -1
            ? 'Create your own list'
            : 'Update your list'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group style={{ marginBottom: '1rem' }}>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            value={selectedQuizList.name}
            onChange={(event) => {
              setSelectedQuizList({
                ...selectedQuizList,
                name: event.target.value,
              });
            }}
            isInvalid={submitted && !selectedQuizList.name.trim()}
          />
          {submitted && !selectedQuizList.name.trim() && (
            <Form.Control.Feedback type='invalid'>
              Name is required.
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Check
            type='checkbox'
            label='Make public'
            checked={selectedQuizList.is_public}
            onChange={() => {
              setSelectedQuizList({
                ...selectedQuizList,
                is_public: !selectedQuizList.is_public,
              });
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type='checkbox'
            label='Do you want to make this list main list'
            checked={!selectedQuizList.role}
            onChange={() => {
              setSelectedQuizList({
                ...selectedQuizList,
                role: selectedQuizList.role === 0 ? 1 : 0,
              });
            }}
          />
        </Form.Group>
        <Form.Group style={{ marginTop: '1rem' }}>
          <Form.Control
            label='Vocabulary Language'
            as='select'
            value={selectedQuizList.language_1}
            onChange={(e) => {
              setSelectedQuizList({
                ...selectedQuizList,
                language_1: parseInt(e.target.value),
              });
            }}
            isInvalid={submitted && selectedQuizList.language_1 === -1}
          >
            <option value={-1} disabled>
              Select a language
            </option>
            {languages.map((item, idx) => {
              return (
                <option key={idx} value={item.id}>
                  {item.language_name}
                </option>
              );
            })}
          </Form.Control>
          {submitted && selectedQuizList.language_1 === -1 && (
            <Form.Control.Feedback type='invalid'>
              Please select a language
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group style={{ marginTop: '1rem' }}>
          <Form.Control
            label='Translation Language'
            as='select'
            value={selectedQuizList.language_2}
            onChange={(e) => {
              setSelectedQuizList({
                ...selectedQuizList,
                language_2: parseInt(e.target.value),
              });
            }}
            isInvalid={submitted && selectedQuizList.language_2 === -1}
          >
            <option value={-1} disabled>
              Select a language
            </option>
            {languages.map((item, idx) => {
              return (
                <option key={idx} value={item.id}>
                  {item.language_name}
                </option>
              );
            })}
          </Form.Control>
          {submitted && selectedQuizList.language_2 === -1 && (
            <Form.Control.Feedback type='invalid'>
              Please select a language
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={closeModal}>
          Close
        </Button>
        <Button variant='primary' onClick={updateQuizList}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(ListEditModal);
