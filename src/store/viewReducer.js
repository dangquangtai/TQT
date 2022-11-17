import * as actionTypes from './actions';

export const initialState = {
  name: '',
  float_buttons: [],
  menu_buttons: [],
  side_buttons: [],
  form_buttons: [],
  columns: [],
  tabs: [],
  disabled_fields: [],
};

const viewReducer = (state = initialState, action) => {
  const isListAction = action.action === 'list';
  const isDetailAction = action.action === 'detail';
  switch (action.type) {
    case actionTypes.VIEW_CHANGE:
      return {
        ...state,
        name: action.name,
        float_buttons:
          action.float_buttons && Array.isArray(action.float_buttons) && isListAction
            ? action.float_buttons
            : state.float_buttons,
        menu_buttons:
          action.menu_buttons &&
          Array.isArray(action.menu_buttons) &&
          action.menu_buttons.length &&
          isListAction
            ? action.menu_buttons
            : isDetailAction
            ? state.menu_buttons
            : [],
        side_buttons:
          action.side_buttons && Array.isArray(action.side_buttons) && isListAction
            ? action.side_buttons
            : state.side_buttons,
        columns:
          action.columns && Array.isArray(action.columns) && isListAction
            ? action.columns
            : state.columns,
        tabs:
          action.tabs && Array.isArray(action.tabs) && isListAction
            ? action.tabs
            : isDetailAction
            ? state.tabs
            : [],

        form_buttons:
          action.form_buttons && Array.isArray(action.form_buttons) && isDetailAction
            ? action.form_buttons
            : state.form_buttons,
        disabled_fields:
          action.disabled_fields && Array.isArray(action.disabled_fields)
            ? action.disabled_fields
            : state.disabled_fields,
      };
    default:
      return state;
  }
};

export default viewReducer;
