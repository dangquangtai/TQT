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
      return {work_order_request_id: response.data.work_order_request_id, 
        work_order_daily_request_id: response.data.work_order_daily_request_id};
    }
    return false;
  });
};
export const updateWorkorOrder = (data) => {
  return axiosServices.post(apiEndpoints.update_work_order, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return {work_order_request_id: response.data.work_order_request_id, 
        work_order_daily_request_id: response.data.work_order_daily_request_id};
    }
    return false;
  });
};

export const checkMaterial = (data) => {
  return axiosServices.post(apiEndpoints.check_daily_workorder_material_avaiability, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return [];
  });
};

