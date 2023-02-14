import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailPurchaseMaterial = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_purchase_material_detail, { id })
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

export const createPurchaseMaterial = (data) => {
  return axiosServices.post(apiEndpoints.create_purchase_material, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updatePurchaseMaterial = (data) => {
  return axiosServices.post(apiEndpoints.update_purchase_material, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const getPurchaseMaterialStatus = () => {
  return axiosServices
    .post(apiEndpoints.get_purchase_material_status, {})
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { warehouse_list, status_list } = response.data;
        return { warehouse_list, status_list };
      }
      return [];
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPurchaseMaterialList = (supplier_id) => {
  return axiosServices
    .post(apiEndpoints.get_purchase_material_by_status, { supplier_id })
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

export const getPurchaseMaterialByOrder = (material_order_id) => {
  return axiosServices
    .post(apiEndpoints.get_purchase_material_detail_by_order_id, { material_order_id })
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

export const deletePurchaseMaterialDetail = (id) => {
  return axiosServices.post(apiEndpoints.delete_purchase_material, { id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const exportMaterial = () => {
  return axiosServices
    .post(apiEndpoints.export_purchase_material, {})
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
