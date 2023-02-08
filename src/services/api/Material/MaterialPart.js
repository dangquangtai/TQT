import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailMaterialPart = (id, setView) => {
    return axiosServices
        .post(apiEndpoints.get_material_part_detail, { id })
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
export const getMaterialLoadData = () => {
    return axiosServices.post(apiEndpoints.get_material_load_data, {}).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            const data = response.data;
            return data;
        }
        return [];
    });
};
export const createMaterialPart = (data) => {
    return axiosServices.post(apiEndpoints.create_material_part, data).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            return true;
        }
        return false;
    });
};

export const updateMaterialPart = (data) => {
    return axiosServices.post(apiEndpoints.update_material_part, data).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            return true;
        }
        return false;
    });
};