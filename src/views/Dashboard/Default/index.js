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

          {availableMaterialPartEndpoint.includes(selectedFolder?.action) && <MaterialPartWrapper />}
          {availableProductEndpoint.includes(selectedFolder?.action) && <ProductWrapper />}
          {availableOrderEndpoint.includes(selectedFolder?.action) && <OrderWrapper />}
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
