import React, { createContext } from 'react';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const RoleContext = createContext({});

export const RoleProvider = ({ children }) => {
  const { setView } = useView();

  const getRoleDetail = async (id) => {
    return axiosInstance
      .post(apiEndpoints.get_detail_role_template, {
         outputtype: 'RawJson' ,id})
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };
  const getDepartmentListGroup = async (id) => {
    return axiosInstance
      .post(apiEndpoints.get_all_group, {
         outputtype: 'RawJson'})
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list: news, view } = response.data;
          return news;
        } else return {};
      });
  };
  const getRoletemplateByDept = async (department_code) => {
    return axiosInstance
      .post(apiEndpoints.get_all_role_template_by_department_code, {
         outputtype: 'RawJson',
        department_code: department_code})
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
          return list;
        } else return {};
      });
  };


  const createRole = async (role) => {
    return axiosInstance.post(apiEndpoints.create_role_template, role).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const syncRole = async () => {
    return axiosInstance.post(apiEndpoints.sync_group_for_department, {
      outputtype: 'RawJson',
    }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const addAccountToGroup = async (group_name, account_id) => {
    return axiosInstance.post(apiEndpoints.add_account_to_group,{
      outputtype: 'RawJson',
      group_name: group_name,
   
      account_id: account_id,
    }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const removeAccountToGroup = async (group_name, account_id, email_address) => {
    return axiosInstance.post(apiEndpoints.remove_account_to_group,{
      outputtype: 'RawJson',
      group_name: group_name,
      email_address: email_address,
  
      account_id: account_id,
    }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const activeRole = async ( role ) => {
    return axiosInstance
     .post(apiEndpoints.active_role_template,{
      outputtype: 'RawJson',
      ...role,

    }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const updateRole = async (account) => {
    return axiosInstance.post(apiEndpoints.update_account, account).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };

  return (
    <RoleContext.Provider
      value={{
        createRole,
        updateRole,
        activeRole,
        getRoleDetail,
        getDepartmentListGroup,
        addAccountToGroup,
        removeAccountToGroup,
        syncRole,
        getRoletemplateByDept,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
