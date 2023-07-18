import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ReceivedProductTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';

const ReceivedProductWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'productReceived' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [dispatch, selectedProject]);

  return (
    <React.Fragment>
      <ReceivedProductTable tableTitle="Nhập kho thành phẩm" url={getUrlByAction(selectedFolder)} documentType="productReceived" />
    </React.Fragment>
  );
};

export default ReceivedProductWrapper;
