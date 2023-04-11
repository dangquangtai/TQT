import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const ProductInventoryCheckService = {
  detail: async (id, setView) => {
    const response = await axiosServices.post(apiEndpoints.get_product_inventory_check_detail, { id });
    const { data, view } = response.data;
    setView({ ...view, action: 'detail' });
    return data;
  },
  create: async (data) => {
    const response = await axiosServices.post(apiEndpoints.create_product_inventory_check, { ...data });
    return response.data;
  },
  update: async (data) => {
    const response = await axiosServices.post(apiEndpoints.update_product_inventory_check, { ...data });
    return response.data;
  },
  import: async (data) => {
    const response = await axiosServices.post(apiEndpoints.import_product_inventory_check, { ...data });
    return response.data;
  },
  apply: async (id) => {
    const response = await axiosServices.post(apiEndpoints.apply_product_inventory_check, { id });
    return response.data;
  },
  remove: async (id) => {
    const response = await axiosServices.post(apiEndpoints.remove_product_inventory_check, { id });
    return response.data;
  },
  data: async () => {
    const response = await axiosServices.post(apiEndpoints.get_product_inventory_check_data, {});
    return response.data;
  },
};
