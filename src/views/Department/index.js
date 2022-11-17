import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DepartmentTable from '../Table';
import { getUrlByAction } from '../../utils/utils';
import { DOCUMENT_CHANGE } from '../../store/actions';
// import axiosInstance from '../../services/axios';

const DepartmentWrapper = () => {
  const dispatch = useDispatch();

  const [categories, setCategories] = React.useState([]);

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'department' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <DepartmentTable
        tableTitle="Quản lý phòng ban"
        url={getUrlByAction(selectedFolder)}
        categories={categories}
        documentType="department"
        // setFeaturedUrl={}
      />
    </React.Fragment>
  );
};

export default DepartmentWrapper;
