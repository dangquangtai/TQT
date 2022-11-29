import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ProductTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
import { apiEndpoints } from './../../../store/constant';
const ProductWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'product' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <ProductTable
        tableTitle="Quản lý Thành phẩm"
        url={getUrlByAction(selectedFolder)}
        documentType="product"
        // setActiveUrl={apiEndpoints.active_material_Part}
      />
    </React.Fragment>
  );
};

export default ProductWrapper;
