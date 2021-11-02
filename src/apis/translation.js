import { QUIZ_MODES } from '../constants';
import axiosInstance from '../libs/axios';
export const getTranslationAPI = (translationId, userId = -1) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .get(`/api/translation/${translationId}/${userId}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject([]);
    }
  });
};

export const createTranslationAPI = (createDate) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/translation/create`, createDate)
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

export const updateTranslationAPI = (updateDate) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/translation/update`, updateDate)
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

export const deleteTranslationAPI = (id) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`/api/translation/delete/${id}`, {})
      .then((res) => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getQuestionAPI = (
  id,
  quiz_mode = QUIZ_MODES.STANDARD_MODE.value,
  direction = true,
  quizlist_id = -1,
  user_id = -1
) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post('/api/translation/question', {
          id,
          quiz_mode,
          direction,
          quizlist_id,
          user_id,
        })
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

export const checkAnswerAPI = ({
  translationId,
  quizlistId,
  vocabulary,
  direction,
  user_id = -1,
}) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/translation/checkanswer/${translationId}`, {
          quizlist_id: quizlistId,
          vocabulary: vocabulary,
          direction: direction,
          user_id,
        })
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

export const getAnswerAPI = (translationId, direction, user_id = -1) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .get(
          `/api/translation/answer/${translationId}/${
            direction ? 1 : 0
          }/${user_id}`
        )
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

export const getTranslationStatsAPI = ({ id = 'all', user_id = -1 }) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/translation/stats`, { id, user_id })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {}
  });
};
