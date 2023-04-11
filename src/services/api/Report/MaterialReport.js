import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const downloadMaterialReportFile = (id) => {
  return axiosServices.post(apiEndpoints.download_material_report_file, { id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const data = response.data.url;
      return data;
    }
    return [];
  });
};

export const createMaterialReport = (data) => {
  return axiosServices.post(apiEndpoints.create_new_material_report, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
export const createMaterialReportFile = (data) => {
  return axiosServices.post(apiEndpoints.create_new_material_report_file, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.url;
    }
    return '';
  });
};
export const getAllWorkOrder = () => {
  return axiosServices.post(apiEndpoints.get_list_work_order, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return [];
  });
};

export const getAllMaterialReportType = () => {
  return axiosServices.post(apiEndpoints.get_list_report_type, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.data;
    }
    return [];
  });
};
