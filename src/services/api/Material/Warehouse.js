import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailMaterialWarehouse = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_material_warehouse_detail, { id })
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

export const createMaterialWarehouse = (data) => {
  return axiosServices.post(apiEndpoints.create_material_warehouse, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateMaterialWarehouse = (data) => {
  return axiosServices.post(apiEndpoints.update_material_warehouse, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
