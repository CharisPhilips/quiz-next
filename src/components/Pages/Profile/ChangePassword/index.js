import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { updatePasswordAPI } from '../../../../apis';

const PAGE_MODE = {
  NORMAL: 0,
  EDIT: 1,
};

const ChangePassword = () => {
  const [pageMode, setPageMode] = useState(PAGE_MODE.NORMAL);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState({
    old: { value: '', validate: true, errorMsg: '' },
    new: { value: '', validate: true, errorMsg: '' },
    confirm: { value: '', validate: true, errorMsg: '' },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (pageMode === PAGE_MODE.NORMAL) {
      setPageMode(PAGE_MODE.EDIT);
    } else if (pageMode === PAGE_MODE.EDIT) {
      setSubmitted(true);
      setLoading(true);

      let isValidate = true;
      let tempPassword = { ...password };

      if (password.old.value.length === 0) {
        tempPassword.old.validate = false;
        tempPassword.old.errorMsg = 'Please input old password';
        isValidate = false;
      }

      if (password.new.value.length === 0) {
        tempPassword.new.validate = false;
        tempPassword.new.errorMsg = 'Please input old password';
        isValidate = false;
      } else if (
        !/^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{6,50}$/.test(password.new.value)
      ) {
        tempPassword.new.validate = false;
        tempPassword.new.errorMsg = 'Must containe one letter and one digit';
        isValidate = false;
      }

      if (password.new.value !== password.confirm.value) {
        tempPassword.confirm.validate = false;
        tempPassword.confirm.errorMsg = "Password didn't match";
        isValidate = false;
      }

      if (isValidate) {
        setPassword({
          old: {
            value: password.old.value,
            validate: true,
            errorMsg: '',
          },
          new: {
            value: password.new.value,
            validate: true,
            errorMsg: '',
          },
          confirm: {
            value: password.confirm.value,
            validate: true,
            errorMsg: '',
          },
        });
      } else {
        setPassword({
          ...tempPassword,
        });

        return;
      }

      updatePasswordAPI({
        old_password: password.old.value,
        new_password: password.new.value,
      })
        .then((res) => {
          if (res.status === 200) {
            setPageMode(PAGE_MODE.NORMAL);
            setPassword({
              old: { value: '', validate: true },
              new: { vale: '', validate: true },
              confirm: { value: '', validate: true },
            });
            setSubmitted(false);
            Swal.fire({
              title: 'Password Changed Successfully',
              text: '',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
          }
        })
        .catch((err) => {
          if (err.error) {
            setPassword({
              ...password,
              old: {
                value: password.old.value,
                validate: false,
                errorMsg: err.error,
              },
              new: {
                value: password.new.value,
                validate: true,
                errorMsg: '',
              },
              confirm: {
                value: password.confirm.value,
                validate: true,
                errorMsg: '',
              },
            });
          }
        });
    }
  };

  return (
    <Row>
      <Col md={12} className='mt-3'>
        <hr />
      </Col>
      <Col md={3}></Col>
      <Col md={6}>
        <Form
          className='d-flex flex-column justify-content-center'
          onSubmit={handleSubmit}
        >
          {pageMode === PAGE_MODE.EDIT && (
            <>
              <Form.Group className='mt-3'>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Input old password'
                  autoComplete='new-password'
                  value={password.old.value}
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      old: {
                        ...password.old,
                        value: e.target.value,
                      },
                    });
                  }}
                  isInvalid={submitted && !password.old.validate}
                />
                {submitted && !password.old.validate && (
                  <Form.Control.Feedback type='invalid'>
                    {password.old.errorMsg}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group className='mt-3'>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Input new password'
                  autoComplete='new-password'
                  value={password.new.value}
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      new: {
                        ...password.new,
                        value: e.target.value,
                      },
                    });
                  }}
                  isInvalid={submitted && !password.new.validate}
                />
                {submitted && !password.new.validate && (
                  <Form.Control.Feedback type='invalid'>
                    {password.new.errorMsg}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group className='mt-3'>
                <Form.Label>confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Input confirm password'
                  autoComplete='new-password'
                  value={password.confirm.value}
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      confirm: {
                        ...password.confirm,
                        value: e.target.value,
                      },
                    });
                  }}
                  isInvalid={submitted && !password.confirm.validate}
                />
                {submitted && !password.confirm.validate && (
                  <Form.Control.Feedback type='invalid'>
                    {password.confirm.errorMsg}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </>
          )}
          <div className='d-flex align-items-center justify-content-center mt-3'>
            {pageMode === PAGE_MODE.EDIT && (
              <Button
                variant='outline-primary'
                className='mx-3'
                onClick={() => {
                  setPageMode(PAGE_MODE.NORMAL);
                  setPassword({
                    old: { value: '', validate: true },
                    new: { value: '', validate: true },
                    confirm: { value: '', validate: true },
                  });
                  setSubmitted(false);
                }}
              >
                Cancel
              </Button>
            )}
            <Button variant='primary' type='submit' className='mx-3'>
              {pageMode === PAGE_MODE.NORMAL
                ? 'Change Password'
                : 'Save Password'}
            </Button>
          </div>
        </Form>
      </Col>
      <Col md={3}></Col>
    </Row>
  );
};

export default React.memo(ChangePassword);
