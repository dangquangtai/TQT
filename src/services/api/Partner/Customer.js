import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getCustomerList = () => {
  return axiosServices
    .post(apiEndpoints.get_all_customer, {})
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
