import React from 'react';
import { useSelector } from 'react-redux';
import { getUrlByAction } from './../../../utils/utils';
import AccountWrapper from '../../Account';
import DepartmentWrapper from '../../Department';
import RoleWrapper from '../../Role';
import { Grid } from '@material-ui/core';
import {
  gridSpacing,
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
} from './../../../store/constant';
import Summnary from './../Summary/index';
import { Redirect } from 'react-router-dom';
import ProcessRoleWrapper from '../../ProcessRole';
import DepartmentListWrapper from './../../DepartmentList/index';
import MaterialCategoryWrapper from './../../Setting/MaterialCategory/index';
import SupplierCategoryWrapper from './../../Setting/SupplierCategory';
import ProductCategoryWrapper from '../../Setting/ProductCategory';
import CustomerCategoryWrapper from './../../Setting/CustomerCategory';
import MaterialPartWrapper from './../../Material/MaterialPart/index';
import ProductWrapper from './../../Product/Product/index';
import OrderWrapper from './../../Order/index';
import WorkorderWrapper from './../../WORKORDER/index';
import CustomerWrapper from './../../Customer/index';
import SupplierWrapper from './../../Supplier/index';
import WarehouseCategoryWrapper from './../../Setting/WarehouseCategory/index';
import MaterialInventoryWrapper from './../../Material/Inventory/index';
import MaterialInventoryCheckWrapper from './../../Material/InventoryCheck/index';
import PurchaseMaterialWrapper from './../../Material/Purchase/index';
import ReceivedMaterialWrapper from './../../Material/Received/index';
import MaterialWarehouseWrapper from './../../Material/Warehouse/index';
import WorkshopWrapper from './../../Setting/Workshop/index';
import ProductWarehouseWrapper from './../../Product/Warehouse/index';
import GoodsIssueWrapper from './../../Product/GoodsIssue/index';
import GoodsReceiptWrapper from './../../Product/GoodsReceipt/index';
import ProductionWrapper from './../../Production/index';
import DeliveryMaterialWrapper from '../../Material/DailyMaterialRequisition';
import ProductInventoryWrapper from './../../Product/Inventory/index';
import DailyMaterialReceivedWrapper from './../../Production/DailyMaterialReceived/index';
import DailyMaterialRequisitionWrapper from './../../Production/DailyMaterialRequisition/index';
import MaterialRequisitionWrapper from './../../Material/Requisition/index';
import UserGroupWrapper from '../../UserGroup';
import UserGroupMenuItemWrapper from '../../UserGroupMenuItem';
import AccountPermissionWrapper from '../../AccountPermission';
import ReturnMaterialWrapper from './../../Material/Return/index';
import ExcelDocumentWrapper from '../../Setting/DocumentTemplate/ExcelDocument';
import MaterialReportWrapper from '../../Report';

const Default = () => {
  const { selectedFolder } = useSelector((state) => state.folder);
  const { selectedApp } = useSelector((state) => state.app);

  const availableAccountEndpoint = Object.values(accountActions);
  const availableDepartmentEndpoint = Object.values(departmentActions);
  const availableRoleEndpoint = Object.values(roleActions);
  const avaiableProcessRoleEndpoint = Object.values(processroleActions);
  const availableDepartmentDeactiveEndpoint = Object.values(departmentDeactiveActions);
  const availableMaterialCategoryEndpoint = Object.values(materialCategoryActions);
  const availableSupplierCategoryEndpoint = Object.values(supplierCategoryActions);
  const availableProductCategoryEndpoint = Object.values(productCategoryActions);
  const availableCustomerCategoryEndpoint = Object.values(customerCategoryActions);
  const availableMaterialPartEndpoint = Object.values(materialPartActions);
  const availableProductEndpoint = Object.values(productActions);
  const availableOrderEndpoint = Object.values(orderActions);
  const availableProductRequestEndpoint = Object.values(productrequestActions);
  const availableCustomerEndpoint = Object.values(customerActions);
  const availableSupplierEndpoint = Object.values(supplierActions);
  const availableWarehouseCategoryEndpoint = Object.values(warehouseCategoryActions);
  const availableMaterialInventoryEndpoint = Object.values(materialInventoryActions);
  const availableMaterialInventoryCheckEndpoint = Object.values(materialInventoryCheckActions);
  const availablePurchaseMaterialEndpoint = Object.values(purchaseMaterialActions);
  const availableReceivedMaterialEndpoint = Object.values(receivedMaterialActions);
  const availableWarehouseEndpoint = Object.values(materialWarehouseActions);
  const availableWorkshopEndpoint = Object.values(workshopActions);
  const availableProductWarehouseEndpoint = Object.values(productWarehouseActions);
  const availableGoodsIssueEndpoint = Object.values(goodsIssueActions);
  const availableGoodsReceiptEndpoint = Object.values(goodsReceiptActions);
  const availableProductionEndpoint = Object.values(productionActions);
  const availableProductInventoryEndpoint = Object.values(productInventoryActions);
  const availableProductionDailyMaterialReceivedEndpoint = Object.values(productionDailyMaterialReceivedActions);
  const availableProductionDailyMaterialRequisitionEndpoint = Object.values(productionDailyMaterialRequisitionActions);
  const availableDeliveryMaterialEndpoint = Object.values(dailyDeliveryMateialActions);
  const availableMaterialRequisitionEndpoint = Object.values(materialRequisitionActions);

  const availableUserGroupEndpoint = Object.values(usergroupAction);
  const availableUserGroupMenuItemEndpoint = Object.values(usergroupItemAction);
  const availableUserPermissionEndpoint = Object.values(accountPermissionAction);

  const availableMaterialReturnEndpoint = Object.values(materialReturnActions);
  const availableTemplateDocumentEndpoint = Object.values(templateDocumentActions);
  const availableMaterialReportEndpoint = Object.values(MaterialReportActions);

  if (!selectedApp?.id) {
    return <Redirect to="/dashboard/app" />;
  }

  return (
    <Grid container spacing={gridSpacing}>
      {!getUrlByAction(selectedFolder) && <Summnary />}
      {getUrlByAction(selectedFolder) && (
        <Grid item xs={12}>
          {availableAccountEndpoint.includes(selectedFolder?.action) && <AccountWrapper />}
          {availableDepartmentEndpoint.includes(selectedFolder?.action) && <DepartmentWrapper />}
          {availableRoleEndpoint.includes(selectedFolder?.action) && <RoleWrapper />}
          {avaiableProcessRoleEndpoint.includes(selectedFolder?.action) && <ProcessRoleWrapper />}
          {availableDepartmentDeactiveEndpoint.includes(selectedFolder?.action) && <DepartmentListWrapper />}
          {availableMaterialCategoryEndpoint.includes(selectedFolder?.action) && <MaterialCategoryWrapper />}
          {availableSupplierCategoryEndpoint.includes(selectedFolder?.action) && <SupplierCategoryWrapper />}
          {availableProductCategoryEndpoint.includes(selectedFolder?.action) && <ProductCategoryWrapper />}
          {availableCustomerCategoryEndpoint.includes(selectedFolder?.action) && <CustomerCategoryWrapper />}
          {availableWarehouseCategoryEndpoint.includes(selectedFolder?.action) && <WarehouseCategoryWrapper />}
          {availableMaterialPartEndpoint.includes(selectedFolder?.action) && <MaterialPartWrapper />}
          {availableProductEndpoint.includes(selectedFolder?.action) && <ProductWrapper />}
          {availableOrderEndpoint.includes(selectedFolder?.action) && <OrderWrapper />}
          {availableProductRequestEndpoint.includes(selectedFolder?.action) && <WorkorderWrapper />}
          {availableCustomerEndpoint.includes(selectedFolder?.action) && <CustomerWrapper />}
          {availableSupplierEndpoint.includes(selectedFolder?.action) && <SupplierWrapper />}
          {availableMaterialInventoryEndpoint.includes(selectedFolder?.action) && <MaterialInventoryWrapper />}
          {availableMaterialInventoryCheckEndpoint.includes(selectedFolder?.action) && <MaterialInventoryCheckWrapper />}
          {availablePurchaseMaterialEndpoint.includes(selectedFolder?.action) && <PurchaseMaterialWrapper />}
          {availableReceivedMaterialEndpoint.includes(selectedFolder?.action) && <ReceivedMaterialWrapper />}
          {availableWarehouseEndpoint.includes(selectedFolder?.action) && <MaterialWarehouseWrapper />}
          {availableWorkshopEndpoint.includes(selectedFolder?.action) && <WorkshopWrapper />}
          {availableProductWarehouseEndpoint.includes(selectedFolder?.action) && <ProductWarehouseWrapper />}
          {availableGoodsIssueEndpoint.includes(selectedFolder?.action) && <GoodsIssueWrapper />}
          {availableGoodsReceiptEndpoint.includes(selectedFolder?.action) && <GoodsReceiptWrapper />}
          {availableProductionEndpoint.includes(selectedFolder?.action) && <ProductionWrapper />}
          {availableDeliveryMaterialEndpoint.includes(selectedFolder?.action) && <DeliveryMaterialWrapper />}
          {availableProductInventoryEndpoint.includes(selectedFolder?.action) && <ProductInventoryWrapper />}
          {availableProductionDailyMaterialReceivedEndpoint.includes(selectedFolder?.action) && <DailyMaterialReceivedWrapper />}
          {availableProductionDailyMaterialRequisitionEndpoint.includes(selectedFolder?.action) && <DailyMaterialRequisitionWrapper />}
          {availableMaterialRequisitionEndpoint.includes(selectedFolder?.action) && <MaterialRequisitionWrapper />}
          {availableUserGroupEndpoint.includes(selectedFolder?.action) && <UserGroupWrapper />}
          {availableUserGroupMenuItemEndpoint.includes(selectedFolder?.action) && <UserGroupMenuItemWrapper />}
          {availableUserPermissionEndpoint.includes(selectedFolder?.action) && <AccountPermissionWrapper />}
          {availableMaterialReturnEndpoint.includes(selectedFolder?.action) && <ReturnMaterialWrapper />}
          {availableTemplateDocumentEndpoint.includes(selectedFolder?.action) && <ExcelDocumentWrapper />}
          {availableMaterialReportEndpoint.includes(selectedFolder?.action) && <MaterialReportWrapper />}
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
