import React, { createContext } from 'react';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const AccountContext = createContext({});

export const AccountProvider = ({ children }) => {
  const { setView } = useView();

  const getAccountDetail = async (id) => {
    return axiosInstance
      .post(apiEndpoints.get_account_detail, {
        outputtype: 'RawJson',
        id,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };
  const getAccount = async (id) => {
    return axiosInstance
      .post(apiEndpoints.get_account_detail, {
        outputtype: 'RawJson',
        id,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          return news;
        } else return {};
      });
  };
  const getAllTask = async () => {
    return axiosInstance
      .post(apiEndpoints.get_all_task, {
        outputtype: 'RawJson',
        company_id: null,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list: news, view } = response.data;
          // setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };
  const getAllUser = async () => {
    return axiosInstance
      .post(apiEndpoints.get_all_account_list, {
        outputtype: 'RawJson',
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
          return list;
        } else return [];
      });
  };
  const getAllUserByDept = async (department_code, role_template_code) => {
    return axiosInstance
      .post(apiEndpoints.get_all_account_by_department_and_role_template, {
        department_code: department_code,
        role_template_code: role_template_code,
        outputtype: 'RawJson',
        page: 1,
        no_item_per_page: 100,
        search_text: '',
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list, all_user } = response.data;
          return { list, all_user };
        } else return [];
      });
  };
  const createAccount = async (account) => {
    return axiosInstance.post(apiEndpoints.create_account, account).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const activeAccount = async (account) => {
    return axiosInstance
      .post(apiEndpoints.active_account, {
        outputtype: 'RawJson',
        ...account,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };
  const updateAccount = async (account) => {
    return axiosInstance
      .post(apiEndpoints.update_account, {
        ...account,
        outputtype: 'RawJson',
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };
  const assignAccount = async (account) => {
    return axiosInstance
      .post(apiEndpoints.assign_account_to_dept, {
        ...account,
        outputtype: 'RawJson',
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };
  const removeAccount = async (account) => {
    return axiosInstance
      .post(apiEndpoints.remove_account_from_dept, {
        ...account,
        outputtype: 'RawJson',
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };
  const updatePermisstionGroup = async (id, permission_group, email_address, group_name_list) => {
    return axiosInstance
      .post(apiEndpoints.update_user_group_account, {
        id: id,
        permission_group: permission_group,
        email_address: email_address,
        group_name_list: group_name_list,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };
  const getPermisstionGroup = async (account_id) => {
    return axiosInstance.post(apiEndpoints.get_user_group_list_by_account, { account_id: account_id }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data, list } = response.data;
        return { data, list };
      }
      return {};
    });
  };
  const resetPassword = async (new_password, password, email_address) => {
    return axiosInstance
      .post(apiEndpoints.reset_password, { email_address: email_address, new_password: new_password, password: password })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          return true;
        }
        return false;
      });
  };

  return (
    <AccountContext.Provider
      value={{
        getAccountDetail,
        createAccount,
        updateAccount,
        activeAccount,
        getAllTask,
        getAllUser,
        getAllUserByDept,
        assignAccount,
        removeAccount,
        getAccount,
        updatePermisstionGroup,
        getPermisstionGroup,
        resetPassword,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
