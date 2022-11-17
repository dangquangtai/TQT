import * as actionTypes from './actions';

export const initialState = {
  provinces: [],
  genders: [],
  weekday: [],
  degree: [],
  careers: [],
  topics: [],
};

const metadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.METADATA:
      return {
        ...state,
        provinces: action.provinces,
        genders: action.genders,
        weekday: action.weekday,
        degree: action.degree,
        careers: action.careers,
        topics: action.topics,
      };
    default:
      return state;
  }
};

export default metadataReducer;
