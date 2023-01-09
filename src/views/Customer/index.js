import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCustomerCategory } from '../../services/api/Setting/CustomerCategory.js';
import { DOCUMENT_CHANGE } from '../../store/actions.js';
import { apiEndpoints } from '../../store/constant.js';
import CustomerTable from '../Table';
import { getUrlByAction } from './../../utils/utils';
const CustomerWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'customer' });
      const response = await getAllCustomerCategory();
      setCategories(response);
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <CustomerTable
        tableTitle="Quản lý Khách hàng"
        url={getUrlByAction(selectedFolder)}
        documentType="customer"
        categories={categories}
        setActiveUrl={apiEndpoints.active_customer}
      />
    </React.Fragment>
  );
};

export default CustomerWrapper;
