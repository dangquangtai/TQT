import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ReturnMaterialTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const ReturnMaterialWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'returnMaterial' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <ReturnMaterialTable
        tableTitle="Hoàn trả vật tư"
        url={getUrlByAction(selectedFolder)}
        documentType="returnMaterial"
        // setActiveUrl={apiEndpoints.active_material_Inventory}
      />
    </React.Fragment>
  );
};

export default ReturnMaterialWrapper;
