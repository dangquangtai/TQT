import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailGoodsIssue = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_goods_issue_detail, { id })
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

export const createGoodsIssue = (data) => {
  return axiosServices.post(apiEndpoints.create_goods_issue, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateGoodsIssue = (data) => {
  return axiosServices.post(apiEndpoints.update_goods_issue, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const getGoodsIssueData = () => {
  return axiosServices.post(apiEndpoints.get_goods_issue_data, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const { status_list: status, warehouse_list: warehouses, customer_list: customers } = response.data;
      return { status, warehouses, customers };
    }
    return [];
  });
};

export const deleteGoodsIssueDetail = (id) => {
  return axiosServices.post(apiEndpoints.delete_goods_issue_detail, { id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
export const getLink = (id) => {
  return axiosServices
    .post(apiEndpoints.export_goods_issue_request, { id:id })
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