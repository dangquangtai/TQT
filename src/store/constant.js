export const gridSpacing = 3;
export const drawerWidth = 320;
export const drawerWidthIcon = 120;
export const comanyCode = 'TQT';
export const defaultProcess = 'DEFAULT';
export const apiEndpoints = {
  authenticate: '/Primary/?FlowAlias=bs_api_user_authenticate&action=api',
  get_project_list: '/Primary/?FlowAlias=bs_menu_api_get_project_list&action=api',
  get_app_list: '/Primary/?FlowAlias=bs_menu_api_get_list_app&action=api',
  get_folders: '/Primary/?FlowAlias=bs_menu_api_get_menu_tree&action=api',
  get_metadata: '/Primary/?FlowAlias=bs_api_mym_get_meta_data&action=api',
  // Account
  get_all_active_account: '/Primary/?FlowAlias=bs_user_api_get_all_active_account_by_page&action=api',
  get_all_deactive_account: '/Primary/?FlowAlias=bs_user_api_get_all_deactive_account_by_page&action=api',
  get_account_detail: '/Primary/?FlowAlias=bs_api_user_get_account_by_id&action=api',
  create_account: '/Primary/?FlowAlias=bs_api_user_create_account_by_host&action=api',
  update_account: '/Primary/?FlowAlias=bs_api_user_update_account_by_id&action=api',
  get_all_account_by_department_and_role_template:
    '/Primary/?FlowAlias=bs_api_user_get_all_acount_by_departmentand_role_template&action=api',
  assign_account_to_dept: '/Primary/?FlowAlias=bs_api_user_api_assign_account_to_department&action=api',
  remove_account_from_dept: '/Primary/?FlowAlias=bs_api_user_api_remove_account_from_department&action=api',
  active_account: '/Primary/?FlowAlias=bs_api_user_active_account&action=api',
  get_account_list_by_process_role: '/Primary/?FlowAlias=bs_api_user_get_list_by_process_role&action=api',
  get_all_task: '/Primary/?FlowAlias=hnn_api_booking_get_all_task&action=api',
  get_all_department_by_page: '/Primary/?FlowAlias=bs_api_dept_get_all_active_department_by_page&action=api',
  get_department_role_by_group: '/Primary/?FlowAlias=bs_api_dept_get_department_role_by_group_id&action=api',
  get_all_account_list: '/Primary/?FlowAlias=bs_api_booking_user_get_all_account&action=api',

  //Role template
  get_all_active_role_template:
    '/Primary/?FlowAlias=bs_api_role_template_get_all_active_role_template_by_page&action=api',
  active_role_template: '/Primary/?FlowAlias=bs_api_role_template_active_role_template&action=api',
  get_detail_role_template: '/Primary/?FlowAlias=bs_api_role_template_get_detail_role_template&action=api',
  get_all_inactive_role_template:
    '/Primary/?FlowAlias=bs_api_role_template_get_all_inactive_role_template_by_page&action=api',
  create_role_template: '/Primary/?FlowAlias=bs_api_role_template_create_role_template&action=api',
  update_role_template: '/Primary/?FlowAlias=bs_api_role_template_create_role_template&action=api',
  get_role_tree_data: '/Primary/?FlowAlias=bs_api_process_role_get_tree_data_role&action=api',
  get_all_role_template_by_department_code:
    '/Primary/?FlowAlias=bs_api_dept_get_role_template_by_department_code&action=api',
  get_option_role_template: '/Primary/?FlowAlias=bs_api_role_template_get_optinal_role&action=api',
  add_account_to_group: '/Primary/?FlowAlias=bs_api_user_add_acount_to_group&action=api',
  remove_account_to_group: '/Primary/?FlowAlias=bs_api_user_remove_account_from_group&action=api',
  create_process_role: '/Primary/?FlowAlias=bs_api_process_create_role&action=api',
  update_process_role: '/Primary/?FlowAlias=bs_api_process_update_role&action=api',
  add_user_depart_to_process_role: '/Primary/?FlowAlias=bs_api_process_add_dept_user&action=api',
  remove_user_from_process_role: '/Primary/?FlowAlias=bs_api_process_remove_user&action=api',
  sync_process_role: '/Primary/?FlowAlias=bs_api_process_sync_role_department&action=api',
  remove_dept_from_process_role: '/Primary/?FlowAlias=bs_api_process_remove_dept&action=api',
  get_role_detail: '/Primary/?FlowAlias=bs_api_process_role_get_role_detail_by_role_code&action=api',
  get_process_list: '/Primary/?FlowAlias=bs_get_process_by_app_code&action=api',

  //Department
  sync_group_for_department: '/Primary/?FlowAlias=bs_api_role_template_sync_group_for_department&action=api',
  get_tree_view_data: '/Primary/?FlowAlias=bs_api_dept_get_tree_view_data&action=api',
  deactive_department: '/Primary/?FlowAlias=bs_api_dept_deactive_department&action=api',
  create_department: '/Primary/?FlowAlias=bs_api_dept_create_department&action=api',
  update_department: '/Primary/?FlowAlias=bs_api_dept_update_department&action=api',
  get_department_list: '/Primary/?FlowAlias=bs_api_dept_get_department_list&action=api',
  get_department_type_list: '/Primary/?FlowAlias=bs_api_dept_get_department_type_list&action=api',
  get_department_detail: '/Primary/?FlowAlias=bs_api_dept_get_detail_department_by_name&action=api',
  get_dept_list_by_process_role: '/Primary/?FlowAlias=bs_api_dept_get_list_by_process_code&action=api',
  get_department_deactive_list: '/Primary/?FlowAlias=bs_api_dept_get_all_inactive_department_by_page&action=api',

  //EChart
  get_line_chart_data: '/Primary/?FlowAlias=bs_api_get_line_chart_data&action=api',
  get_booking_data_by_career: '/Primary/?FlowAlias=bs_api_get_booking_data_by_career_for_chart&action=api',

  // Material Category
  get_material_category_list: '/Primary/?FlowAlias=bs_api_factory_get_list_material_category&action=api',
  get_material_category_detail: '/Primary/?FlowAlias=bs_api_factory_get_detail_material_category&action=api',
  create_material_category: '/Primary/?FlowAlias=bs_api_factory_create_material_category&action=api',
  update_material_category: '/Primary/?FlowAlias=bs_api_factory_update_material_category&action=api',
  active_material_category: '/Primary/?FlowAlias=bs_api_factory_active_material_category&action=api',

  // Supplier Category
  get_supplier_category_list: '/Primary/?FlowAlias=bs_api_factory_get_list_supplier_category&action=api',
  get_supplier_category_detail: '/Primary/?FlowAlias=bs_api_factory_get_detail_supplier_category&action=api',
  create_supplier_category: '/Primary/?FlowAlias=bs_api_factory_create_supplier_category&action=api',
  update_supplier_category: '/Primary/?FlowAlias=bs_api_factory_update_supplier_category&action=api',
  active_supplier_category: '/Primary/?FlowAlias=bs_api_factory_active_supplier_category&action=api',

  // Product Category
  get_product_category_list: '/Primary/?FlowAlias=bs_api_factory_get_list_product_category&action=api',
  get_product_category_detail: '/Primary/?FlowAlias=bs_api_factory_get_detail_product_category&action=api',
  create_product_category: '/Primary/?FlowAlias=bs_api_factory_create_product_category&action=api',
  update_product_category: '/Primary/?FlowAlias=bs_api_factory_update_product_category&action=api',
  active_product_category: '/Primary/?FlowAlias=bs_api_factory_active_product_category&action=api',

  // Customer Category
  get_customer_category_list: '/Primary/?FlowAlias=bs_api_factory_get_list_customer_category&action=api',
  get_customer_category_detail: '/Primary/?FlowAlias=bs_api_factory_get_detail_customer_category&action=api',
  create_customer_category: '/Primary/?FlowAlias=bs_api_factory_create_customer_category&action=api',
  update_customer_category: '/Primary/?FlowAlias=bs_api_factory_update_customer_category&action=api',
  active_customer_category: '/Primary/?FlowAlias=bs_api_factory_active_customer_category&action=api',

  // Material Part
  get_material_part_list: '/Primary/?FlowAlias=bs_api_factory_get_list_material_part&action=api',
  get_material_part_detail: '/Primary/?FlowAlias=bs_api_factory_get_detail_material_part&action=api',

  // Product
  get_product_list: '/Primary/?FlowAlias=bs_api_factory_get_list_product&action=api',
  get_product_detail: '/Primary/?FlowAlias=bs_api_factory_get_detail_product&action=api',

  get_product_requesr_list: '/Primary/?FlowAlias=bs_api_factory_workorder_get_list_by_page&action=api',
};
export const apiDomain = 'https://upload.truebpm.vn';
// export const apiDomain = 'http://localhost:4000'

export const roleActions = {
  list_active_role: comanyCode + '_ORGANISATION_' + defaultProcess + '_OPEN_ROLE_TEMPLATE_DEACTIVE_LIST',
  list_inactive_role: comanyCode + '_ORGANISATION_' + defaultProcess + '_OPEN_ROLE_TEMPLATE_ACTIVE_LIST',
};
export const processroleActions = {
  list_tree: comanyCode + '_ORGANISATION_' + defaultProcess + '_OPEN_ROLE_LIST',
};
export const accountActions = {
  list_active_user: comanyCode + '_ORGANISATION_' + defaultProcess + '_OPEN_ACTIVE_USER_LIST',
  list_inactive_user: comanyCode + '_ORGANISATION_' + defaultProcess + '_OPEN_USER_DEACTIVE_LIST',
};
export const departmentActions = {
  list_active_department: comanyCode + '_ORGANISATION_' + defaultProcess + '_OPEN_DEPARTMENT_ACTIVE_LIST',
};
export const departmentDeactiveActions = {
  list_inactive_department: comanyCode + '_ORGANISATION_' + defaultProcess + '_OPEN_DEPARTMENT_DEACTIVE_LIST',
};
export const materialCategoryActions = {
  list_material_category: 'TQT_SETTING_DEFAULT_OPEN_MATERIAL_CATEGORY_LIST',
};
export const supplierCategoryActions = {
  list_supplier_category: 'TQT_SETTING_DEFAULT_OPEN_SUPPLIER_CATEGORY_LIST',
};
export const productCategoryActions = {
  list_product_category: 'TQT_SETTING_DEFAULT_OPEN_PRODUCT_CATEGORY_LIST',
};
export const customerCategoryActions = {
  list_customer_category: 'TQT_SETTING_DEFAULT_OPEN_CUSTOMER_CATEGORY_LIST',
};
export const materialPartActions = {
  list_material_part: 'TQT_MATERIAL_DEFAULT_OPEN_MATERIAL_PART_LIST',
};
export const productActions = {
  list_product: 'TQT_PRODUCT_DEFAULT_OPEN_PRODUCT_LIST',
};
export const productrequestActions = {
  list_product: 'TQT_WORKORDER_DEFAULT_OPEN_WORKORDER_LIST',
};

export const tinyMCESecretKey = '7kiqm5c7crs3mdgf1lgiq973xn7kdxtf6ohasxhmkb2mpc45';
export const pageUrls = {
  dashboard: '/dashboard/default',
};
export const showRootFolder = false;

export const view = {
  floating: {},
  user: {
    list: {
      create: comanyCode + '_ORGANISATION_' + defaultProcess + '_CREATE_USER_MENU_BUTTON',
    },
    detail: {
      save: comanyCode + '_ORGANISATION_' + defaultProcess + '_UPDATE_USER_FORM_BUTTON',
    },
  },
  department: {
    list: {
      create: comanyCode + '_ORGANISATION_' + defaultProcess + '_CREATE_DEPARTMENT_MENU_BUTTON',
      update: comanyCode + '_ORGANISATION_' + defaultProcess + '_UPDATE_DEPARTMENT_MENU_BUTTON',
      adduser: comanyCode + '_ORGANISATION_' + defaultProcess + '_ADD_USER_DEPARTMENT_MENU_BUTTON',
      removeaccount: comanyCode + '_ORGANISATION_' + defaultProcess + '_REMOVE_ACCOUNT_MENU_BUTTON',
      syncDept: comanyCode + '_ORGANISATION_' + defaultProcess + '_SYNC_DEPARTMENT_MENU_BUTTON',
      deactive: comanyCode + '_ORGANISATION_' + defaultProcess + '_DEACTIVE_DEPARTMENT_MENU_BUTTON',
    },
    detail: {
      save: comanyCode + '_ORGANISATION_' + defaultProcess + '_CREATE_DEPARTMENT_FORM_BUTTON',
    },
  },
  role: {
    list: {
      create: comanyCode + '_ORGANISATION_' + defaultProcess + '_ROLE_TEMPLATE_CREATE_MENU_BUTTON',
    },
    detail: {},
  },
  processrole: {
    list: {
      create: comanyCode + '_ORGANISATION_' + defaultProcess + '_CREATE_NEW_PROCESS_ROLE_MENU_BUTTON',
      update: comanyCode + '_ORGANISATION_' + defaultProcess + '_UPDATE_PROCESS_ROLE_MENU_BUTTON',
      update_dept_role: comanyCode + '_ORGANISATION_' + defaultProcess + '_UPDATE_DEPARTMENT_ROLE_MENU_BUTTON',
      adduser: comanyCode + '_ORGANISATION_' + defaultProcess + '_ADD_ACCOUNT_ROLE_MENU_BUTTON',
      adddept: comanyCode + '_ORGANISATION_' + defaultProcess + '_ADD_DEPT_ROLE_MENU_BUTTON',
      removeaccount: comanyCode + '_ORGANISATION_' + defaultProcess + '_REMOVE_ACCOUNT_ROLE_MENU_BUTTON',
      removedept: comanyCode + '_ORGANISATION_' + defaultProcess + '_REMOVE_DEPT_ROLE_MENU_BUTTON',
      syncRole: comanyCode + '_ORGANISATION_' + defaultProcess + '_SYNC_DEPARTMENT_ROLE_MENU_BUTTON',
    },
  },
  materialCategory: {
    list: {
      create: 'TQT_SETTING_DEFAULT_MATERIAL_CATEGORY_LIST_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_MATERIAL_CATEGORY_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  supplierCategory: {
    list: {
      create: 'TQT_SETTING_DEFAULT_SUPPLIER_CATEGORY_LIST_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_SUPPLIER_CATEGORY_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  productCategory: {
    list: {
      create: 'TQT_SETTING_DEFAULT_PRODUCT_CATEGORY_LIST_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_PRODUCT_CATEGORY_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  customerCategory: {
    list: {
      create: 'TQT_SETTING_DEFAULT_CUSTOMER_CATEGORY_LIST_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_CUSTOMER_CATEGORY_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  workorder: {
    list: {
      create: 'TQT_WORKORDER_DEFAULT_CREATE_WORKORDER_MENU_BUTTON',
    },
    detail: {
      
    },
  },
};
