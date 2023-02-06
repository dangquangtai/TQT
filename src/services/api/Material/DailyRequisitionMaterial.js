import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from './../../axios';

export const getDetailDeliveryMaterial = (id, setView) => {
    return axiosServices
        .post(apiEndpoints.get_detail_delivery_material, { id })
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

export const createDeliveryMaterial = (data) => {
    return axiosServices.post(apiEndpoints.create_delivery_material, data).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            return true;
        }
        return false;
    });
};

export const updateDeliveryMaterial = (data) => {
    return axiosServices.post(apiEndpoints.update_delivery_material, data).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            return true;
        }
        return false;
    });
};

export const getDeliveryMaterialData = () => {
    return axiosServices.post(apiEndpoints.get_delivery_material_data, {}).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            const { status_list: status, warehouse_list: warehouses } = response.data;
            return { status, warehouses };
        }
        return [];
    });
};

export const deleteDeliveryMaterialDetail = (id) => {
    return axiosServices.post(apiEndpoints.delete_delivery_material_detail, { id }).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            return true;
        }
        return false;
    });
};
export const getInventoryBySupplier = (id) => {
    return axiosServices.post(apiEndpoints.get_material_inventory_by_supplier, { id }).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            const { data } = response.data;
            return data;
        }
        return [];
    });
};
export const getInventoryByPartID = (id) => {
    return axiosServices.post(apiEndpoints.get_material_inventory_by_part_id, { id }).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            const { data } = response.data;
            return data;
        }
        return [];
    });
};


