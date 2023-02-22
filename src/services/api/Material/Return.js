import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailReturnMaterial = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_material_return_detail, { id })
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

export const createReturnMaterial = (data) => {
  return axiosServices.post(apiEndpoints.create_material_return, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateReturnMaterial = (data) => {
  return axiosServices.post(apiEndpoints.update_material_return, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const getReturnMaterialData = () => {
  return axiosServices
    .post(apiEndpoints.get_material_return_data, {})
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { status_list: status, warehouse_list: warehouses } = response.data;
        return { status, warehouses };
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getMaterialBrokenList = (warehouse_id, supplier_id) => {
  return axiosServices.post(apiEndpoints.get_material_broken_list, { warehouse_id, supplier_id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const { list } = response.data;
      return list;
    }
    return [];
  });
};

export const exportReturnMaterial = (id) => {
  return axiosServices
    .post(apiEndpoints.export_material_return, { id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { url } = response.data;
        return url;
      }
      return '';
    })
    .catch((error) => {
      console.log(error);
    });
};
