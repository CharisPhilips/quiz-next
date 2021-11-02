import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '../styles/globals.css';
import { Provider, Context, AppContext } from '../context/store';
import RootContainer from '../components/Layouts/RootContainer';
import QuizHead from '../components/Layouts/QuizHead';
import MainNavbar from '../components/Layouts/MainNavbar';

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider>
      <RootContainer>
        <Component {...pageProps} />
      </RootContainer>
    </Provider>
  );
};

export default MyApp;
