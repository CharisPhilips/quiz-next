import axios from 'axios';
import axiosInstance from '../libs/axios';
import Cookies from 'js-cookie';

export const getToken = () => {
  try {
    const token = Cookies.get('token');
    return token;
  } catch (err) {
    return '';
  }
};

export const getUserInfo = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userinfo'));
    const token = Cookies.get('token');
    if (!!userInfo && !!token) return userInfo;
    else return { id: -1 };
  } catch (err) {
    return { id: -1 };
  }
};

export const logoutAPI = () => {
  return new Promise(async (resolve, reject) => {
    try {
      localStorage.removeItem('userinfo');
      Cookies.remove('token');
      window.location.href = '/login';
    } catch (err) {
      reject(false);
    }
  });
};

export const loginAPI = (formData) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, formData)
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

export const getUserInfoAPI = () => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .get('/api/user')
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

export const updateUserinfoAPI = (userInfo) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post('/api/user/update', { ...userInfo })
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

export const updatePasswordAPI = (passwordData) => {
  return new Promise((resolve, reject) => {
    try {
      axiosInstance
        .post('/api/user/updatepassword', {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
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
