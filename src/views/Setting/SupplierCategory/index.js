import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import SupplierCategoryTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
import { apiEndpoints } from './../../../store/constant';
const SupplierCategoryWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'supplierCategory' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <SupplierCategoryTable
        tableTitle="Quản lý Danh mục nhà cung cấp"
        url={getUrlByAction(selectedFolder)}
        documentType="supplierCategory"
        setActiveUrl={apiEndpoints.active_supplier_category}
      />
    </React.Fragment>
  );
};

export default SupplierCategoryWrapper;
