import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const ProductRequisitionService = {
  create: async (data) => {
    const response = await axiosServices.post(apiEndpoints.create_product_requisition, { ...data });
    return response.data;
  },
  update: async (data) => {
    const response = await axiosServices.post(apiEndpoints.update_product_requisition, { ...data });
    return response.data;
  },
  detail: (id, setView) => {
    return axiosServices.post(apiEndpoints.get_product_requisition_detail, { id }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data, view } = response.data;
        setView({ ...view, action: 'detail' });
        return data;
      }
      return [];
    });
  },
  getData: async () => {
    const response = await axiosServices.post(apiEndpoints.get_product_requisition_data, {});
    return response.data;
  },
};
