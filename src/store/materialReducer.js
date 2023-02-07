import * as actionTypes from './actions';

export const initialState = {
  material: null,
  materialList: [],
};

const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MATERIAL:
      return {
        ...state,
        material: action.payload,
        materialList: [...state.materialList, action.payload],
      };
    case actionTypes.CLOSE_MODAL_MATERIAL:
      return {
        ...state,
        material: null,
        materialList: [],
      };
    default:
      return state;
  }
};

export default materialReducer;
