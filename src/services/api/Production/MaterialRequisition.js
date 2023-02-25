import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailDailyMaterialRequisition = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_production_daily_material_requisition_detail, { id })
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

export const updateDailyMaterialRequisition = (data) => {
  return axiosServices.post(apiEndpoints.update_production_daily_material_requisiton, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const exportDailyMaterialRequisition = (id) => {
  return axiosServices
    .post(apiEndpoints.export_production_daily_material_requisition, { id: id })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        return response.data.url;
      }
      return '';
    })
    .catch((error) => {});
};
