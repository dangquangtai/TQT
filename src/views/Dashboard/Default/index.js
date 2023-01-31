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
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
