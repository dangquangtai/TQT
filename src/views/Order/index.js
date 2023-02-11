import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../store/actions.js';
import OrderTable from '../Table';
import { getUrlByAction } from './../../utils/utils';
const OrderWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'order' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <OrderTable
        tableTitle="Quản lý đơn hàng"
        url={getUrlByAction(selectedFolder)}
        documentType="order"
        // setActiveUrl={apiEndpoints.active_material_Part}
      />
    </React.Fragment>
  );
};

export default OrderWrapper;
