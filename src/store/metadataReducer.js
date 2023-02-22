import * as actionTypes from './actions';

export const initialState = {
  products: [],
  materials: [],
  provinces: [],
  brokens: [],
  genders: [],
};

const metadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.METADATA:
      return {
        ...state,
        products: action.products,
        materials: action.materials,
        provinces: action.provinces,
        brokens: action.brokens,
        genders: action.genders
      };
    default:
      return state;
  }
};

export default metadataReducer;
