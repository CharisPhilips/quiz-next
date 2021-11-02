import axiosInstance from '../libs/axios';

export const getQuizListAPI = (getData) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post('/api/quizlist/get', { ...getData })
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

export const filterQuizlistAPI = (filter) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/api/quizlist/filter`, {
        ...filter,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getQuizlistTranslationIdAPI = (quizlistId, userId = -1) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`/api/quizlist/translationids/${quizlistId}/${userId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createQuizListAPI = (createDate) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/quizlist/create`, createDate)
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

export const udpateQuizListAPI = (updateDate) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/quizlist/update`, updateDate)
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

export const deleteQuizListAPI = (quizlistId) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/quizlist/delete/${quizlistId}`, {})
        .then((res) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const getListTranslationAPI = (quizlistId, userId = -1) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .get(`/api/quizlist/translation/${quizlistId}/${userId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};
