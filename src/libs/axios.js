import axios from 'axios';
// const userInfo = JSON.parse(localStorage.getItem('userinfo'));
const axiosInstance = axios.create({
  // baseURL: process.env.REACT_APP_API_BASE_URL,
  baseURL: 'http://192.168.101.21:8000/',
  // baseURL: 'http://35.177.51.253/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      !error.response ||
      (error.response.status && error.response.status === 401)
    ) {
      window.location = '/';
    } else {
      return new Promise((resolve, reject) => {
        reject(
          (error.response && error.response.data) || 'Something went wrong'
        );
      });
    }
  }
);

export default axiosInstance;
