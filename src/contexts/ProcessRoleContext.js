import React, { createContext } from 'react';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const ProcessRoleContext = createContext({});

export const ProcessRoleProvider = ({ children }) => {
  const { setView } = useView();

  const getRoleTree = async () => {
    return axiosInstance
      .post(apiEndpoints.get_role_tree_data, {
        outputtype: 'RawJson',
        
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
        
          return list;
        } else return {};
      });
  };
  const createProcessRole = async (role_code,role_name,process_code,app_code) => {
    return axiosInstance
      .post(apiEndpoints.create_process_role, {
        outputtype: 'RawJson',
        role_code: role_code,
        role_name: role_name,
        process_code: process_code,
        app_code: app_code,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
      
        
          return true;
        } else return false;
      });
  };
  const updateProcessRole = async (role_code,role_name,process_code,app_code) => {
    return axiosInstance
      .post(apiEndpoints.update_process_role, {
        outputtype: 'RawJson',
        role_code: role_code,
        role_name: role_name,
        process_code: process_code,
        app_code: app_code,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
        
          return true;
        } else return false;
      });
  };
  const addDeptUser = async (role_code,department_code,email_address) => {
    return axiosInstance
      .post(apiEndpoints.add_user_depart_to_process_role, {
        outputtype: 'RawJson',
        role_code: role_code,
        department_code: department_code,
        email_address: email_address,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
        
          return true;
        } else return false;
      });
  };
  const removeUser = async (role_code,email_address) => {
    return axiosInstance
      .post(apiEndpoints.remove_user_from_process_role, {
        outputtype: 'RawJson',
        role_code: role_code,
      
        email_address: email_address,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
        
          return true;
        } else return false;
      });
  };
  const removeDept = async (role_code,department_code) => {
    return axiosInstance
      .post(apiEndpoints.remove_dept_from_process_role, {
        outputtype: 'RawJson',
        role_code: role_code,
        department_code: department_code,
        
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
        
          return true;
        } else return false;
      });
  };
  const syncProcessRole = async () => {
    return axiosInstance
      .post(apiEndpoints.sync_process_role, {
        outputtype: 'RawJson',
     
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
        
          return true;
        } else return false;
      });
  };
  const getProcess = async (app_code) => {
    return axiosInstance
      .post(apiEndpoints.get_process_list, {
        outputtype: 'RawJson',
        app_code: app_code
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
        
          return list;
        } else return {};
      });
  };
  const getApp = async (app_code) => {
    return axiosInstance
      .post(apiEndpoints.get_app_list, {
        outputtype: 'RawJson',
     
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
        
          return list;
        } else return {};
      });
  };
  const getProcessDetail = async (role_code) => {
    return axiosInstance
      .post(apiEndpoints.get_role_detail, {
         outputtype: 'RawJson' ,role_code: role_code})
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };
  return (
    <ProcessRoleContext.Provider
      value={{
        getRoleTree,
        createProcessRole,
        updateProcessRole,
        addDeptUser,
        removeDept,
        removeUser,
        syncProcessRole,
        getProcessDetail,
        getProcess,
        getApp
      }}
    >
      {children}
    </ProcessRoleContext.Provider>
  );
};

export default ProcessRoleContext;
