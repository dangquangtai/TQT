import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from '../../axios.js';

export const getDetailProduct = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_product_detail, { id })
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

export const getAllProduct = () => {
  return axiosServices
    .post(apiEndpoints.get_all_product_list, {})
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
