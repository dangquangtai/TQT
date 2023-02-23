import { apiEndpoints } from '../../../store/constant.js';
import axiosServices from '../../axios.js';

export const getDetailTemplateDocument = (id, setView) => {
    return axiosServices
        .post(apiEndpoints.get_document_template_detail, { id })
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

export const createDocumentTemplate = (data) => {
    return axiosServices
        .post(apiEndpoints.create_document_template, data)
        .then((response) => {
            if (response.status === 200 && response.data.return === 200) {
                return response.true;
            }
            return false;
        })
        .catch((error) => {
            console.log(error);
        });
};

export const updateDocumentTemplate = (data) => {
    return axiosServices
        .post(apiEndpoints.update_document_template, data)
        .then((response) => {
            if (response.status === 200 && response.data.return === 200) {
                return response.true;
            }
            return false;
        })
        .catch((error) => {
            console.log(error);
        });
};