import * as actionTypes from './actions';

export const initialState = {
  products: [],
  materials: [],
};

const metadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.METADATA:
      return {
        ...state,
        products: action.products,
        materials: action.materials,
      };
    default:
      return state;
  }
};

export default metadataReducer;
