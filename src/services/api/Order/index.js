import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from '../../axios.js';

export const getDetailOrder = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_order_detail, { id })
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
export const getDetailOrderByWorkOrder = (id, work_order_id, work_order_daily_id) => {
  return axiosServices
    .post(apiEndpoints.get_order_by_work_order_id, { id: id, work_order_id: work_order_id, work_order_daily_id: work_order_daily_id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data } = response.data;

        return data;
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
    });
};
export const getOrderProductDetail = (id) => {
  return axiosServices
    .post(apiEndpoints.get_order_detail, { id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data } = response.data;
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
    .post(apiEndpoints.get_status_list, {})
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { status, containers } = response.data;
        return { status, containers };
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createOrder = (data) => {
  return axiosServices.post(apiEndpoints.create_order, data).then((response) => {
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

export const deleteOrderDetail = (id) => {
  return axiosServices
    .post(apiEndpoints.delete_order_detail, { id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.log(error);
    });
};
export const getOrderCompletedList = () => {
  return axiosServices
    .post(apiEndpoints.get_order_completed_list, {
      company_code: 'TQT',
      outputtype: 'RawJson',
    })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.data.list;
      }
      return [];
    });
};

export const getOrderByStatus = (status) => {
  return axiosServices.post(apiEndpoints.get_order_by_status, { status }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return [];
  });
};

export const getOrderDetailList = (order_id, warehouse_id) => {
  return axiosServices.post(apiEndpoints.get_order_detail_list, { order_id, warehouse_id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return [];
  });
};
