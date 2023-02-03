import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailProductInventory = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_product_inventory_detail, { id })
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
