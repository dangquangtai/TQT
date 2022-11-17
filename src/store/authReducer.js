import * as actionTypes from './actions';

export const initialState = {
  isLoggedIn: false,
  user: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_LOGIN:
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
        user: action.user,
      };
    default:
      return state;
  }
};

export default userReducer;
