import React, { createContext, useReducer } from 'react';

import { CONFIRM_CHANGE } from '../store/actions';
import confirmReducer from '../store/confirmReducer';

const initialState = {
  title: 'Thông báo',
  message: 'Không có gì',
  action: null,
  payload: {},
  open: false,
  onSuccess: null,
};

const ConfirmPopupContext = createContext({
  ...initialState,
  setConfirmPopup: () => Promise.resolve(),
});

export const ConfirmPopupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(confirmReducer, initialState);

  const setConfirmPopup = (data) => {
    dispatch({
      type: CONFIRM_CHANGE,
      title: data.title,
      open: data.open,
      message: data.message,
      action: data.action,
      payload: data.payload,
      onSuccess: data.onSuccess,
    });
  };

  return (
    <ConfirmPopupContext.Provider value={{ ...state, setConfirmPopup }}>
      {children}
    </ConfirmPopupContext.Provider>
  );
};

export default ConfirmPopupContext;
