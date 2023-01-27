import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailWorkshop = (id, setView) => {
  return axiosServices
    .post(apiEndpoints.get_workshop_detail, { id })
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

export const createWorkshop = (data) => {
  return axiosServices.post(apiEndpoints.create_workshop, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};

export const updateWorkshop = (data) => {
  return axiosServices.post(apiEndpoints.update_workshop, data).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
