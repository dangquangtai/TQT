import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../store/actions.js';
import MaterialReportTable from '../Table';
import { getUrlByAction } from './../../utils/utils';
const MaterialReportWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialReport' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <MaterialReportTable
        tableTitle="Quản lý báo cáo vật tư"
        url={getUrlByAction(selectedFolder)}
        documentType="materialReport"
        // setActiveUrl={apiEndpoints.active_material_Inventory}
      />
    </React.Fragment>
  );
};

export default MaterialReportWrapper;
