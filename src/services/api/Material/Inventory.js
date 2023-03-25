import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailInventory = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_material_inventory_detail, { id })
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

export const updateMaterialInventory = (data) => {
  return axiosServices.post(apiEndpoints.update_material_inventory, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const exportMaterialInventory = () => {
  return axiosServices
    .post(apiEndpoints.export_material_inventory, {})
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
export const getInOutDetailList = (part_id, supplier_id) => {
  return axiosServices.post(apiEndpoints.get_in_out_detail_list, { part_id, supplier_id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.data;
    }
    return [];
  });
};
