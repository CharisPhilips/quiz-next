import { useEffect } from 'react';
import Head from 'next/head';
import axiosInstance from '../../../libs/axios';
import { getToken } from '../../../apis';
const QuizHead = (props) => {
  let componentedMounted = true;
  useEffect(() => {
    if (componentedMounted) {
      const token = getToken();
      if (token) {
        axiosInstance.defaults.headers.common = {
          Authorization: `bearer ${token}`,
        };
      }
    }
    return () => {
      componentedMounted = false;
    };
  }, []);
  return <Head>{props.children}</Head>;
};

export default QuizHead;
