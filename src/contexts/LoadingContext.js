import React, { createContext, useReducer } from 'react';

import { LOADING_CHANGE } from '../store/actions';
import loadingReducer from '../store/loadingReducer';

const initialState = {
  loading: false,
};

const LoadingContext = createContext({
  ...initialState,
  turnOnLoading: () => Promise.resolve(),
  turnOffLoading: () => Promise.resolve(),
});

export const LoadingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  const turnOnLoading = () => {
    dispatch({ type: LOADING_CHANGE, loading: true });
  };

  const turnOffLoading = () => {
    dispatch({ type: LOADING_CHANGE, loading: false });
  };

  return (
    <LoadingContext.Provider value={{ ...state, turnOnLoading, turnOffLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
