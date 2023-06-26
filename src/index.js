import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import vi from 'date-fns/locale/vi';

import App from './layout/App';
import reducer from './store/reducer';
import config from './config';
import './assets/scss/style.scss';
import * as serviceWorker from './serviceWorker';
import {
  ORDER_CHANGE,
  ORDER_LIST,
  ORDER_DETAIL_CHANGE,
  MATERIAL_CHANGE,
  ADD_MATERIAL,
  CLOSE_MODAL_MATERIAL,
  REMOVE_MATERIAL,
  SET_MATERIAL,
  MATERIAL_RECEIVED,
  PRODUCT_RECEIVED,
} from './store/actions.js';

const syncConfig = {
  whitelist: [
    ORDER_LIST,
    ORDER_CHANGE,
    ORDER_DETAIL_CHANGE,
    MATERIAL_CHANGE,
    ADD_MATERIAL,
    REMOVE_MATERIAL,
    SET_MATERIAL,
    CLOSE_MODAL_MATERIAL,
    MATERIAL_RECEIVED,
    PRODUCT_RECEIVED,
  ],
};
const middlewares = [createStateSyncMiddleware(syncConfig)];
const store = createStore(reducer, {}, applyMiddleware(...middlewares));
initStateWithPrevTab(store);

ReactDOM.render(
  <Provider store={store}>
    <MuiPickersUtilsProvider locale={vi} utils={DateFnsUtils}>
      <BrowserRouter basename={config.basename}>
        <App />
      </BrowserRouter>
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
