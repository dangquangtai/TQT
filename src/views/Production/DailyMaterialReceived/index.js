import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import { apiEndpoints } from '../../../store/constant.js';
import DailyMaterialReceivedTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const DailyMaterialReceivedWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'dailyMaterialReceived' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <DailyMaterialReceivedTable
        tableTitle="Nhập kho vật tư theo lệnh sản xuất"
        url={getUrlByAction(selectedFolder)}
        documentType="dailyMaterialReceived"
        // setActiveUrl={apiEndpoints.active_product_warehouse}
      />
    </React.Fragment>
  );
};

export default DailyMaterialReceivedWrapper;
