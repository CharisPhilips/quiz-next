import axiosInstance from '../libs/axios';

export const createQuizlistTranslationAPI = (createData) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/quizlisttranslation`, { ...createData })
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
