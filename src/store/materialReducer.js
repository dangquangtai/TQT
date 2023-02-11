import * as actionTypes from './actions';

export const initialState = {
  material: null,
  materialBuy: [],
};

const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MATERIAL:
      return {
        ...state,
        material: action.payload,
        materialBuy: [...state.materialBuy, action.payload],
      };
    case actionTypes.REMOVE_MATERIAL:
      return {
        ...state,
        materialBuy: state.materialBuy.filter((item) => item.part_id !== action.payload.part_id 
        || item.material_daily_requisition_id !== action.payload.material_daily_requisition_id),
      };
    case actionTypes.SET_MATERIAL:
      return {
        ...state,
        materialBuy: action.payload,
      };
    case actionTypes.CLOSE_MODAL_MATERIAL:
      return {
        ...state,
        material: null,
        materialBuy: [],
      };
    default:
      return state;
  }
};

export default materialReducer;
