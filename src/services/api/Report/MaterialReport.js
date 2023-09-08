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
export const addMaterialReportFileToReport = (data) => {
  return axiosServices.post(apiEndpoints.add_material_report_file, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.url;
    }
    return '';
  });
};
export const createMaterialReportFile = (data) => {
  return axiosServices.post(apiEndpoints.create_new_material_report_file, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.report_id;
    }
    return '';
  });
};
export const getListPart = (list_supplier_id) => {
  return axiosServices.post(apiEndpoints.get_list_material_from_list_supplier_id, list_supplier_id).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return '';
  });
};
export const getListSupplierFromMaterialCategory = (category_list) => {
  return axiosServices.post(apiEndpoints.get_list_supplier_from_list_material_category, category_list).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return '';
  });
};
export const getMaterialReportDetail = (reportID) => {
  return axiosServices.post(apiEndpoints.get_detail_material_report, { report_id: reportID }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.data;
    }
    return '';
  });
};
export const getListCustomerOrderCode = () => {
  return axiosServices.post(apiEndpoints.get_list_customer_order_code_for_report, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return '';
  });
};
export const getMaterialInventorySynthesis = (data) => {
  return axiosServices.post(apiEndpoints.get_material_inventory_synthesis, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return '';
  });
};
export const getViewDataForReporTemplate = (data) => {
  return axiosServices.post(apiEndpoints.get_view_data_for_report_template, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data;
    }
    return [];
  });
};
export const getAllProduct = () => {
  return axiosServices.post(apiEndpoints.get_list_product_for_report, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return [];
  });
};
export const getAllCustomerCode = () => {
  return axiosServices.post(apiEndpoints.get_list_customer_code_for_report, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.list;
    }
    return [];
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

export const getAllMaterialReportType = (category) => {
  return axiosServices.post(apiEndpoints.get_list_report_type, { category }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return response.data.data;
    }
    return [];
  });
};
