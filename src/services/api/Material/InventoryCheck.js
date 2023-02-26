import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailInventoryCheck = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_material_inventory_check_detail, { id })
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

export const createInventoryCheck = (data) => {
  return axiosServices.post(apiEndpoints.create_material_inventory_check, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateInventoryCheck = (data) => {
  return axiosServices.post(apiEndpoints.update_material_inventory_check, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const getMoreInventoryCheckData = () => {
  return axiosServices.post(apiEndpoints.get_more_inventory_check, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const { warehouses, status, categories } = response.data;
      return { warehouses, status, categories };
    }
    return [];
  });
};

export const importInventoryCheck = (data) => {
  return axiosServices.post(apiEndpoints.import_material_inventory_check, data).then((response) => {
    if (response.status === 200) {
      return response.data;
    }
  });
};

export const applyInventoryCheck = (id) => {
  return axiosServices.post(apiEndpoints.apply_material_inventory_check, { id }).then((response) => {
    if (response.status === 200) return response.data;
  });
};

export const removeInventoryCheck = (id) => {
  return axiosServices.post(apiEndpoints.remove_material_inventory_check, { id }).then((response) => {
    if (response.status === 200) return response.data;
  });
};
