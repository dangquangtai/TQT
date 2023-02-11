import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import { apiEndpoints } from '../../../store/constant.js';
import GoodsIssueTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const GoodsIssueWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'goodsIssue' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <GoodsIssueTable
        tableTitle="Quản lý xuất kho thành phẩm"
        url={getUrlByAction(selectedFolder)}
        documentType="goodsIssue"
        setActiveUrl={apiEndpoints.active_product_warehouse}
      />
    </React.Fragment>
  );
};

export default GoodsIssueWrapper;
