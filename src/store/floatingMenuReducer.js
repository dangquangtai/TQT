import * as actionTypes from './actions';

export const initialState = {
  folder: false,
  document: false,
  detailDocument: false,
  accountDocument: false,
  departmentDocument: false,
  processDeptDocument: false,
  processUserDocument: false,
  processrolecode: '',
  categoryDocument: false,
  order_id:'',
};

const floatingMenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FLOATING_MENU_CHANGE:
      return {
        ...state,
        folder: action.folder,
        document: action.document,
        detailDocument: action.detailDocument,
        accountDocument: action.accountDocument,
        departmentDocument: action.departmentDocument,
        processDeptDocument: action.processDeptDocument,
        processUserDocument: action.processUserDocument,
        processrolecode: action.processrolecode,
        categoryDocument: action.categoryDocument,
        order_id: action.order_id,
      };
    default:
      return state;
  }
};

export default floatingMenuReducer;
