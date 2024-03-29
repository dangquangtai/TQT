import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailProductWarehouse = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_product_warehouse_detail, { id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data, view } = response.data;
        setView({ ...view, action: 'detail' });
        return data;
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createProductWarehouse = (data) => {
  return axiosServices.post(apiEndpoints.create_product_warehouse, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateProductWarehouse = (data) => {
  return axiosServices.post(apiEndpoints.update_product_warehouse, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
