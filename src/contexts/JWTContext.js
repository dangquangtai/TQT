import React, { createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

import { ACCOUNT_INITIALISE, LOGIN, LOGOUT } from '../store/actions';
import { apiEndpoints, comanyCode } from '../store/constant';
import axiosInstance from '../services/axios';
import accountReducer from '../store/accountReducer';
import Loader from '../component/Loader/Loader';
import useLoading from '../hooks/useLoading';

let numberOfAjaxCAllPending = 0;

const initialState = {
  isLoggedIn: true,
  isInitialised: true,
  user: null,
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }

  const decoded = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken, user, { turnOnLoading, turnOffLoading }) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    localStorage.setItem('user', JSON.stringify(user));
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    axiosInstance.interceptors.request.use((request) => {
      if (request.method === 'post') {
        request.data.company_code = comanyCode;
        request.data.outputtype = 'RawJson';
      }
      return request;
    });

    axiosInstance.interceptors.request.use(
      function (config) {
        numberOfAjaxCAllPending++;
        turnOnLoading();
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      function (response) {
        numberOfAjaxCAllPending--;
        setTimeout(() => {
          if (numberOfAjaxCAllPending === 0) {
            turnOffLoading();
          }
        }, 0);

        if (numberOfAjaxCAllPending === 0) {
          //hide loader
          turnOffLoading();
        }
        return response;
      },
      function (error) {
        numberOfAjaxCAllPending--;
        if (numberOfAjaxCAllPending === 0) {
          //hide loader
          turnOffLoading();
        }
        return Promise.reject(error);
      }
    );
  } else {
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('user');
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => {},
});

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const { turnOnLoading, turnOffLoading } = useLoading();

  const login = async (email, password) => {
    const response = await axiosInstance.post(apiEndpoints.authenticate, {
      email_address: email,
      password,
      outputtype: 'RawJson',
      guest: 'true',
      company_code: comanyCode,
    });
    const loginResult = response.data;
    const { data: user } = loginResult;
    if (loginResult.return === 200) {
      setSession(user.token, user, { turnOnLoading, turnOffLoading });
      dispatch({
        type: LOGIN,
        payload: {
          user,
        },
      });
    } else {
      // lert login loi
    }
  };

  const forgotpass = async (email) => {
    const response = await axiosInstance.post(apiEndpoints.forgot_password, {
      email_address: email,
      outputtype: 'RawJson',
      guest: 'true',
      company_code: comanyCode,
    });
    const loginResult = response.data;
    if (loginResult.return === 200 && loginResult.code === 0) {
      return true;
    } else {
      // lert login loi
      return false;
    }
  };
  const validatechangepass = async (email, code) => {
    const response = await axiosInstance.post(apiEndpoints.validate_forgot_password, {
      email_address: email,
      outputtype: 'RawJson',
      guest: 'true',
      verification_code: code,
      company_code: comanyCode,
    });
    const loginResult = response.data;
    if (loginResult.return === 200 && loginResult.code === 0) {
      return true;
    } else {
      // lert login loi
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('user');
    delete axiosInstance.defaults.headers.common.Authorization;
    dispatch({ type: LOGOUT });
    dispatch({
      type: ACCOUNT_INITIALISE,
      payload: {
        isLoggedIn: false,
        user: null,
      },
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        const user = JSON.parse(window.localStorage.getItem('user'));
        // if (serviceToken && verifyToken(serviceToken)) {
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken, user, { turnOnLoading, turnOffLoading });
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: true,
              user,
            },
          });
        } else {
          dispatch({
            type: ACCOUNT_INITIALISE,
            payload: {
              isLoggedIn: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: ACCOUNT_INITIALISE,
          payload: {
            isLoggedIn: false,
            user: null,
          },
        });
      }
    };

    init();
  }, []);

  if (!state.isInitialised) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, forgotpass, validatechangepass }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
