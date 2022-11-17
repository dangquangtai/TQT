import * as actionTypes from './actions';

export const initialState = {
  logoUrl: '',
  banners: [],
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.HOME_CHANGE:
      return {
        ...state,
        logoUrl: action.logoUrl,
        banners: action.banners.map((banner) => banner.url),
      };
    default:
      return state;
  }
};

export default homeReducer;
