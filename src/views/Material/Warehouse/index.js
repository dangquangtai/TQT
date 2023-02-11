import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import { apiEndpoints } from '../../../store/constant.js';
import MaterialWarehouseTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const MaterialWarehouseWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialWarehouse' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <MaterialWarehouseTable
        tableTitle="Quản lý kho vật tư"
        url={getUrlByAction(selectedFolder)}
        documentType="materialWarehouse"
        setActiveUrl={apiEndpoints.active_material_warehouse}
      />
    </React.Fragment>
  );
};

export default MaterialWarehouseWrapper;
