import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import MaterialInventoryTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const MaterialInventoryWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialInventory' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <MaterialInventoryTable
        tableTitle="Quản lý tồn kho vật tư"
        url={getUrlByAction(selectedFolder)}
        documentType="materialInventory"
        // setActiveUrl={apiEndpoints.active_material_Inventory}
      />
    </React.Fragment>
  );
};

export default MaterialInventoryWrapper;
