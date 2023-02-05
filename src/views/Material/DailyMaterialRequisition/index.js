import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import DeliveryMaterialTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const DeliveryMaterialWrapper = () => {
    const dispatch = useDispatch();

    const { projects } = useSelector((state) => state.project);
    const selectedProject = projects.find((project) => project.selected);
    const { selectedFolder } = useSelector((state) => state.folder);
    useEffect(() => {
        function fetchData() {
            dispatch({ type: DOCUMENT_CHANGE, documentType: 'deliveryMaterial' });
        }
        if (selectedProject) {
            fetchData();
        }
    }, [selectedProject]);

    return (
        <React.Fragment>
            <DeliveryMaterialTable
                tableTitle="Quản lý xuất kho vật tư"
                url={getUrlByAction(selectedFolder)}
                documentType="deliveryMaterial"
            // setActiveUrl={apiEndpoints.active_material_Inventory}
            />
        </React.Fragment>
    );
};

export default DeliveryMaterialWrapper;
