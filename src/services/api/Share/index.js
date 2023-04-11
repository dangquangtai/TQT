import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const ShareService = {
  getActivityLog: async ({ id, page }) => {
    const response = await axiosServices.post(apiEndpoints.get_activity_logs_list, { id, page });
    return response.data;
  },
};
