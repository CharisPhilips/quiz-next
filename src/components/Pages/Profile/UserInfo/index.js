import { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getUserInfoAPI, updateUserinfoAPI } from '../../../../apis';
import { AppContext } from '../../../../context/store';
import * as ACTION_TYPE from '../../../../context/types';

const PAGE_MODE = {
  NORMAL_MODE: 0,
  EDIT_MODE: 1,
};

const UserInfo = () => {
  const { state, dispatch } = useContext(AppContext);

  const [pageMode, setPageMode] = useState(PAGE_MODE.NORMAL_MODE);
  const [userInfo, setUserInfo] = useState({ id: -1 });
  const [submitted, setSubmitted] = useState(false);
  const [validate, setValidate] = useState({ nickname: '', email: '' });
  const [loading, setLoading] = useState(true);

  let componentedMounted = true;
  useEffect(() => {
    getUserInfoAPI()
      .then((res) => {
        if (componentedMounted && res.status === 200)
          setUserInfo({ ...res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      componentedMounted = false;
    };
  }, []);

  const onClickSave = () => {
    if (pageMode === PAGE_MODE.NORMAL_MODE) {
      setPageMode(PAGE_MODE.EDIT_MODE);
    } else if (pageMode === PAGE_MODE.EDIT_MODE) {
      setSubmitted(true);
      if (userInfo.nickname && userInfo.email) {
        updateUserinfoAPI({
          nickname: userInfo.nickname,
          email: userInfo.email,
        })
          .then((res) => {
            if (res.status === 200) {
              setPageMode(PAGE_MODE.NORMAL_MODE);
              setValidate({
                nickname: '',
                email: '',
              });
              setSubmitted(false);
              Swal.fire({
                title: 'Userinfo Updated Successfully',
                text: '',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              dispatch({
                type: ACTION_TYPE.ACTION_LOGIN,
                payload: { ...res.data },
              });
              localStorage.setItem('userinfo', JSON.stringify(res.data));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setValidate({
          nickname: userInfo.nickname ? '' : 'Nickname is required',
          email: userInfo.email ? '' : 'Email is required',
        });
      }
    }
  };

  return (
    <>
      <Row>
        <Col xs={6}>
          <h1 className='title'>Profile</h1>
        </Col>
        <Col className='page-btn-wrapper' xs={6}>
          {pageMode === PAGE_MODE.EDIT_MODE && (
            <Button
              className='mx-2'
              variant='outline-primary'
              onClick={() => {
                setPageMode(PAGE_MODE.NORMAL_MODE);
                setSubmitted(false);
                setValidate({
                  nickname: userInfo.nickname ? '' : 'Nickname is required',
                  email: userInfo.email ? '' : 'Email is required',
                });
                setUserInfo({ ...state.auth });
              }}
            >
              Cancel
            </Button>
          )}

          <Button variant='primary' onClick={onClickSave}>
            {pageMode === PAGE_MODE.NORMAL_MODE ? 'Edit' : 'Save'}
          </Button>
        </Col>
      </Row>

      <Row>
        <Form.Group as={Col} md={6} className='mt-3'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder={pageMode === PAGE_MODE.NORMAL_MODE ? '' : 'Email'}
            autoComplete='new-password'
            value={userInfo.email}
            onChange={(event) => {
              setUserInfo({
                ...userInfo,
                email: event.target.value,
              });
            }}
            disabled={pageMode === PAGE_MODE.NORMAL_MODE}
            isInvalid={submitted && validate.email}
          ></Form.Control>
          {submitted && validate.email && (
            <Form.Control.Feedback>{validate.email}</Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group as={Col} md={6} className='mt-3'>
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type='text'
            placeholder={pageMode === PAGE_MODE.NORMAL_MODE ? '' : 'Nickname'}
            autoComplete='new-password'
            value={userInfo.nickname}
            onChange={(event) => {
              setUserInfo({
                ...userInfo,
                nickname: event.target.value,
              });
            }}
            disabled={pageMode === PAGE_MODE.NORMAL_MODE}
            isInvalid={submitted && validate.nickname}
          ></Form.Control>
          {submitted && validate.nickname && (
            <Form.Control.Feedback>{validate.nickname}</Form.Control.Feedback>
          )}
        </Form.Group>
      </Row>
    </>
  );
};

export default UserInfo;
