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

export const getDetailCustomer = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_customer_detail, { id })
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

export const createCustomer = (data) => {
  return axiosServices.post(apiEndpoints.create_customer, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateCustomer = (data) => {
  return axiosServices.post(apiEndpoints.update_customer, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
