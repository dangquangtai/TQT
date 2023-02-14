import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import CustomerCategoryTable from '../../Table';
import { getUrlByAction } from '../../../utils/utils';
import { apiEndpoints } from '../../../store/constant';
const CustomerCategoryWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'customerCategory' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <CustomerCategoryTable
        tableTitle="Danh mục khách hàng"
        url={getUrlByAction(selectedFolder)}
        documentType="customerCategory"
        setActiveUrl={apiEndpoints.active_customer_category}
      />
    </React.Fragment>
  );
};

export default CustomerCategoryWrapper;
