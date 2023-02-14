import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import MaterialCategoryTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
import { apiEndpoints } from './../../../store/constant';
const MaterialCategoryWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialCategory' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <MaterialCategoryTable
        tableTitle="Danh mục vật tư"
        url={getUrlByAction(selectedFolder)}
        documentType="materialCategory"
        setActiveUrl={apiEndpoints.active_material_category}
      />
    </React.Fragment>
  );
};

export default MaterialCategoryWrapper;
