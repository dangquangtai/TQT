import {
  apiEndpoints,
  accountActions,
  departmentActions,
  roleActions,
  processroleActions,
  departmentDeactiveActions,
} from '../store/constant.js';

export function getUrlByAction(selectedFolder) {
  switch (selectedFolder ? selectedFolder.action : '') {
    case accountActions.list_active_user: {
      return apiEndpoints.get_all_active_account;
    }
    case accountActions.list_inactive_user: {
      return apiEndpoints.get_all_deactive_account;
    }
    case departmentActions.list_active_department: {
      return apiEndpoints.get_all_account_by_department_and_role_template;
    }
    case roleActions.list_active_role: {
      return apiEndpoints.get_all_active_role_template;
    }
    case roleActions.list_inactive_role: {
      return apiEndpoints.get_all_inactive_role_template;
    }
    case processroleActions.list_tree: {
      return apiEndpoints.get_account_list_by_process_role;
    }
    case departmentDeactiveActions.list_inactive_department: {
      return apiEndpoints.get_department_deactive_list;
    }
    default: {
      return '';
    }
  }
}
