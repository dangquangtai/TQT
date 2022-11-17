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
} from './../../../store/constant';
import Summnary from './../Summary/index';
import { Redirect } from 'react-router-dom';
import ProcessRoleWrapper from '../../ProcessRole';
import DepartmentListWrapper from './../../DepartmentList/index';

const Default = () => {
  const { selectedFolder } = useSelector((state) => state.folder);
  const { selectedApp } = useSelector((state) => state.app);

  const availableAccountEndpoint = Object.values(accountActions);
  const availableDepartmentEndpoint = Object.values(departmentActions);
  const availableRoleEndpoint = Object.values(roleActions);
  const avaiableProcessRoleEndpoint = Object.values(processroleActions);
  const availableDepartmentDeactiveEndpoint = Object.values(departmentDeactiveActions);

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
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
