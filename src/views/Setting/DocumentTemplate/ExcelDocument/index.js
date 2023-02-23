import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../../store/actions.js';
import MaterialCategoryTable from '../../../Table';
import { getUrlByAction } from './../../../../utils/utils';
import { apiEndpoints } from './../../../../store/constant';
const ExcelDocumentWrapper = () => {
    const dispatch = useDispatch();

    const { projects } = useSelector((state) => state.project);
    const selectedProject = projects.find((project) => project.selected);
    const { selectedFolder } = useSelector((state) => state.folder);

    useEffect(() => {
        async function fetchData() {
            dispatch({ type: DOCUMENT_CHANGE, documentType: 'templateDocument' });
        }
        if (selectedProject) {
            fetchData();
        }
    }, [selectedProject]);

    return (
        <React.Fragment>
            <MaterialCategoryTable
                tableTitle="Danh sách mẫu tài liệu"
                url={getUrlByAction(selectedFolder)}
                documentType="templateDocument"
            // setActiveUrl={apiEndpoints.active_material_category}
            />
        </React.Fragment>
    );
};

export default ExcelDocumentWrapper;
