import * as actionTypes from './actions';

export const initialState = {
  loading: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING_CHANGE:
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default loadingReducer;
