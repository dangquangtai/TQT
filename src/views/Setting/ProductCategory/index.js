import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ProductCategoryTable from '../../Table';
import { getUrlByAction } from '../../../utils/utils';
import { apiEndpoints } from '../../../store/constant';
const ProductCategoryWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'productCategory' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <ProductCategoryTable
        tableTitle="Quản lý Danh mục sản phẩm"
        url={getUrlByAction(selectedFolder)}
        documentType="productCategory"
        setActiveUrl={apiEndpoints.active_product_category}
      />
    </React.Fragment>
  );
};

export default ProductCategoryWrapper;
