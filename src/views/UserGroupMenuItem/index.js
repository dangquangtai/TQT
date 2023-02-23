import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserGroupTable from '../Table';
import { getUrlByAction } from '../../utils/utils';
import { DOCUMENT_CHANGE } from '../../store/actions';
import { usergroupItemAction } from '../../store/constant';
// import axiosInstance from '../../services/axios';

const UserGroupMenuItemWrapper = () => {
  const dispatch = useDispatch();

  const [categories, setCategories] = React.useState([]);

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  const handleGetDocumentType = (selectedFolder) =>{
    if(selectedFolder.action===usergroupItemAction.list_role_item){
      return 'usergroupmenuitem'
    }
    return 'usergroupmenutree'
  }
  useEffect(() => {
    async function fetchData() {
      let documentType= handleGetDocumentType(selectedFolder)
      dispatch({ type: DOCUMENT_CHANGE, documentType: documentType });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <UserGroupTable
        tableTitle="Quản lý cấu hình chức năng"
        url={getUrlByAction(selectedFolder)}
        categories={categories}
        documentType={handleGetDocumentType(selectedFolder)}
        // setFeaturedUrl={}
      />
    </React.Fragment>
  );
};

export default UserGroupMenuItemWrapper;
