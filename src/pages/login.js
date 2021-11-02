import { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import { Form, Table, Button, Modal } from 'react-bootstrap';
import QuizHead from '../components/Layouts/QuizHead';
import Main from '../components/Main';
import { getToken, loginAPI } from '../apis';
import { AppContext } from '../context/store';
import * as ACTION_TYPE from '../context/types';

const Login = () => {
  const { state, dispatch } = useContext(AppContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState({});
  const handleSubmit = (event) => {
    event.preventDefault();
    loginAPI(formData)
      .then((res) => {
        Cookies.set('token', res.data.access_token, { expires: 1 });
        dispatch({
          type: ACTION_TYPE.ACTION_LOGIN,
          payload: res.data.user,
        });
        localStorage.setItem('userinfo', JSON.stringify(res.data.user));
        Router.push('/');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setErrorMsg({ not_exist: 'Username or Password is not matched' });
        } else {
          setErrorMsg({ ...err });
        }
      });
  };

  return (
    <Main>
      <QuizHead>
        <title>Quiz App Login</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Quiz App Login'></meta>
      </QuizHead>
      <h1>Login</h1>
      {Object.keys(errorMsg).length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {Object.keys(errorMsg).map((item, idx) => {
            if (typeof errorMsg[item] === 'object') {
              return (
                <>
                  {errorMsg[item].map((itemOne, idxOne) => {
                    return (
                      <p
                        key={`${idx}-${idxOne}`}
                        style={{
                          fontSize: '12px',
                          margin: '0 0 8px 0',
                          color: 'red',
                        }}
                      >
                        {itemOne}
                      </p>
                    );
                  })}
                </>
              );
            } else
              return (
                <p
                  key={idx}
                  style={{
                    fontSize: '12px',
                    margin: '0 0 8px 0',
                    color: 'red',
                  }}
                >
                  {errorMsg[item]}
                </p>
              );
          })}
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group style={{ width: '300px', marginBottom: '1rem' }}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter email '
            value={formData.email}
            onChange={(event) => {
              setFormData({
                ...formData,
                email: event.target.value,
              });
            }}
          />
        </Form.Group>
        <Form.Group style={{ width: '300px', marginBottom: '1rem' }}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            value={formData.password}
            onChange={(event) => {
              setFormData({
                ...formData,
                password: event.target.value,
              });
            }}
          />
        </Form.Group>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href='/register'>Register</Link>
          <Button variant='primary' type='submit'>
            Login
          </Button>
        </div>
      </Form>
    </Main>
  );
};
export default Login;
