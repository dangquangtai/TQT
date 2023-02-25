import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailDailyMaterialReceived = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_production_daily_material_received_detail, { id })
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

export const updateDailyMaterialReceived = (data) => {
  return axiosServices.post(apiEndpoints.update_production_daily_material_received, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const getDailyMaterialReceivedData = () => {
  return axiosServices.post(apiEndpoints.get_production_daily_material_received_data, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const { status_list: status, warehouse_list: warehouses, work_order_list: workOrders } = response.data;
      return { status, warehouses, workOrders };
    }
    return [];
  });
};

export const exportDailyMaterialReceived = (id) => {
  return axiosServices
    .post(apiEndpoints.export_production_daily_material_received, { id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.data.url;
      }
      return '';
    })
    .catch((error) => {});
};
