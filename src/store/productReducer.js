import * as actionTypes from './actions';

export const initialState = {
  product: null,
  productBuy: [],
  productReceived: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PRODUCT_RECEIVED:
      return {
        ...state,
        productReceived: action.payload,
      };
    case actionTypes.CLOSE_MODAL_PRODUCT:
      return {
        ...state,
        product: null,
        productBuy: [],
        productReceived: [],
      };
    default:
      return state;
  }
};

export default productReducer;
