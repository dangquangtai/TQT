import * as axios from 'axios';
import { apiDomain } from '../store/constant';
const apiServices = axios.create({
  baseURL: apiDomain,
});

export default apiServices;
