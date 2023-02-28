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
  get_metadata: '/Primary/?FlowAlias=bs_api_tqt_get_meta_data&action=api',
  get_menu_item_tree_view: '/Primary/?FlowAlias=bs_api_ui_get_menu_item_tree_view_by_company_code&action=api',
  get_menu_item_lookup_tree_view: '/Primary/?FlowAlias=bs_api_ui_get_project_item_lookup_list_by_user_group&action=api',
  update_menu_item_update_lookup: '/Primary/?FlowAlias=bs_api_ui_update_menu_project_item_list_by_user_group&action=api',
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
  get_all_task: '/Primary/?FlowAlias=bs_api_process_get_all_task_by_current_user&action=api',
  get_all_department_by_page: '/Primary/?FlowAlias=bs_api_dept_get_all_active_department_by_page&action=api',
  get_department_role_by_group: '/Primary/?FlowAlias=bs_api_dept_get_department_role_by_group_id&action=api',
  get_all_account_list: '/Primary/?FlowAlias=bs_api_orgm_user_get_all_account&action=api',
  reset_password: '/Primary/?FlowAlias=bs_api_orgm_user_reset_password&action=api',
  //Role template
  get_all_active_role_template: '/Primary/?FlowAlias=bs_api_role_template_get_all_active_role_template_by_page&action=api',
  active_role_template: '/Primary/?FlowAlias=bs_api_role_template_active_role_template&action=api',
  get_detail_role_template: '/Primary/?FlowAlias=bs_api_role_template_get_detail_role_template&action=api',
  get_all_inactive_role_template: '/Primary/?FlowAlias=bs_api_role_template_get_all_inactive_role_template_by_page&action=api',
  create_role_template: '/Primary/?FlowAlias=bs_api_role_template_create_role_template&action=api',
  update_role_template: '/Primary/?FlowAlias=bs_api_role_template_create_role_template&action=api',
  get_role_tree_data: '/Primary/?FlowAlias=bs_api_process_role_get_tree_data_role&action=api',
  get_all_role_template_by_department_code: '/Primary/?FlowAlias=bs_api_dept_get_role_template_by_department_code&action=api',
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
  get_material_load_data: '/Primary/?FlowAlias=bs_api_factory_get_load_data_material_part&action=api',
  create_material_part: '/Primary/?FlowAlias=bs_api_factory_create_material_part&action=api',
  update_material_part: '/Primary/?FlowAlias=bs_api_factory_update_material_part&action=api',
  set_active_material_part: '/Primary/?FlowAlias=bs_api_factory_active_material_part&action=api',
  get_all_material_part: '/Primary/?FlowAlias=bs_api_factory_get_all_material_part&action=api',

  // Product
  get_product_list: '/Primary/?FlowAlias=bs_api_factory_get_list_product&action=api',
  get_product_detail: '/Primary/?FlowAlias=bs_api_factory_get_detail_product&action=api',
  get_all_product_list: '/Primary/?FlowAlias=bs_api_factory_get_all_product_list&action=api',
  update_product: '/Primary/?FlowAlias=bs_api_factory_update_product&action=api',

  // Order
  get_order_list: '/Primary/?FlowAlias=bs_api_order_get_order_list_by_page&action=api',
  get_order_detail: '/Primary/?FlowAlias=bs_api_order_get_order_request_detail_by_id&action=api',
  create_order: '/Primary/?FlowAlias=bs_api_order_create_new_order_request&action=api',
  update_order: '/Primary/?FlowAlias=bs_api_order_update_order_request&action=api',
  get_status_list: '/Primary/?FlowAlias=bs_api_order_get_order_status_list&action=api',
  delete_order_detail: '/Primary/?FlowAlias=bs_api_order_delete_order_detail&action=api',
  get_order_completed_list: '/Primary/?FlowAlias=bs_api_order_get_order_completed_list_by_company&action=api',
  get_order_by_status: '/Primary/?FlowAlias=bs_api_order_get_order_list_by_status&action=api',
  get_order_detail_list: '/Primary/?FlowAlias=bs_api_order_get_order_detail_list_by_order_id&action=api',
  // Customer
  get_all_customer: '/Primary/?FlowAlias=bs_api_customer_get_list_by_company&action=api',
  get_product_requesr_list: '/Primary/?FlowAlias=bs_api_factory_workorder_get_list_by_page&action=api',

  //Work Order
  get_work_order_status_list: '/Primary/?FlowAlias=bs_api_factory_get_work_order_status_list&action=api',
  get_work_order_list: '/Primary/?FlowAlias=bs_api_factory_workorder_get_list_by_page&action=api',
  get_work_order_draft_list: '/Primary/?FlowAlias=bs_api_factory_workorder_get_draft_list_by_page&action=api',
  create_work_order: '/Primary/?FlowAlias=bs_api_factory_create_production_request&action=api',
  get_work_order_detail: '/Primary/?FlowAlias=bs_api_factory_get_production_request&action=api',
  update_work_order: '/Primary/?FlowAlias=bs_api_factory_update_production_daily_request&action=api',
  check_daily_workorder_material_avaiability: '/Primary/?FlowAlias=bs_api_factory_check_daily_workorder_material_avaiability&action=api',
  get_material_inventory: '/Primary/?FlowAlias=bs_api_factory_get_material_inventory&action=api',
  create_material_requisition_request_daily: '/Primary/?FlowAlias=bs_api_factory_create_daily_request_requisition&action=api',
  get_material_requisition_daily_detail: '/Primary/?FlowAlias=bs_api_factory_get_material_daily_requisition_detail&action=api',
  get_part_list: '/Primary/?FlowAlias=bs_api_factory_get_part_list&action=api',
  get_link_download_workorder: '/Primary/?FlowAlias=bs_api_factory_get_link_export_workorder_daily&action=api',

  get_work_order_daiy_request: '/Primary/?FlowAlias=bs_api_factory_get_daily_request_by_id&action=api',
  remove_work_order_daiy_detail: '/Primary/?FlowAlias=bs_api_factory_remove_daily_detail_by_id&action=api',
  remove_work_order_daiy_request: '/Primary/?FlowAlias=bs_api_factory_remove_daily_request_by_id&action=api',
  create_work_order_daiy_detail: '/Primary/?FlowAlias=bs_api_factory_create_daily_detail&action=api',
  create_work_order_daiy_request: '/Primary/?FlowAlias=bs_api_factory_create_daily_request&action=api',
  get_daily_work_order_list: '/Primary/?FlowAlias=bs_api_factory_get_daily_request_list_by_id&action=api',
  remove_requistion_daily_detail: '/Primary/?FlowAlias=bs_api_factory_workorder_delete_requisition_daily_detail_by_id&action=api',
  check_material_daily_detail: '/Primary/?FlowAlias=bs_api_factory_workorder_check_material_daily_detail&action=api',
  generate_daily_material: '/Primary/?FlowAlias=bs_api_workorder_generate_material_daily_order&action=api',

  // Customer
  get_customer_list: '/Primary/?FlowAlias=bs_api_factory_get_customer_list&action=api',
  get_customer_detail: '/Primary/?FlowAlias=bs_api_factory_get_customer_detail&action=api',
  create_customer: '/Primary/?FlowAlias=bs_api_factory_create_customer&action=api',
  update_customer: '/Primary/?FlowAlias=bs_api_factory_update_customer&action=api',
  active_customer: '/Primary/?FlowAlias=bs_api_factory_active_customer&action=api',

  // Supplier
  get_supplier_list: '/Primary/?FlowAlias=bs_api_factory_get_supplier_list&action=api',
  get_supplier_detail: '/Primary/?FlowAlias=bs_api_factory_get_supplier_detail&action=api',
  create_supplier: '/Primary/?FlowAlias=bs_api_factory_create_supplier&action=api',
  update_supplier: '/Primary/?FlowAlias=bs_api_factory_update_supplier&action=api',
  active_supplier: '/Primary/?FlowAlias=bs_api_factory_active_supplier&action=api',
  get_order_by_work_order_id: '/Primary/?FlowAlias=bs_api_factory_get_order_detail_by_work_order_id&action=api',
  get_supplier_list_by_work_order: '/Primary/?FlowAlias=bs_api_factory_get_supplier_list_by_work_order_id&action=api',
  get_active_supplier_list: '/Primary/?FlowAlias=bs_api_factory_workorder_get_supplier_list_by_company_code&action=api',

  // Material Warehouse Category
  get_warehouse_category_list: '/Primary/?FlowAlias=bs_api_factory_get_material_warehouse_category_list&action=api',
  get_warehouse_category_detail: '/Primary/?FlowAlias=bs_api_factory_get_material_warehouse_category_detail&action=api',
  create_warehouse_category: '/Primar/?FlowAlias=bs_api_factory_create_material_warehouse_category&action=api',
  update_warehouse_category: '/Primary/?FlowAlias=bs_api_factory_update_material_warehouse_category&action=api',
  active_warehouse_category: '/Primary/?FlowAlias=bs_api_factory_active_material_warehouse_category&action=api',

  // Material Inventory
  get_material_inventory_list: '/Primary/?FlowAlias=bs_api_factory_get_material_inventory_list&action=api',
  get_material_inventory_detail: '/Primary/?FlowAlias=bs_api_factory_get_material_inventory_detail&action=api',
  update_material_inventory: '/Primary/?FlowAlias=bs_api_factory_update_material_inventory&action=api',
  export_material_inventory: '/Primary/?FlowAlias=bs_api_factory_export_material_inventory&action=api',

  // Material Inventory Check
  get_material_inventory_check_list: '/Primary/?FlowAlias=bs_api_factory_get_material_inventory_check_list&action=api',
  get_material_inventory_check_detail: '/Primary/?FlowAlias=bs_api_factory_get_material_inventory_check_detail&action=api',
  create_material_inventory_check: '/Primary/?FlowAlias=bs_api_factory_create_material_inventory_check&action=api',
  update_material_inventory_check: '/Primary/?FlowAlias=bs_api_factory_update_material_inventory_check&action=api',
  get_more_inventory_check: '/Primary/?FlowAlias=bs_api_factory_get_inventory_check_more&action=api',
  import_material_inventory_check: '/Primary/?FlowAlias=bs_api_factory_import_material_inventory_check&action=api',
  apply_material_inventory_check: '/Primary/?FlowAlias=bs_api_factory_apply_material_inventory_check&action=api',
  remove_material_inventory_check: '/Primary/?FlowAlias=bs_api_factory_remove_material_inventory_check&action=api',

  // Purchase Material
  get_purchase_material_list: '/Primary/?FlowAlias=bs_api_factory_get_purchase_material_list&action=api',
  get_purchase_material_detail: '/Primary/?FlowAlias=bs_api_factory_get_purchase_material_detail&action=api',
  create_purchase_material: '/Primary/?FlowAlias=bs_api_factory_create_purchase_material&action=api',
  update_purchase_material: '/Primary/?FlowAlias=bs_api_factory_update_purchase_material&action=api',
  get_purchase_material_status: '/Primary/?FlowAlias=bs_api_factory_get_purchase_material_status&action=api',
  get_purchase_material_by_status: '/Primary/?FlowAlias=bs_api_factory_get_purchase_material_by_status&action=api',
  get_purchase_material_detail_by_order_id: '/Primary/?FlowAlias=bs_api_factory_get_purchase_material_by_order_id&action=api',
  delete_purchase_material: '/Primary/?FlowAlias=bs_api_factory_delete_purchase_material&action=api',
  export_purchase_material: '/Primary/?FlowAlias=bs_api_factory_export_purchase_material&action=api',

  // Received Material
  get_received_material_list: '/Primary/?FlowAlias=bs_api_factory_get_received_material_list&action=api',
  get_received_material_detail: '/Primary/?FlowAlias=bs_api_factory_get_received_material_detail&action=api',
  create_received_material: '/Primary/?FlowAlias=bs_api_factory_create_received_material&action=api',
  update_received_material: '/Primary/?FlowAlias=bs_api_factory_update_received_material&action=api',
  get_received_material_status: '/Primary/?FlowAlias=bs_api_factory_get_received_material_status&action=api',
  delete_received_material: '/Primary/?FlowAlias=bs_api_factory_delete_received_material&action=api',
  export_material_received: '/Primary/?FlowAlias=bs_api_factory_export_production_material_received&action=api',
  get_material_order_list: '/Primary/?FlowAlias=bs_api_factory_get_material_order_list&action=api',

  get_workshop_list_by_company: '/Primary/?FlowAlias=bs_api_factory_workorder_get_workshop_by_company_code&action=api',
  get_productwhs_list_by_company: '/Primary/?FlowAlias=bs_api_factory_productwhs_get_productwhs_by_company_code&action=api',
  get_materialwhs_list_by_company: '/Primary/?FlowAlias=bs_api_factory_materialwhs_get_materialwhs_by_company_code&action=api',

  // Material Warehouse
  get_material_warehouse_list: '/Primary/?FlowAlias=bs_api_factory_get_material_warehouse_list&action=api',
  get_material_warehouse_detail: '/Primary/?FlowAlias=bs_api_factory_get_material_warehouse_detail&action=api',
  create_material_warehouse: '/Primary/?FlowAlias=bs_api_factory_create_material_warehouse&action=api',
  update_material_warehouse: '/Primary/?FlowAlias=bs_api_factory_update_material_warehouse&action=api',
  active_material_warehouse: '/Primary/?FlowAlias=bs_api_factory_active_material_warehouse&action=api',

  // Workshop
  get_workshop_list: '/Primary/?FlowAlias=bs_api_factory_get_workshop_list&action=api',
  get_workshop_detail: '/Primary/?FlowAlias=bs_api_factory_get_workshop_detail&action=api',
  create_workshop: '/Primary/?FlowAlias=bs_api_factory_create_workshop&action=api',
  update_workshop: '/Primary/?FlowAlias=bs_api_factory_update_workshop&action=api',
  active_workshop: '/Primary/?FlowAlias=bs_api_factory_active_workshop&action=api',

  // Product Warehouse
  get_product_warehouse_list: '/Primary/?FlowAlias=bs_api_factory_get_product_warehouse_list&action=api',
  get_product_warehouse_detail: '/Primary/?FlowAlias=bs_api_factory_get_product_warehouse_detail&action=api',
  create_product_warehouse: '/Primary/?FlowAlias=bs_api_factory_create_product_warehouse&action=api',
  update_product_warehouse: '/Primary/?FlowAlias=bs_api_factory_update_product_warehouse&action=api',
  active_product_warehouse: '/Primary/?FlowAlias=bs_api_factory_active_product_warehouse&action=api',

  // Goods Issue
  get_goods_issue_list: '/Primary/?FlowAlias=bs_api_factory_get_goods_issue_list&action=api',
  get_goods_issue_detail: '/Primary/?FlowAlias=bs_api_factory_get_goods_issue_detail&action=api',
  create_goods_issue: '/Primary/?FlowAlias=bs_api_factory_create_goods_issue&action=api',
  update_goods_issue: '/Primary/?FlowAlias=bs_api_factory_update_goods_issue&action=api',
  get_goods_issue_data: '/Primary/?FlowAlias=bs_api_factory_get_goods_issue_data&action=api',
  delete_goods_issue_detail: '/Primary/?FlowAlias=bs_api_factory_delete_goods_issue_detail&action=api',
  export_goods_issue_request: '/Primary/?FlowAlias=bs_api_factory_export_goods_issue_request_by_id&action=api',
  // Goods Receipt
  get_goods_receipt_list: '/Primary/?FlowAlias=bs_api_factory_get_goods_receipt_list&action=api',
  get_goods_receipt_detail: '/Primary/?FlowAlias=bs_api_factory_get_goods_receipt_detail&action=api',
  create_goods_receipt: '/Primary/?FlowAlias=bs_api_factory_create_goods_receipt&action=api',
  update_goods_receipt: '/Primary/?FlowAlias=bs_api_factory_update_goods_receipt&action=api',
  get_goods_receipt_data: '/Primary/?FlowAlias=bs_api_factory_get_goods_receipt_data&action=api',
  delete_goods_receipt_detail: '/Primary/?FlowAlias=bs_api_factory_delete_goods_receipt_detail&action=api',
  export_goods_receipt: '/Primary/?FlowAlias=bs_api_factory_export_goods_receipt&action=api',
  export_goods_receipt_by_daily_work_order: '/Primary/?FlowAlias=bs_api_factory_export_goods_receipt_by_daily_work_order_id&action=api',
  //Production
  get_production_daily_request_list: '/Primary/?FlowAlias=bs_api_workorder_get_production_daily_request_list&action=api',
  get_production_daily_reuqest_detial: '/Primary/?FlowAlias=bs_api_workorder_get_production_daily_request_detail_id&action=api',

  // daily delivery material
  get_delivery_material_list: '/Primary/?FlowAlias=bs_api_factory_get_list_daily_delivery_material&action=api',
  create_delivery_material: '/Primary/?FlowAlias=bs_api_factory_create_daily_delivery_material&action=api',
  update_delivery_material: '/Primary/?FlowAlias=bs_api_factory_update_daily_delivery_material&action=api',
  delete_delivery_material_detail: '/Primary/?FlowAlias=bs_api_factory_delete_material_daily_requisition_detail&action=api',
  get_detail_delivery_material: '/Primary/?FlowAlias=bs_api_factory_get_detail_material_daily_requisition&action=api',
  get_delivery_material_data: '/Primary/?FlowAlias=bs_api_factory_get_delivery_material_data&action=api',
  get_material_inventory_by_supplier: '/Primary/?FlowAlias=bs_api_factory_get_inventory_by_supplier&action=api',

  // Product Inventory
  get_product_inventory_list: '/Primary/?FlowAlias=bs_api_factory_get_product_inventory_list&action=api',
  get_product_inventory_detail: '/Primary/?FlowAlias=bs_api_factory_get_product_inventory_detail&action=api',

  // Production Daily Material Requisition
  get_production_daily_material_requisition_list:
    '/Primary/?FlowAlias=bs_api_factory_get_production_daily_material_requisition_list&action=api',
  get_production_daily_material_requisition_detail:
    '/Primary/?FlowAlias=bs_api_factory_get_production_daily_material_requisition_detail&action=api',
  update_production_daily_material_requisiton: '/Primary/?FlowAlias=bs_api_factory_update_production_daily_material_requisition&action=api',
  export_production_daily_material_requisition:
    '/Primary/?FlowAlias=bs_api_factory_export_production_daily_material_requisition&action=api',

  // Production Daily Material Received
  get_production_daily_material_received_list: '/Primary/?FlowAlias=bs_api_factory_get_production_daily_material_received_list&action=api',
  get_production_daily_material_received_detail:
    '/Primary/?FlowAlias=bs_api_factory_get_production_daily_material_received_detail&action=api',
  update_production_daily_material_received: '/Primary/?FlowAlias=bs_api_factory_update_production_daily_material_received&action=api',
  get_production_daily_material_received_data: '/Primary/?FlowAlias=bs_api_factory_get_production_daily_material_received_data&action=api',
  export_production_daily_material_received: '/Primary/?FlowAlias=bs_api_factory_export_production_daily_material_received&action=api',
  get_material_inventory_by_part_id: '/Primary/?FlowAlias=bs_api_factory_get_inventory_by_part_id&action=api',
  get_material_by_work_order: '/Primary/?FlowAlias=bs_api_factory_get_material_by_work_order&action=api',

  // Material Requisition
  get_material_requisition_list: '/Primary/?FlowAlias=bs_api_factory_get_material_requisition_list&action=api',
  create_material_requisition: '/Primary/?FlowAlias=bs_api_factory_create_material_requisition&action=api',
  update_material_requisition: '/Primary/?FlowAlias=bs_api_factory_update_material_requisition&action=api',

  //User Group
  get_user_group_list_by_page: '/Primary/?FlowAlias=bs_api_orgm_ugroup_get_user_group_list_by_page&action=api',
  get_user_group_detail: '/Primary/?FlowAlias=bs_api_orgm_ugroup_get_user_group_detail&action=api',
  update_user_group_detail: '/Primary/?FlowAlias=bs_api_orgm_ugroup_update_user_group&action=api',
  create_user_group_detail: '/Primary/?FlowAlias=bs_api_orgm_ugroup_create_user_group&action=api',
  update_user_group_account: '/Primary/?FlowAlias=bs_api_orgm_user_update_permistion_group&action=api',
  get_user_group_list: '/Primary/?FlowAlias=bs_api_orgm_ugroup_get_user_group_list_by_company&action=api',
  get_user_group_project_list_by_page: '/Primary/?FlowAlias=bs_api_orgm_get_user_group_project_list_by_page&action=api',
  get_user_group_list_by_account: '/Primary/?FlowAlias=bs_api_ugroup_get_ugroup_list_by_account_id&action=api',
  set_hidden_user_group: '/Primary/?FlowAlias=bs_api_ugroup_set_active_user_group_by_group_code&action=api',
  // Material Return
  get_material_return_list: '/Primary/?FlowAlias=bs_api_factory_get_material_return_list&action=api',
  get_material_return_detail: '/Primary/?FlowAlias=bs_api_factory_get_material_return_detail&action=api',
  create_material_return: '/Primary/?FlowAlias=bs_api_factory_create_material_return&action=api',
  update_material_return: '/Primary/?FlowAlias=bs_api_factory_update_material_return&action=api',
  get_material_return_data: '/Primary/?FlowAlias=bs_api_factory_get_material_return_data&action=api',
  get_material_broken_list: '/Primary/?FlowAlias=bs_api_factory_get_material_broken_list&action=api',
  export_material_return: '/Primary/?FlowAlias=bs_api_factory_export_material_return&action=api',

  // Document Template
  get_document_template_list: '/Primary/?FlowAlias=bs_api_process_get_document_template_list&action=api',
  get_document_template_detail: '/Primary/?FlowAlias=bs_api_process_get_document_template_detail&action=api',
  create_document_template: '/Primary/?FlowAlias=bs_api_process_create_new_document_template&action=api',
  update_document_template: '/Primary/?FlowAlias=bs_api_process_update_document_template&action=api',
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
export const usergroupAction = {
  list: `${comanyCode}_ORGANISATION_${defaultProcess}_OPEN_USER_GROUP_LIST`,
};
export const usergroupItemAction = {
  list_role_item: `${comanyCode}_ORGANISATION_${defaultProcess}_OPEN_MENU_ITEM_LIST`,
  tree_view: 'TQT_ORGANISATION_DEFAULT_OPEN_TREE_VIEW_PROJECT_VIEW',
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
export const orderActions = {
  list_pending_order: 'TQT_ORDER_DEFAULT_OPEN_ORDER_PENDING_LIST',
};
export const productrequestActions = {
  list_product: 'TQT_WORKORDER_DEFAULT_OPEN_WORKORDER_LIST',
  list_draft: 'TQT_WORKORDER_DEFAULT_OPEN_WORKORDER_DRAFT_LIST',
};
export const customerActions = {
  list_customer: 'TQT_PARTNER_DEFAULT_OPEN_CUSTOMER_LIST',
};
export const supplierActions = {
  list_supplier: 'TQT_PARTNER_DEFAULT_OPEN_SUPPLIER_LIST',
};
export const warehouseCategoryActions = {
  list_warehouse_category: 'TQT_MATERIAL_DEFAULT_OPEN_WAREHOUSE_CATEGORY_LIST',
};
export const materialWarehouseActions = {
  list_warehouse: 'TQT_SETTING_DEFAULT_OPEN_MATERIALWHS_LIST',
};
export const materialInventoryActions = {
  list_material_inventory: 'TQT_MATERIAL_DEFAULT_OPEN_INVENTORY_LIST',
};
export const materialInventoryCheckActions = {
  list_material_inventory_check: 'TQT_MATERIAL_DEFAULT_OPEN_MATERIAL_INVENTORY_CHECK',
};
export const purchaseMaterialActions = {
  list_purchase_material: 'TQT_MATERIAL_DEFAULT_OPEN_REQUISITION_REQUEST_LIST',
};
export const receivedMaterialActions = {
  list_receive_material: 'TQT_MATERIAL_DEFAULT_OPEN_RECEIVE_REQUEST_LIST',
};
export const workshopActions = {
  list_workshop: 'TQT_SETTING_DEFAULT_OPEN_WORKSHOP_LIST',
};
export const productWarehouseActions = {
  list_product_warehouse: 'TQT_SETTING_DEFAULT_OPEN_PRODUCT_WAREHOUSE_LIST',
};
export const goodsIssueActions = {
  list_goods_issue: 'TQT_PRODUCT_DEFAULT_OPEN_GOODS_ISSUE_LIST',
};
export const goodsReceiptActions = {
  list_goods_receipt: 'TQT_PRODUCT_DEFAULT_OPEN_GOODS_RECEIPT_LIST',
};
export const productionActions = {
  list_production_daily_request: 'TQT_PRODUCTION_DEFAULT_OPEN_PRODUCTION_DAILY_REQUEST_LIST',
};
export const dailyDeliveryMateialActions = {
  list_daily_Material: 'TQT_MATERIAL_DEFAULT_OPEN_MATERIAL_DAILY_REQUISITION_LIST',
};
export const productInventoryActions = {
  list_product_inventory: 'TQT_PRODUCT_DEFAULT_OPEN_INVENTORY_LIST',
};
export const productionDailyMaterialRequisitionActions = {
  list_production_daily_material_requisition: 'TQT_PRODUCTION_DEFAULT_OPEN_DAILY_MATERIAL_REQUISITION_LIST',
};
export const productionDailyMaterialReceivedActions = {
  list_production_daily_material_received: 'TQT_PRODUCTION_DEFAULT_OPEN_DAILY_MATERIAL_RECEIVED_LIST',
};
export const materialRequisitionActions = {
  list_material_requisition: 'TQT_MATERIAL_DEFAULT_OPEN_REQUISITION_NOT_WORKORDER_LIST',
};

export const accountPermissionAction = {
  list: 'TQT_ORGANISATION_DEFAULT_OPEN_USER_GROUP_PERMISSION_LIST',
};

export const materialReturnActions = {
  list_material_return: 'TQT_MATERIAL_DEFAULT_OPEN_MATERIAL_RETURN_LIST',
};
export const templateDocumentActions = {
  list_template_document: 'TQT_SETTING_DEFAULT_OPEN_DOCUMENT_LIST',
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
      reset_password: `${comanyCode}_ORGANISATION_${defaultProcess}_RESET_PASSWORD_FORM_BUTTON`,
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
  order: {
    list: {
      create: 'TQT_ORDER_DEFAULT_CREATE_NEW_ORDER_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_ORDER_DEFAULT_ORDER_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  workorder: {
    list: {
      create: 'TQT_WORKORDER_DEFAULT_CREATE_WORKORDER_MENU_BUTTON',
    },
    detail: {},
  },
  product: {
    list: {
      create: 'TQT_SETTING_DEFAULT_PRODUCT_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_PRODUCT_SAVE_FORM_BUTTON',
    },
  },
  customer: {
    list: {
      create: 'TQT_PARTNER_DEFAULT_CREATE_CUSTOMER_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_PARTNER_DEFAULT_CUSTOMER_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  supplier: {
    list: {
      create: 'TQT_PARTNER_DEFAULT_CREATE_SUPPLIER_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_PARTNER_DEFAULT_SUPPLIER_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  warehouseCategory: {
    list: {
      create: 'TQT_MATERIAL_DEFAULT_WAREHOUSE_CATEGORY_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_MATERIAL_DEFAULT_WAREHOUSE_CATEGORY_DETAIL_SAVE_FORM_BUTTON',
    },
  },
  warehouse: {
    list: {
      create: 'TQT_SETTING_DEFAULT_MATERIALWHS_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_MATERIALWHS_SAVE_FORM_BUTTON',
    },
  },
  materialInventoryCheck: {
    list: {
      create: 'TQT_MATERIAL_DEFAULT_MATERIAL_INVENTORY_CHECK_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_MATERIAL_DEFAULT_MATERIAL_INVENTORY_CHECK_SAVE_FORM_BUTTON',
      import: 'TQT_MATERIAL_DEFAULT_INVENTORY_CHECK_IMPORT_FORM_BUTTON',
      apply: 'TQT_MATERIAL_DEFAULT_INVENTORY_CHECK_APPLY_FORM_BUTTON',
      remove: 'TQT_MATERIAL_DEFAULT_INVENTORY_CHECK_REMOVE_FORM_BUTTON',
    },
  },
  purchaseMaterial: {
    list: {
      create: 'TQT_MATERIAL_DEFAULT_REQUISITION_CREATE_MENU_BUTTON',
      export: 'TQT_MATERIAL_DEFAULT_REQUISITION_EXPORT_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_MATERIAL_DEFAULT_REQUISITION_SAVE_FORM_BUTTON',
    },
  },
  receivedMaterial: {
    list: {
      create: 'TQT_MATERIAL_DEFAULT_RECEIVED_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_MATERIAL_DEFAULT_RECEIVED_SAVE_FORM_BUTTON',
      export: 'TQT_MATERIAL_DEFAULT_RECEIVED_EXPORT_MENU_BUTTON',
    },
  },
  workshop: {
    list: {
      create: 'TQT_SETTING_DEFAULT_WORKSHOP_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_WORKSHOP_SAVE_FORM_BUTTON',
    },
  },
  productWarehouse: {
    list: {
      create: 'TQT_SETTING_DEFAULT_PRODUCT_WAREHOUSE_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_PRODUCT_WAREHOUSE_SAVE_FORM_BUTTON',
    },
  },
  goodsIssue: {
    list: {
      create: 'TQT_PRODUCT_DEFAULT_GOODS_ISSUE_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_PRODUCT_DEFAULT_GOODS_ISSUE_SAVE_FORM_BUTTON',
    },
  },
  goodsReceipt: {
    list: {
      create: 'TQT_PRODUCT_DEFAULT_GOODS_RECEIPT_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_PRODUCT_DEFAULT_GOODS_RECEIPT_SAVE_FORM_BUTTON',
    },
  },
  dailyDeliveryMateial: {
    list: {
      create: 'TQT_MATERIAL_DEFAULT_DAILY_REQUISITION_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_MATERIAL_DEFAULT_DAILY_REQUISITION_SAVE_FORM_BUTTON',
    },
  },
  productionDailyMaterialRequisition: {
    detail: {
      save: 'TQT_PRODUCTION_DEFAULT_DAILY_MATERIAL_REQUISITION_SAVE_FORM_BUTTON',
    },
  },
  productionDailyMaterialReceived: {
    detail: {
      save: 'TQT_PRODUCTION_DEFAULT_DAILY_MATERIAL_RECEIVED_SAVE_FORM_BUTTON',
    },
  },
  materialPart: {
    list: {
      create: 'TQT_SETTING_DEFAULT_MATERIAL_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_MATERIAL_SAVE_FORM_BUTTON',
    },
  },
  materialRequisition: {
    list: {
      create: 'TQT_MATERIAL_DEFAULT_REQUISITION_NOT_WORKORDER_CREATE_MENU_BUTTON',
    },
  },

  ugroup: {
    list: {
      create: 'TQT_ORGANISATION_DEFAULT_CREATE_USER_GROUP_MENU_BUTTON',
    },
  },

  materialReturn: {
    list: {
      create: 'TQT_MATERIAL_DEFAULT_RETURN_CREATE_MENU_BUTTON',
    },
    detail: {
      save: 'TQT_MATERIAL_DEFAULT_RETURN_SAVE_FORM_BUTTON',
    },
  },
  templateDocument: {
    list: {
      create: 'TQT_SETTING_DEFAULT_CREATE_EXCEL_DOCUMENT_TEMPLATE',
    },
    detail: {
      save: 'TQT_SETTING_DEFAULT_EXCEL_TEMPLATE_SAVE_FORM_BUTTON',
      import: 'TQT_SETTING_DEFAULT_EXCEL_TEMPLATE_IMPORT_FORM_BUTTON',
    },
  },
  materialInventory: {
    list: {
      export: 'TQT_MATERIAL_DEFAULT_MATERIAL_INVENTORY_EXPORT_MENU_BUTTON',
    },
  },
};
