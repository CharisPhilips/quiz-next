import { useState, useEffect } from 'react';
import { Router } from 'next/router';
import { Container } from 'react-bootstrap';
import QuizHead from '../../components/Layouts/QuizHead';
import UserInfo from '../../components/Pages/Profile/UserInfo';
import ChangePassword from '../../components/Pages/Profile/ChangePassword';
import { getToken } from '../../apis';

const Profile = () => {
  useEffect(() => {
    if (!getToken()) Router.push('/');
  }, []);

  return (
    <Container className='mainContainer panel-section-one'>
      <QuizHead>
        <title>Quiz App Profile</title>
        <meta name='description' content='Quiz App Profile'></meta>
      </QuizHead>
      <UserInfo />
      <ChangePassword />
    </Container>
  );
};
export default Profile;
