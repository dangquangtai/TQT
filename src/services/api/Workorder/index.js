import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from '../../axios.js';

export const getDetailWorkorOrder = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_work_order_detail, { id })
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

export const getStatusList = () => {
  return axiosServices
    .post(apiEndpoints.get_work_order_status_list, {})
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

export const createWorkorOrder = (data) => {
  return axiosServices.post(apiEndpoints.create_work_order, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateOrder = (data) => {
  return axiosServices.post(apiEndpoints.update_order, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

