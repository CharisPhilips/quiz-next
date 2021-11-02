import { useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { useFormik } from 'formik';
import { Form, Table, Button, Modal } from 'react-bootstrap';
import QuizHead from '../components/Layouts/QuizHead';
import Main from '../components/Main';
import { getToken } from '../apis';
import { registerSchema } from '../utils/validate';
import { AppContext } from '../context/store';
import { ACTION_LOGIN } from '../context/types';

const Register = () => {
  const { dispatch } = useContext(AppContext);
  useEffect(() => {
    if (getToken()) Router.push('/');
  }, []);

  const formSubmitProps = useFormik({
    initialValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      debugger;
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
          {
            nickname: values.nickname,
            email: values.email,
            password: values.password,
          }
        );
        formSubmitProps.setSubmitting(false);
        Cookies.set('token', res.data.token, { expires: 1 });
        dispatch({
          type: ACTION_LOGIN,
          payload: res.data.user,
        });
        localStorage.setItem('userinfo', JSON.stringify(res.data.user));
        Router.push('/');
      } catch (error) {
        formSubmitProps.setSubmitting(false);
        const { response } = error;
        const { request, ...errorObject } = response; // take everything but 'request'
        const errors = errorObject.data.errors;
        let errorObj = {};
        Object.keys(errors).map((item) => {
          errorObj[item] = errors[item][0];
        });
        formSubmitProps.setErrors({ ...errorObj });
      }
    },
  });

  return (
    <Main>
      <QuizHead>
        <title>Quiz App Register</title>
        <meta name='description' content='Quiz App Register'></meta>
      </QuizHead>

      <h1>Register</h1>

      <Form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
        onSubmit={formSubmitProps.handleSubmit}
      >
        <Form.Group style={{ width: '300px', marginBottom: '1rem' }}>
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type='text'
            name='nickname'
            placeholder='Enter nickname'
            value={formSubmitProps.values.nickname}
            onChange={formSubmitProps.handleChange}
            onBlur={formSubmitProps.handleBlur}
            autoComplete='new-password'
            isInvalid={
              formSubmitProps.touched.nickname &&
              formSubmitProps.errors.nickname
            }
          />
          {formSubmitProps.touched.nickname &&
            formSubmitProps.errors.nickname && (
              <Form.Control.Feedback type='invalid'>
                {formSubmitProps.errors.nickname}
              </Form.Control.Feedback>
            )}
        </Form.Group>
        <Form.Group style={{ width: '300px', marginBottom: '1rem' }}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='text'
            name='email'
            placeholder='Enter email'
            value={formSubmitProps.values.email}
            onChange={formSubmitProps.handleChange}
            onBlur={formSubmitProps.handleBlur}
            autoComplete='new-password'
            isInvalid={
              formSubmitProps.touched.email && formSubmitProps.errors.email
            }
          />
          {formSubmitProps.touched.email && formSubmitProps.errors.email && (
            <Form.Control.Feedback type='invalid'>
              {formSubmitProps.errors.email}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group style={{ width: '300px', marginBottom: '1rem' }}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name='password'
            type='password'
            placeholder='Enter password'
            value={formSubmitProps.values.password}
            onChange={formSubmitProps.handleChange}
            onBlur={formSubmitProps.handleBlur}
            autoComplete='new-password'
            isInvalid={
              formSubmitProps.touched.password &&
              formSubmitProps.errors.password
            }
          />
          {formSubmitProps.touched.password &&
            formSubmitProps.errors.password && (
              <Form.Control.Feedback type='invalid'>
                {formSubmitProps.errors.password}
              </Form.Control.Feedback>
            )}
        </Form.Group>
        <Form.Group style={{ width: '300px', marginBottom: '1rem' }}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name='confirmPassword'
            type='password'
            placeholder='Enter confirm password'
            value={formSubmitProps.values.confirmPassword}
            onChange={formSubmitProps.handleChange}
            onBlur={formSubmitProps.handleBlur}
            autoComplete='new-password'
            isInvalid={
              formSubmitProps.touched.confirmPassword &&
              formSubmitProps.errors.confirmPassword
            }
          />
          {formSubmitProps.touched.confirmPassword &&
            formSubmitProps.errors.confirmPassword && (
              <Form.Control.Feedback type='invalid'>
                {formSubmitProps.errors.confirmPassword}
              </Form.Control.Feedback>
            )}
        </Form.Group>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href='/login'>Login</Link>
          <Button variant='primary' type='submit'>
            Register
          </Button>
        </div>
      </Form>

      {/* <Formik
        initialValues={{
          nickname: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={async (
          values,
          { setSubmitting, resetForm, setErrors, setStatus }
        ) => {
          setSubmitting(true);
          try {
            const res = await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
              {
                nickname: values.nickname,
                email: values.email,
                password: values.password,
              }
            );
            setSubmitting(false);
            Cookies.set('token', res.data.token, { expires: 1 });
            dispatch({
              type: ACTION_LOGIN,
              payload: res.data.user,
            });
            localStorage.setItem('userinfo', JSON.stringify(res.data.user));
            Router.push('/');
          } catch (error) {
            setSubmitting(false);
            const { response } = error;
            const { request, ...errorObject } = response; // take everything but 'request'
            const errors = errorObject.data.errors;
            let errorObj = {};
            Object.keys(errors).map((item) => {
              errorObj[item] = errors[item][0];
            });
            setErrors({ ...errorObj });
          }
        }}
        validate={(values) => {
          // let returnErrors = { ...errors };
          let returnErrors = {};
          if (!values.nickname) returnErrors.nickname = 'Nickname is required';
          if (validateEmail(values.email))
            returnErrors.email = validateEmail(values.email);
          if (validatePassword(values.password))
            returnErrors.password = validatePassword(values.password);
          if (
            !validatePassword(values.password) &&
            values.password !== values.confirmPassword
          )
            returnErrors.confirmPassword = `Confirm password didn't match`;
          return returnErrors;
        }}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
                /> */}
    </Main>
  );
};
export default Register;
