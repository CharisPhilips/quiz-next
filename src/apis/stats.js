import axiosInstance from '../libs/axios';

export const getStatsListAPI = ({ id = 'all', user_id = -1 }) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/stats/get`, { id, user_id })
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

export const createStatsAPI = (stats) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post('/api/stats', { ...stats })
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

export const getStatsTranslationAPI = ({
  user_id,
  quizlist_id = 'all',
  quiz_mode = 'all',
  translation_id = 'all',
  is_ranking = false,
  date_range = null,
  includes = null,
}) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/stats/translation/filter`, {
          user_id,
          quizlist_id,
          translation_id,
          quiz_mode,
          is_ranking,
          date_range,
          includes,
        })
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

export const getRankingAPI = (filterData) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post(`/api/stats/ranking`, { ...filterData })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
      console.log(err);
    }
  });
};
