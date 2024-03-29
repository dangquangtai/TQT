import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from '../../axios.js';

export const getDetailMaterialCategory = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_material_category_detail, { id })
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

export const createMaterialCategory = (data) => {
  return axiosServices
    .post(apiEndpoints.create_material_category, data)
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.true;
      }
      return false;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateMaterialCategory = (data) => {
  return axiosServices
    .post(apiEndpoints.update_material_category, data)
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.true;
      }
      return false;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getAllMaterialCategory = (page = 1, no_item_per_page = 10, search_text = '', order_by = '', order_type = '') => {
  return axiosServices
    .post(apiEndpoints.get_material_category_list, { page, no_item_per_page, search_text, order_by, order_type })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.data;
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
    });
};
