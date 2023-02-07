import { combineReducers } from 'redux';
import { withReduxStateSync } from 'redux-state-sync';
import customizationReducer from './customizationReducer';
import snackbarReducer from './snackbarReducer';
import folderReducer from './folderReducer';
import authReducer from './authReducer';
import homeReducer from './homeReducer';
import projectReducer from './projectReducer';
import floatingMenuReducer from './floatingMenuReducer';
import loadingReducer from './loadingReducer';
import viewReducer from './viewReducer';
import confirmReducer from './confirmReducer';
import taskReducer from './taskReducer.js';
import documentReducer from './documentReducer.js';
import appReducer from './appReducer.js';
import metadataReducer from './metadataReducer.js';
import orderReducer from './orderReducer.js';
import materialReducer from './materialReducer.js';

const reducer = combineReducers({
  customization: customizationReducer,
  snackbar: snackbarReducer,
  folder: folderReducer,
  auth: authReducer,
  home: homeReducer,
  project: projectReducer,
  floatingMenu: floatingMenuReducer,
  loading: loadingReducer,
  view: viewReducer,
  confirm: confirmReducer,
  task: taskReducer,
  document: documentReducer,
  app: appReducer,
  metadata: metadataReducer,
  order: orderReducer,
  material: materialReducer,
});

export default withReduxStateSync(reducer);
