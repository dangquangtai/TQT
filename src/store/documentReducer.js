import * as actionTypes from './actions';

export const initialState = {
  selectedDocument: null,
  documentType: '',
};

const documentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DOCUMENT_CHANGE:
      return {
        ...state,
        selectedDocument: action.selectedDocument,
        documentType: action.documentType,
      };
    default:
      return state;
  }
};

export default documentReducer;
