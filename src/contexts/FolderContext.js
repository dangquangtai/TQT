import React, { createContext } from 'react';
import { FOLDER_CHANGE, MENU_OPEN, SELECTED_FOLDER_CHANGE } from '../store/actions';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import { useDispatch } from 'react-redux';

const FolderContext = createContext({
  getFolders: () => Promise.resolve(),
});

export const FolderProvider = ({ children }) => {
  const dispatch = useDispatch();

  function getFolders(selectedProject, app_id) {
    if (!selectedProject) return;
    axiosInstance
      .post(apiEndpoints.get_folders, {
        outputtype: 'RawJson',
        company_code: 'MYM',
        app_id: app_id,
        project_id: selectedProject.id,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { Item: folders } = response.data;

          dispatch({
            type: FOLDER_CHANGE,
            folder: folders,
          });

          let selectedItem = folders.children.find((item) => item.action !== '');
          if (folders.children.children?.length > 0) {
            selectedItem = folders.children.children.find((item) => item.action !== '');
          }

          dispatch({ type: MENU_OPEN, isOpen: selectedItem?.id });
          dispatch({ type: SELECTED_FOLDER_CHANGE, selectedFolder: selectedItem });
        }
      });
  }

  return <FolderContext.Provider value={{ getFolders, reloadFolders: getFolders }}>{children}</FolderContext.Provider>;
};

export default FolderContext;
