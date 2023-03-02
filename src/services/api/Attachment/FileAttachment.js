import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const createFileAttachment = (data) => {
  return axiosServices.post(apiEndpoints.create_new_attachment, { ...data }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
export const getListFile = (id) => {
  return axiosServices.post(apiEndpoints.get_list_file, { id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      const { list: data } = response.data;
      return data;
    }
    return [];
  });
};
export const deleteFileAttachment = (id) => {
  return axiosServices.post(apiEndpoints.delete_file_attach, { id }).then((response) => {
    if (response.status === 200 && response.data.return === 200) {
      return true;
    }
    return false;
  });
};
