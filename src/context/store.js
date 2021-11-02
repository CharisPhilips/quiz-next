import React, { useEffect, useReducer } from 'react';
import reducer from './reducer';
import { getToken, getUserInfo } from '../apis';
import { ACTION_LOGIN } from './types';

export const AppContext = React.createContext();

export function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, { auth: getUserInfo() });

  useEffect(() => {
    dispatch({
      type: ACTION_LOGIN,
      payload: { ...getUserInfo() },
    });
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
