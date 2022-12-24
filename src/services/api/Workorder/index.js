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
export const getDetail = (id) => {
  return axiosServices
    .post(apiEndpoints.get_work_order_detail, { id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data, view } = response.data;
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
export const getPartList = (id) => {
  return axiosServices
    .post(apiEndpoints.get_part_list, {id: id})
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
export const getMaterialInventoryList = (word_order_id, part_code) => {
  return axiosServices
    .post(apiEndpoints.get_material_inventory, {work_order_id: word_order_id, part_code: part_code })
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
export const getMaterialDaily= (daily_work_order_detail_id) => {
  return axiosServices
    .post(apiEndpoints.get_material_requisition_daily_detail, {daily_work_order_detail_id: daily_work_order_detail_id, outputtype: "RawJson" })
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
export const createMaterialRequisition = (data) => {
  return axiosServices.post(apiEndpoints.create_material_requisition_request_daily, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
export const createWorkorOrder = (data) => {
  return axiosServices.post(apiEndpoints.create_work_order, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return {work_order_request_id: response.data.work_order_request_id, 
        work_order_daily_request_id: response.data.work_order_daily_request_id,
        id_list:  response.data.id_list};
    }
    return false;
  });
};
export const updateWorkorOrder = (data) => {
  return axiosServices.post(apiEndpoints.update_work_order, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return {work_order_request_id: response.data.work_order_request_id, 
        work_order_daily_request_id: response.data.work_order_daily_request_id,
        id_list:  response.data.id_list};
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

