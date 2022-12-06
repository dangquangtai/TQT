import {
  apiEndpoints,
  accountActions,
  departmentActions,
  roleActions,
  processroleActions,
  departmentDeactiveActions,
  materialCategoryActions,
  supplierCategoryActions,
  productCategoryActions,
  customerCategoryActions,
  materialPartActions,
  productActions,
  orderActions,
  productrequestActions,
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
    case materialCategoryActions.list_material_category: {
      return apiEndpoints.get_material_category_list;
    }
    case supplierCategoryActions.list_supplier_category: {
      return apiEndpoints.get_supplier_category_list;
    }
    case productCategoryActions.list_product_category: {
      return apiEndpoints.get_product_category_list;
    }
    case customerCategoryActions.list_customer_category: {
      return apiEndpoints.get_customer_category_list;
    }
    case materialPartActions.list_material_part: {
      return apiEndpoints.get_material_part_list;
    }
    case productActions.list_product: {
      return apiEndpoints.get_product_list;
    }
    case orderActions.list_pending_order: {
      return apiEndpoints.get_order_list;
    }
    case productrequestActions.list_product: {
      return apiEndpoints.get_product_requesr_list;
    }
    default: {
      return '';
    }
  }
}
