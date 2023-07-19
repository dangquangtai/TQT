import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const ProductContractService = {
  create: async (data) => {
    const response = await axiosServices.post(apiEndpoints.create_product_contract, { ...data });
    return response.data;
  },
  update: async (data) => {
    const response = await axiosServices.post(apiEndpoints.update_product_contract, { ...data });
    return response.data;
  },
  detail: (id, setView) => {
    return axiosServices.post(apiEndpoints.get_product_contract_detail, { id }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data, view } = response.data;
        setView({ ...view, action: 'detail' });
        return data;
      }
      return [];
    });
  },
  getData: async () => {
    const response = await axiosServices.post(apiEndpoints.get_product_contract_data, {});
    return response.data;
  },
  all: async (page = 1, no_item_per_page = 1000, search_text = '') => {
    const response = await axiosServices.post(apiEndpoints.get_product_contract_list, { page, no_item_per_page, search_text });
    return response.data.list;
  },
  getBySupplierAndProduct: async ({ product_id, supplier_id }) => {
    const response = await axiosServices.post(apiEndpoints.get_product_contract_list_by_supplier_and_product, { product_id, supplier_id });
    return response.data.list;
  },
  deleteDetail: async (id) => {
    const response = await axiosServices.post(apiEndpoints.delete_product_contract_detail, { id });
    return response.data;
  },
  getContractUnfinished: async () => {
    const response = await axiosServices.post(apiEndpoints.get_product_contract_unfinished, {});
    return response.data.list;
  },
  getContractDetail: async (id) => {
    const response = await axiosServices.post(apiEndpoints.get_product_contract_detail_list, { id });
    return response.data.list;
  },
};
