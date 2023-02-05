import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ProductInventoryTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const ProductInventoryWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'productInventory' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <ProductInventoryTable
        tableTitle="Quản lý Tồn kho thành phẩm"
        url={getUrlByAction(selectedFolder)}
        documentType="productInventory"
        // setActiveUrl={apiEndpoints.active_Product_Inventory}
      />
    </React.Fragment>
  );
};

export default ProductInventoryWrapper;
