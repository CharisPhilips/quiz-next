import React, { useState, useEffect, useContext } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FullSpinner from '../FullSpinner';
import {
  getQuizListAPI,
  getTranslationAPI,
  createTranslationAPI,
  updateTranslationAPI,
  getToken,
} from '../../../apis';
import { AppContext } from '../../../context/store';

const TranslationEdit = (props) => {
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [translation, setTranslation] = useState({
    id: -1,
    vocabulary_1: '',
    vocabulary_2: '',
    sentence_1: '',
    sentence_2: '',
    quizlist: { id: -1, name: '' },
  });
  const [quizlist, setQuizlist] = useState([]);

  let componentedMounted = true;

  const initLoading = async () => {
    setLoading(true);
    if (props.translation.id === -1) {
      setTranslation({
        id: -1,
        vocabulary_1: '',
        vocabulary_2: '',
        sentence_1: '',
        sentence_2: '',
        quizlist: { id: -1, name: '' },
      });
    } else {
      try {
        const res = await getTranslationAPI(props.translation.id);
        setTranslation({
          id: res.id,
          vocabulary_1: res.vocabulary_1,
          vocabulary_2: res.vocabulary_2,
          sentence_1: res.sentence_1,
          sentence_2: res.sentence_2,
          quizlist: { id: res.quizlist.id, name: res.quizlist.name },
        });
      } catch (err) {}
    }

    try {
      const res = await getQuizListAPI({
        id: null,
        user_id: state.auth.id,
        is_public: true,
      });
      setQuizlist([...res]);
      if (props.translation.id === -1) {
        if (props.translation.quizlist.id === -1) {
          const mainQuizlist = res.find(
            (item) => item.user_id === state.auth.id && item.role === 0
          );
          setTranslation({
            ...props.translation,
            quizlist: mainQuizlist,
          });
        } else {
          const findQuizList = res.find(
            (item) => item.id === props.translation.quizlist.id
          );
          setTranslation({
            ...props.translation,
            quizlist: { ...findQuizList },
          });
        }
      }
    } catch (err) {
      setQuizlist([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!getToken()) Router.push('/');
    initLoading();
  }, [props.translation.id]);

  const updateTranslation = () => {
    setSubmitted(true);

    if (
      translation.vocabulary_1.length === 0 ||
      translation.vocabulary_2.length === 0
    )
      return;

    setLoading(true);
    if (translation.id === -1) {
      createTranslationAPI({
        vocabulary_1: translation.vocabulary_1,
        vocabulary_2: translation.vocabulary_2,
        sentence_1: translation.sentence_1,
        sentence_2: translation.sentence_2,
        user_id: state.auth.id,
        quizlist_id: translation.quizlist.id,
      })
        .then((res) => {
          // setTranslation({
          //   ...translation,
          //   id: res.id,
          // });
          setLoading(false);
          Swal.fire({
            title: 'Translation Created Successfully',
            text: '',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) Router.back();
          });
          // props.updateTranslation({
          //   ...res,
          //   quizlist: translation.quizlist,
          // });
          // props.closeModal();
        })
        .catch((err) => {
          // props.closeModal();
          setLoading(false);
          Swal.fire({
            title: 'Create Translation Has Been Failed',
            text: '',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        });
    } else {
      updateTranslationAPI({
        id: translation.id,
        vocabulary_1: translation.vocabulary_1,
        vocabulary_2: translation.vocabulary_2,
        sentence_1: translation.sentence_1,
        sentence_2: translation.sentence_2,
        user_id: state.auth.id,
        quizlist_id: translation.quizlist.id,
      })
        .then((res) => {
          // props.updateTranslation({
          //   ...res,
          //   quizlist: translation.quizlist,
          // });
          // props.closeModal();
          setLoading(false);
          Swal.fire({
            title: 'Translation Updated Successfully',
            text: '',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) Router.back();
          });
        })
        .catch((err) => {
          // props.closeModal();
          setLoading(false);
          Swal.fire({
            title: 'Update Translation Has Been Failed',
            text: '',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        });
    }
  };

  return (
    <ComponentWrapper>
      <Col md={12}>
        <h1 className='title'>
          {translation.id === -1 ? 'Create' : 'Edit'} Translate
        </h1>
      </Col>
      <Form.Group as={Col} md={12}>
        <Form.Label>Vocabulary (Required)</Form.Label>
        <Form.Control
          type='text'
          value={translation.vocabulary_1}
          onChange={(event) => {
            setTranslation({
              ...translation,
              vocabulary_1: event.target.value,
            });
          }}
          isInvalid={submitted && translation.vocabulary_1.length === 0}
        />
        {submitted && translation.vocabulary_1.length === 0 && (
          <Form.Control.Feedback type='invalid'>
            This field is required.
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group as={Col} md={12}>
        <Form.Label>Vocabulary Translation (Required)</Form.Label>
        <Form.Control
          type='text'
          value={translation.vocabulary_2}
          onChange={(event) => {
            setTranslation({
              ...translation,
              vocabulary_2: event.target.value,
            });
          }}
          isInvalid={submitted && translation.vocabulary_2.length === 0}
        />
        {submitted && translation.vocabulary_2.length === 0 && (
          <Form.Control.Feedback type='invalid'>
            This field is required.
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Col md={12}>
        <hr style={{ marginTop: '1rem' }} />
      </Col>

      <Form.Group as={Col} md={12}>
        <Form.Label>Sentence (Optional)</Form.Label>
        <Form.Control
          type='text'
          value={translation.sentence_1}
          onChange={(event) => {
            setTranslation({
              ...translation,
              sentence_1: event.target.value,
            });
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md={12}>
        <Form.Label>List</Form.Label>
        <Form.Control
          as='select'
          value={translation.quizlist.id}
          onChange={(e) => {
            setTranslation({
              ...translation,
              quizlist: quizlist.find(
                (item) => item.id === parseInt(e.target.value)
              ),
            });
          }}
        >
          {quizlist.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </Form.Control>
      </Form.Group>
      <Col className='button-wrapper'>
        <Button
          variant='secondary'
          onClick={() => {
            Router.back();
          }}
        >
          Cancel
        </Button>
        <Button variant='primary' onClick={updateTranslation}>
          {translation.id === -1 ? 'Create' : 'Update'}
        </Button>
      </Col>
      {loading && <FullSpinner />}
    </ComponentWrapper>
  );
};

export default React.memo(TranslationEdit);

const ComponentWrapper = styled(Row)`
  .form-group {
    margin-bottom: 1rem;
  }
  .button-wrapper {
    text-align: right;
    .btn {
      margin-left: 1rem;
    }
  }
`;
