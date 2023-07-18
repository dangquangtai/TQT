import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ProductTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';

const ProductRequisitionWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'productRequisition' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [dispatch, selectedProject]);

  return (
    <React.Fragment>
      <ProductTable tableTitle="Mua thành phẩm" url={getUrlByAction(selectedFolder)} documentType="productRequisition" />
    </React.Fragment>
  );
};

export default ProductRequisitionWrapper;
