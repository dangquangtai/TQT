import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import WarehouseCategoryTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
import { apiEndpoints } from './../../../store/constant';
const WarehouseCategoryWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'warehouseCategory' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <WarehouseCategoryTable
        tableTitle="Quản lý Loại kiểm kê"
        url={getUrlByAction(selectedFolder)}
        documentType="warehouseCategory"
        setActiveUrl={apiEndpoints.active_warehouse_category}
      />
    </React.Fragment>
  );
};

export default WarehouseCategoryWrapper;
