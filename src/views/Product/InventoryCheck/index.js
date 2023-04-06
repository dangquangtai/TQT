import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ProductInventoryCheckTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const ProductInventoryCheckWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'productInventoryCheck' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <ProductInventoryCheckTable
        tableTitle="kiểm kê kho thành phẩm"
        url={getUrlByAction(selectedFolder)}
        documentType="productInventoryCheck"
      />
    </React.Fragment>
  );
};

export default ProductInventoryCheckWrapper;
