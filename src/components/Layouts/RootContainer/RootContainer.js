import { useState, useEffect } from 'react';
import MainNavbar from '../MainNavbar';
import QuizHead from '../QuizHead';
import styles from './RootContainer.module.scss';

const RootContainer = ({ children, className, ...rest }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);
  let containerClassName = styles.container;

  if (className) {
    containerClassName = `${containerClassName} ${className}`;
  }

  return (
    <div {...rest} className={containerClassName}>
      <QuizHead>
        <title>Quiz App</title>
        <link rel='icon' href='/favicon.ico' />
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        ></meta>
      </QuizHead>
      <MainNavbar />
      {!loading && <>{children}</>}
    </div>
  );
};

export default RootContainer;
