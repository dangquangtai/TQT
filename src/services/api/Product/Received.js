import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const ProductReceivedService = {
  create: async (data) => {
    const response = await axiosServices.post(apiEndpoints.create_product_received, { ...data });
    return response.data;
  },
  update: async (data) => {
    const response = await axiosServices.post(apiEndpoints.update_product_received, { ...data });
    return response.data;
  },
  detail: (id, setView) => {
    return axiosServices.post(apiEndpoints.get_product_received_detail, { id }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data, view } = response.data;
        setView({ ...view, action: 'detail' });
        return data;
      }
      return [];
    });
  },
  getData: async () => {
    const response = await axiosServices.post(apiEndpoints.get_product_received_data, {});
    return response.data;
  },
  deleteDetail: async (id) => {
    const response = await axiosServices.post(apiEndpoints.delete_product_received_detail, { id });
    return response.data;
  },
  getOrderByProduct: async (product_id) => {
    const response = await axiosServices.post(apiEndpoints.get_order_by_product, { product_id });
    return response.data.list;
  },
  getOrderdRequistion: async (supplier_id, warehouse_id) => {
    const response = await axiosServices.post(apiEndpoints.get_ordered_product_requisition, { supplier_id, warehouse_id });
    return response.data;
  },
};
