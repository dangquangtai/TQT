import React, { createContext } from 'react';
import { TASK_CHANGE } from '../store/actions';
import axiosInstance from '../services/axios';
import { useDispatch } from 'react-redux';
import useView from '../hooks/useView';

const TaskContext = createContext({
  getDocuments: () => Promise.resolve(),
});

export const TaskProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { setView } = useView();

  const getDocuments = async (
    url = '',
    documentType = 'booking',
    project_id,
    folder_id,
    paginateOption = {}
  ) => {
    if (!url) return;
    const {
      page = 1,
      order_by = 'title',
      order_type = 'desc',
      no_item_per_page = 10,
      category_id = '',
      search_text = '',
      from_date = '',
      to_date = '',
      department_code ='',
      role_template_code ='',
      process_role_code = '',
      university_id = '',
      status = '',
      career = ''
    } = paginateOption;
    axiosInstance
      .post(url, {
        page,
        no_item_per_page,
        order_by,
        order_type,
        category_id,
        search_text,
        folder_id,
        project_id,
        from_date,
        to_date,
        university_id,
        department_code,
        role_template_code,
        status,
        career,
        process_role_code,
        outputtype: 'RawJson',
      })
      .then((res) => {
        const result = res.data;
        if (result.return === 200) {
          const { list: documents, total_item, total_page, view } = result;
          dispatch({
            type: TASK_CHANGE,
            documentType,
            documents,
            total_item,
            total_page,
            page,
            order_by,
            order_type,
            no_item_per_page,
            category_id,
            search_text,
            folder_id,
            project_id,
            department_code,
            role_template_code,
            process_role_code,
          });

          setView({ ...view, action: 'list' });
        }
      });
  };

  return (
    <TaskContext.Provider
      value={{
        getDocuments,
        reloadDocuments: getDocuments,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
