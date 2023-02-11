import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import MaterialInventoryCheckTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const MaterialInventoryCheckWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialInventoryCheck' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <MaterialInventoryCheckTable
        tableTitle="Quản lý kiểm kê vật tư"
        url={getUrlByAction(selectedFolder)}
        documentType="materialInventoryCheck"
        // setActiveUrl={apiEndpoints.active_material_Inventory}
      />
    </React.Fragment>
  );
};

export default MaterialInventoryCheckWrapper;
