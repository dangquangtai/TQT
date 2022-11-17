import React, { createContext, useReducer } from 'react';

import { VIEW_CHANGE } from '../store/actions';
import viewReducer from '../store/viewReducer';

const initialState = {
  name: '',
  float_buttons: [],
  menu_buttons: [],
  side_buttons: [],
  form_buttons: [],
  columns: [],
  tabs: [],
  disabled_fields: [],
};

const ViewContext = createContext({
  ...initialState,
  setView: () => Promise.resolve(),
});

export const ViewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(viewReducer, initialState);

  const setView = (view) => {
    dispatch({
      type: VIEW_CHANGE,
      name: view.name,
      float_buttons: view.float_buttons,
      menu_buttons: view.menu_buttons,
      side_buttons: view.side_buttons,
      form_buttons: view.form_buttons,
      columns: view.columns,
      tabs: view.tabs,
      disabled_fields: view.disabled_fields,
      action: view.action,
    });
  };

  return <ViewContext.Provider value={{ ...state, setView }}>{children}</ViewContext.Provider>;
};

export default ViewContext;
