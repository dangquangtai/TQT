import * as actionTypes from './actions';

export const initialState = {
  orderList: [],
  order: {},
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ORDER_LIST:
      return {
        ...state,
        orderList: action.orderList,
      };
    case actionTypes.ORDER_CHANGE:
      return {
        ...state,
        order: action.order,
      };
    default:
      return state;
  }
};

export default orderReducer;
