import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailSupplier = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_supplier_detail, { id })
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

export const createSupplier = (data) => {
  return axiosServices.post(apiEndpoints.create_supplier, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateSupplier = (data) => {
  return axiosServices.post(apiEndpoints.update_supplier, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
