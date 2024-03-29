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
  customerActions,
  supplierActions,
  warehouseCategoryActions,
  materialInventoryActions,
  materialInventoryCheckActions,
  purchaseMaterialActions,
  receivedMaterialActions,
  materialWarehouseActions,
  workshopActions,
  productWarehouseActions,
  goodsIssueActions,
  goodsReceiptActions,
  productionActions,
  dailyDeliveryMateialActions,
  productInventoryActions,
  productionDailyMaterialReceivedActions,
  productionDailyMaterialRequisitionActions,
  materialRequisitionActions,
  usergroupAction,
  usergroupItemAction,
  accountPermissionAction,
  materialReturnActions,
  templateDocumentActions,
  MaterialReportActions,
  productInventoryCheckActions,
  ProductReportActions,
  ProductionReportActions,
  contractActions,
  productRequisitionActions,
  productContractActions,
  productReceivedActions,
  ContractReportActions,
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
      return apiEndpoints.get_work_order_list;
    }
    case productrequestActions.list_draft: {
      return apiEndpoints.get_work_order_draft_list;
    }
    case customerActions.list_customer: {
      return apiEndpoints.get_customer_list;
    }
    case supplierActions.list_supplier: {
      return apiEndpoints.get_supplier_list;
    }
    case warehouseCategoryActions.list_warehouse_category: {
      return apiEndpoints.get_warehouse_category_list;
    }
    case materialInventoryActions.list_material_inventory: {
      return apiEndpoints.get_material_inventory_list;
    }
    case materialInventoryCheckActions.list_material_inventory_check: {
      return apiEndpoints.get_material_inventory_check_list;
    }
    case purchaseMaterialActions.list_purchase_material: {
      return apiEndpoints.get_purchase_material_list;
    }
    case receivedMaterialActions.list_receive_material: {
      return apiEndpoints.get_received_material_list;
    }
    case materialWarehouseActions.list_warehouse: {
      return apiEndpoints.get_material_warehouse_list;
    }
    case workshopActions.list_workshop: {
      return apiEndpoints.get_workshop_list;
    }
    case productWarehouseActions.list_product_warehouse: {
      return apiEndpoints.get_product_warehouse_list;
    }
    case goodsIssueActions.list_goods_issue: {
      return apiEndpoints.get_goods_issue_list;
    }
    case goodsReceiptActions.list_goods_receipt: {
      return apiEndpoints.get_goods_receipt_list;
    }

    case productionActions.list_production_daily_request: {
      return apiEndpoints.get_production_daily_request_list;
    }
    case dailyDeliveryMateialActions.list_daily_Material: {
      return apiEndpoints.get_delivery_material_list;
    }
    case productInventoryActions.list_product_inventory: {
      return apiEndpoints.get_product_inventory_list;
    }
    case productionDailyMaterialReceivedActions.list_production_daily_material_received: {
      return apiEndpoints.get_production_daily_material_received_list;
    }
    case productionDailyMaterialRequisitionActions.list_production_daily_material_requisition: {
      return apiEndpoints.get_production_daily_material_requisition_list;
    }
    case materialRequisitionActions.list_material_requisition: {
      return apiEndpoints.get_material_requisition_list;
    }

    case usergroupAction.list: {
      return apiEndpoints.get_user_group_list_by_page;
    }
    case usergroupItemAction.list_role_item: {
      return apiEndpoints.get_user_group_project_list_by_page;
    }
    case usergroupItemAction.tree_view: {
      return apiEndpoints.get_menu_item_tree_view;
    }
    case accountPermissionAction.list: {
      return apiEndpoints.get_all_active_account;
    }
    case materialReturnActions.list_material_return: {
      return apiEndpoints.get_material_return_list;
    }
    case templateDocumentActions.list_template_document: {
      return apiEndpoints.get_document_template_list;
    }
    case MaterialReportActions.list_material_report: {
      return apiEndpoints.get_list_material_report;
    }
    case ProductReportActions.list_product_report: {
      return apiEndpoints.get_list_product_report;
    }
    case ProductionReportActions.list_production_report: {
      return apiEndpoints.get_list_production_report;
    }
    case ContractReportActions.list_contract_report: {
      return apiEndpoints.get_list_contract_report;
    }
    case productInventoryCheckActions.list_product_inventory_check: {
      return apiEndpoints.get_product_inventory_check_list;
    }
    case contractActions.list: {
      return apiEndpoints.get_contract_list;
    }
    case productRequisitionActions.list: {
      return apiEndpoints.get_product_requisition_list;
    }
    case productContractActions.list: {
      return apiEndpoints.get_product_contract_list;
    }
    case productReceivedActions.list: {
      return apiEndpoints.get_product_received_list;
    }
    default: {
      return '';
    }
  }
}
