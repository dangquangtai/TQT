import * as actionTypes from './actions';

export const initialState = {
  apps: [],
  selectedApp: {},
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.APP_CHANGE:
      return {
        ...state,
        apps: action.apps,
      };
    case actionTypes.SELECTED_APP_CHANGE:
      return {
        ...state,
        selectedApp: action.app,
      };
    default:
      return state;
  }
};

export default appReducer;
