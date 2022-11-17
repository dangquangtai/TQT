import * as actionTypes from './actions';

export const initialState = {
  documents: {
    documents: [
      {
        id: '1',
        title: 'xxx Review Audit Planning [THANH] Kiểm toán định kỳ năm 2021 - VIB Hải Châu',
        url: 'https://google.com',
        assigned_by: 'Bích Vân',
        assign_date: 1635343491291,
        application: 'Internal Audit - Wholesale Banking',
      },
      {
        id: '2',
        title: 'xxx Review Audit Planning Kiểm toán định kỳ năm 2021 - Upas LC [Test]',
        url: 'https://google.com',
        assigned_by: 'Bích Vân',
        assign_date: 1635128823000,
        application: 'Internal Audit - Wholesale Banking',
      },
    ],
    total_item: 0,
    total_page: 0,
    page: 1,
    no_item_per_page: 10,
    order_by: 'assigned_date',
    order_type: 'desc',
    folder_id: '',
    project_id: '',
  },
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TASK_CHANGE:
      return {
        ...state,
        [action.documentType]: {
          documents: action.documents,
          total_item: action.total_item,
          total_page: action.total_page,
          page: action.page,
          no_item_per_page: action.no_item_per_page,
          order_by: action.order_by,
          order_type: action.order_type,
          search_text: action.search_text,
          category_id: action.category_id,
          folder_id: action.folder_id,
          project_id: action.project_id,
        },
      };
    default:
      return state;
  }
};

export default taskReducer;
