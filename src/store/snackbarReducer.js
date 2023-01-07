import * as actionTypes from './actions';

const initialState = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
  variant: 'alert',
  alertSeverity: 'success',
  transition: 'SlideRight',
};

const snackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SNACKBAR_OPEN:
      return {
        ...state,
        action: !state.action,
        open: action.open ? action.open : initialState.open,
        message: action.message ? action.message : initialState.message,
        anchorOrigin: action.anchorOrigin ? action.anchorOrigin : initialState.anchorOrigin,
        variant: action.variant ? action.variant : initialState.variant,
        alertSeverity: action.alertSeverity ? action.alertSeverity : initialState.alertSeverity,
        transition: action.transition ? action.transition : initialState.transition,
      };
    case actionTypes.SNACKBAR_CLOSE:
      return {
        ...state,
        action: !state.action,
        open: false,
      };
    default:
      return state;
  }
};

export default snackbarReducer;
