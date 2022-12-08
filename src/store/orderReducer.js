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
        order: {
          ...action.order,
          orderDetail: action.orderDetail,
        },
      };
    case actionTypes.ORDER_DETAIL_CHANGE:
      return {
        ...state,
        order: {
          ...state.order,
          orderDetail: action.orderDetail,
        },
      };
    default:
      return state;
  }
};

export default orderReducer;
