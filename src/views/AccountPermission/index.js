import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AccountPermissionTable from '../Table';
import { getUrlByAction } from '../../utils/utils';
import { DOCUMENT_CHANGE } from '../../store/actions';
// import axiosInstance from '../../services/axios';

const AccountPermissionWrapper = () => {
  const dispatch = useDispatch();

  const [categories, setCategories] = React.useState([]);

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'accountpermission' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <AccountPermissionTable
        tableTitle="Quản lý cấu hình phân quyền"
        url={getUrlByAction(selectedFolder)}
        categories={categories}
        documentType="accountpermission"
        // setFeaturedUrl={}
      />
    </React.Fragment>
  );
};

export default AccountPermissionWrapper;
