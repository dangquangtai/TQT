import React, { createContext } from 'react';
import { METADATA } from '../store/actions';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import { useDispatch } from 'react-redux';

const ShareContext = createContext({
  getProjects: () => Promise.resolve(),
});

export const ShareProvider = ({ children }) => {
  const dispatch = useDispatch();

  function getMetadata() {
    axiosInstance.post(apiEndpoints.get_metadata, { outputtype: 'RawJson', guest: true }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { product_list: products, material_list: materials } = response.data;
        dispatch({
          type: METADATA,
          products,
          materials,
        });
      }
    });
  }

  return <ShareContext.Provider value={{ getMetadata }}>{children}</ShareContext.Provider>;
};

export default ShareContext;
