import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import PurchaseMaterialTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const PurchaseMaterialWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'purchaseMaterial' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <PurchaseMaterialTable
        tableTitle="Mua vật tư theo kế hoạch sản xuất"
        url={getUrlByAction(selectedFolder)}
        documentType="purchaseMaterial"
        // setActiveUrl={apiEndpoints.active_material_Inventory}
      />
    </React.Fragment>
  );
};

export default PurchaseMaterialWrapper;
