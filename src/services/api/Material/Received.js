import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailReceivedMaterial = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_received_material_detail, { id })
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

export const createReceivedMaterial = (data) => {
  return axiosServices.post(apiEndpoints.create_received_material, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateReceivedMaterial = (data) => {
  return axiosServices.post(apiEndpoints.update_received_material, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const getReceivedMaterialStatus = () => {
  return axiosServices.post(apiEndpoints.get_received_material_status, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const { status_list: status, warehouse_list: warehouses } = response.data;
      return { status, warehouses };
    }
    return [];
  });
};

export const deleteReceivedMaterialDetail = (id) => {
  return axiosServices.post(apiEndpoints.delete_received_material, { id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const exportMaterialReceived = (id) => {
  return axiosServices
    .post(apiEndpoints.export_material_received, { id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.data.url;
      }
      return '';
    })
    .catch((error) => {
      console.log(error);
    });
};
