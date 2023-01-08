import React, { createContext } from 'react';
import { PROJECT_CHANGE, APP_CHANGE } from '../store/actions';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import { useDispatch } from 'react-redux';

const ProjectContext = createContext({
  getProjects: () => Promise.resolve(),
});

export const ProjectProvider = ({ children }) => {
  const dispatch = useDispatch();

  function getProjects(id) {
    axiosInstance.post(apiEndpoints.get_project_list, { outputtype: 'RawJson', app_id: id }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data: projects } = response.data;
        if (projects.length > 0) projects[0].selected = true;

        dispatch({
          type: PROJECT_CHANGE,
          projects,
        });
      }
    });
  }

  function getApps() {
    axiosInstance.post(apiEndpoints.get_app_list, { outputtype: 'RawJson' }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { list: apps } = response.data;

        dispatch({
          type: APP_CHANGE,
          apps,
        });
      }
    });
  }

  return <ProjectContext.Provider value={{ getProjects, getApps }}>{children}</ProjectContext.Provider>;
};

export default ProjectContext;
