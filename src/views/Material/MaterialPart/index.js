import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import MaterialPartTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
import { apiEndpoints } from './../../../store/constant';
import { getAllMaterialCategory } from '../../../services/api/Setting/MaterialCategory.js';
const MaterialPartWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialPart' });
      const response = await getAllMaterialCategory();
      setCategories(response.list);
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <MaterialPartTable
        tableTitle="Quản lý Vật tư"
        categories={categories}
        url={getUrlByAction(selectedFolder)}
        documentType="materialPart"
        // setActiveUrl={apiEndpoints.active_material_Part}
      />
    </React.Fragment>
  );
};

export default MaterialPartWrapper;