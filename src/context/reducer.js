import * as ACTION_TYPE from './types';
const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.ACTION_LOGIN:
      return {
        ...state,
        auth: {
          ...action.payload,
        },
      };
    case ACTION_TYPE.ACTION_LOGOUT:
      return {
        ...state,
        auth: {
          id: -1,
        },
      };
      localStorage.removeItem('userinfo');
      Cookies.remove('token');
    default:
      return state;
  }
};

export default reducer;
