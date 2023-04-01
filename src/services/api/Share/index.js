import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const ShareService = {
  getActivityLog: async (id) => {
    const response = await axiosServices.post(apiEndpoints.get_activity_logs_list, { id });
    return response.data.list;
  },
};
