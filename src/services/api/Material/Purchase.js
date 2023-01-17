import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailPurchaseMaterial = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_purchase_material_detail, { id })
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

export const createPurchaseMaterial = (data) => {
  return axiosServices.post(apiEndpoints.create_purchase_material, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updatePurchaseMaterial = (data) => {
  return axiosServices.post(apiEndpoints.update_purchase_material, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
