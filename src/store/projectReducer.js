import * as actionTypes from './actions';

export const initialState = {
  projects: [],
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PROJECT_CHANGE:
      return {
        ...state,
        projects: action.projects,
      };
    default:
      return state;
  }
};

export default projectReducer;
