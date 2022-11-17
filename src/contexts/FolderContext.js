import React, { createContext } from 'react';
import { FOLDER_CHANGE } from '../store/actions';
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
        }
      });
  }

  return <FolderContext.Provider value={{ getFolders, reloadFolders: getFolders }}>{children}</FolderContext.Provider>;
};

export default FolderContext;
