import * as actionTypes from './actions';

export const initialState = {
  title: 'Thông báo',
  message: 'Không có gì',
  action: null,
  payload: {},
  open: false,
  onSuccess: null,
};

const confirmReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CONFIRM_CHANGE:
      return {
        ...state,
        title: action.title,
        open: action.open,
        message: action.message,
        action: action.action,
        payload: action.payload,
        onSuccess: action.onSuccess,
      };
    default:
      return state;
  }
};

export default confirmReducer;
