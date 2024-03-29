import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../store/actions.js';
import SupplierTable from '../Table';
import { getUrlByAction } from '../../utils/utils';
import { getAllSupplierCategory } from '../../services/api/Setting/SupplierCategory.js';
import { apiEndpoints } from '../../store/constant.js';
const SupplierWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'supplier' });
      const response = await getAllSupplierCategory();
      setCategories(response);
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <SupplierTable
        tableTitle="Quản lý nhà cung cấp"
        url={getUrlByAction(selectedFolder)}
        documentType="supplier"
        categories={categories}
        setActiveUrl={apiEndpoints.active_supplier}
      />
    </React.Fragment>
  );
};

export default SupplierWrapper;
