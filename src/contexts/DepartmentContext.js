import React, { createContext } from 'react';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const DepartmentContext = createContext({});

export const DepartmentProvider = ({ children }) => {
  const { setView } = useView();

  const getDepartmentDetail = async (department_code) => {
    return axiosInstance
      .post(apiEndpoints.get_department_detail, {
        outputtype: 'RawJson',
        department_code,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };
  const getDepartmentList = async (department) => {
    return axiosInstance
      .post(apiEndpoints.get_department_list, {
        outputtype: 'RawJson',
        ...department,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };
  const getDepartmentTypeList = async (department) => {
    return axiosInstance
      .post(apiEndpoints.get_department_type_list, {
        outputtype: 'RawJson',
        ...department,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };
  const getDataTreeView = async () => {
    return axiosInstance
      .post(apiEndpoints.get_tree_view_data, {
        outputtype: 'RawJson',
      })

      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list: news } = response.data;
          return news;
        } else return {};
      });
  };

  const createDepartment = async (department) => {
    return axiosInstance.post(apiEndpoints.create_department, department).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const activeDepartment = async (department) => {
    return axiosInstance
      .post(apiEndpoints.deactive_department, {
        outputtype: 'RawJson',
        ...department,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };
  const updateDepartment = async (department) => {
    return axiosInstance.post(apiEndpoints.update_department, department).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };

  const getDeptListByProcessRole = async (process_role_code, page, no_item_per_page) => {
    return axiosInstance
      .post(apiEndpoints.get_dept_list_by_process_role, {
        outputtype: 'RawJson',
        page: page,
        process_role_code: process_role_code,
        no_item_per_page: no_item_per_page,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list: news } = response.data;
          return news;
        } else return {};
      });
  };
  const getAllDepartment = async (
    page = 1,
    no_item_per_page = 100,
    search_text = '',
    order_by = '',
    order_type = ''
  ) => {
    return axiosInstance
      .post(apiEndpoints.get_all_department_by_page, {
        outputtype: 'RawJson',
        page,
        no_item_per_page,
        search_text,
        order_by,
        order_type,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
          return list;
        } else return {};
      });
  };

  const getDepartmentRoleList = async (group_id) => {
    return axiosInstance
      .post(apiEndpoints.get_department_role_by_group, {
        outputtype: 'RawJson',
        group_id,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
          return list;
        } else return {};
      });
  };

  const getOptionalRoleList = async (department_type_code) => {
    return axiosInstance
      .post(apiEndpoints.get_option_role_template, {
        outputtype: 'RawJson',
        department_type_code: department_type_code,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
          return list;
        } else return {};
      });
  };

  return (
    <DepartmentContext.Provider
      value={{
        getDepartmentDetail,
        createDepartment,
        activeDepartment,
        updateDepartment,
        getDepartmentList,
        getDepartmentTypeList,
        getDataTreeView,
        getDeptListByProcessRole,
        getAllDepartment,
        getDepartmentRoleList,
        getOptionalRoleList,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentContext;
