import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailGoodsReceipt = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_goods_receipt_detail, { id })
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

export const createGoodsReceipt = (data) => {
  return axiosServices.post(apiEndpoints.create_goods_receipt, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateGoodsReceipt = (data) => {
  return axiosServices.post(apiEndpoints.update_goods_receipt, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const getGoodsReceiptData = () => {
  return axiosServices.post(apiEndpoints.get_goods_receipt_data, {}).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const { status_list: status, warehouse_list: warehouses, work_order_list: workOrders } = response.data;
      return { status, warehouses, workOrders };
    }
    return [];
  });
};

export const deleteGoodsReceiptDetail = (id) => {
  return axiosServices.post(apiEndpoints.delete_goods_receipt_detail, { id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
