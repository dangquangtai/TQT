import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from '../../axios.js';

export const getDetailSupplierCategory = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_supplier_category_detail, { id })
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

export const createSupplierCategory = (data) => {
  return axiosServices
    .post(apiEndpoints.create_supplier_category, data)
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

export const updateSupplierCategory = (data) => {
  return axiosServices
    .post(apiEndpoints.update_supplier_category, data)
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

export const getAllSupplierCategory = (page = 1, no_item_per_page = 10, search_text = '') => {
  return axiosServices
    .post(apiEndpoints.get_supplier_category_list, { page, no_item_per_page, search_text })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.data.list;
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
    });
};
