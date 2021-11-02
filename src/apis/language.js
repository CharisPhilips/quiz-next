import axiosInstance from '../libs/axios';

export const getLanguageAPI = () => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .get('/api/language/all')
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};
