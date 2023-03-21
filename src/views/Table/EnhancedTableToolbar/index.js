import {
  Button,
  Checkbox,
  Grid,
  Tooltip,
  ClickAwayListener,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  TextField,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { gridSpacing } from '../../../store/constant';
import useToolbarStyles from './classes';
import { headCells } from '../data';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    categories,
    numSelected,
    handleShowColumn,
    handleFilterChange,
    displayOptions,
    data,
    btnCreateNewAccount,
    createNewAccount,
    btnCreateNewDept,
    createNewDept,
    buttonDeptUpdate,
    buttonDeptAddUser,
    roletemplateList,
    buttonCreateRole,
    createNewRole,
    buttonSyncDepartment,
    handleSyncRole,
    department_code_selected,
    handleAssignAccount,
    handleUpdateDepartment,
    setSelectedRoleTemplate,
    buttonCreateProcessRole,
    buttonUpdateProcessRole,
    createNewProcessRole,
    handleClickProcessRoleDetail,
    handleClickUpdateUserProcessRole,
    handleClickUpdateDeptProcessRole,
    userList,
    buttonAddDeptRole,
    buttonAddAccountRole,
    buttonSyncRole,
    handleSyncProcessRole,
    handleDeactiveDepartment,
    buttondeactiveDepartment,
    handleCreate,
    buttonCreateMaterialCategory,
    buttonCreateSupplierCategory,
    buttonCreateProductCategory,
    buttonCreateCustomerCategory,
    buttonCreateOrder,
    buttonCreateWorkorder,
    createWorkorder,
    buttonCreateCustomer,
    buttonCreateSupplier,
    buttonCreateWarehouseCategory,
    buttonCreateInventoryCheck,
    buttonCreatePurchaseMaterial,
    buttonCreateReceivedMaterial,
    buttonCreateMaterialWarehouse,
    buttonCreateWorkshop,
    buttonCreateProductWarehouse,
    buttonCreateGoodsIssue,
    buttonCreateGoodsReceipt,
    buttonCreateDailyMaterial,
    buttonCreateMaterialPart,
    buttonCreateMaterialRequisition,
    buttonExportMaterial,
    handleExportMaterial,
    buttonCreateUGroup,
    buttonCreateReturnMaterial,
    buttonCreateTemplateDocument,
    buttonCreateProduct,
    buttonExportMaterialInventory,
    buttonExportMaterialInventory2,
    handleExportMaterialInventory2,
    handleExportMaterialInventory,
  } = props;

  const filterRef = useRef(null);
  // useOnClickOutSide(filterRef, () => {
  //   setIsOpenFilter(false);
  // });

  const [columnNames, setColumnNames] = React.useState();
  const [isOpenSearch, setIsOpenSearch] = React.useState(false);
  const [isOpenShowColumn, setIsOpenShowColumn] = React.useState(false);
  const [isOpenFilter, setIsOpenFilter] = React.useState(false);
  const [filter, setFilter] = React.useState({
    category_id: '',
    search_text: '',
    department_code: '',
    role_template_code: 'Member',
  });
  const handleCloseInput = () => {
    setFilter({ ...filter, search_text: '' });
    handleFilterChange({ ...filter, search_text: '' });
  };

  const handleChangeSearch = (e) => {
    setFilter({ ...filter, search_text: e.target.value });
  };

  const handleEnterSearch = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      handleFilterChange(filter);
    }
  };

  const handleSubmitAssign = () => {
    user.forEach((element) => {
      handleAssignAccount(element);
    });
    setUserSelected([]);
  };
  const [user, setUserSelected] = useState([]);

  const handleResetFilter = () => {
    setFilter((pre) => ({
      ...pre,
      category_id: '',
      status: '',
    }));
    handleFilterChange({
      ...filter,
      category_id: '',
      status: '',
    });
  };

  const handleChangeColumnName = (index, id) => {
    const newColumnNames = JSON.parse(JSON.stringify(columnNames));
    const newState = !newColumnNames[index].isSelected;
    newColumnNames[index].isSelected = newState;
    handleShowColumn(id, newState);
    setColumnNames((pre) => newColumnNames);
  };

  const handleChangeFilter = (event) => {
    setSelectedRoleTemplate(event.target.value);

    const newFilter = {
      ...filter,
      [event.target.name]: event.target.value,
      department_code: department_code_selected,
    };
    setFilter(newFilter);
    handleFilterChange(newFilter);
  };

  const handleRefresh = () => {
    handleFilterChange({
      university_id: '',
      status: '',
      search_text: '',
    });
    setFilter({
      university_id: '',
      status: '',
      search_text: '',
    });
  };
  const { documentType } = useSelector((state) => state.document);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    setFilter({
      university_id: '',
      status: '',
      search_text: '',
      role_template_code: 'Member',
    });
  }, [selectedFolder]);
  useEffect(() => {
    if (data.length) {
      const keysData = Object.keys(data[0]);
      const newColumnNames = headCells.reduce((pre, { id, label }) => {
        if (keysData.includes(id)) {
          return [...pre, { id, label, isSelected: displayOptions[id] }];
        } else return pre;
      }, []);
      setColumnNames(newColumnNames);
      return;
    }
    setColumnNames(
      headCells.reduce((pre, { id, label }) => {
        return id !== 'menuButtons' && displayOptions[id] ? [...pre, { id, label, isSelected: displayOptions[id] }] : pre;
      }, [])
    );
  }, [displayOptions, data]);

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Grid container justifyContent="flex-end" spacing={gridSpacing}>
        <Grid
          item
          lg={documentType === 'department' || documentType === 'processrole' ? 12 : 4}
          md={documentType === 'department' || documentType === 'processrole' ? 12 : 4}
          xs={12}
          className={classes.toolSearchWrap}
        >
          <Grid container spacing={gridSpacing}>
            <Grid item xs={documentType === 'processrole' || documentType === 'department' ? 4 : 12}>
              <Grid container justifyContent="flex-start" spacing={gridSpacing}>
                {btnCreateNewAccount && documentType !== 'accountpermission' && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={createNewAccount}>
                      {btnCreateNewAccount.text}
                    </Button>
                  </Grid>
                )}
                {btnCreateNewDept && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={createNewDept}>
                      {btnCreateNewDept.text}
                    </Button>
                  </Grid>
                )}
                {buttonDeptUpdate && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleUpdateDepartment}>
                      {buttonDeptUpdate.text}
                    </Button>
                  </Grid>
                )}
                {buttondeactiveDepartment && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleDeactiveDepartment}>
                      {buttondeactiveDepartment.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateUGroup && documentType !== 'usergroupmenuitem' && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateUGroup.text}
                    </Button>
                  </Grid>
                )}

                {buttonCreateRole && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={createNewRole}>
                      {buttonCreateRole.text}
                    </Button>
                  </Grid>
                )}

                {buttonSyncDepartment && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleSyncRole}>
                      {buttonSyncDepartment.text}
                    </Button>
                  </Grid>
                )}

                {buttonCreateProcessRole && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={createNewProcessRole}>
                      {buttonCreateProcessRole.text}
                    </Button>
                  </Grid>
                )}

                {buttonUpdateProcessRole && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleClickProcessRoleDetail}>
                      {buttonUpdateProcessRole.text}
                    </Button>
                  </Grid>
                )}

                {buttonSyncRole && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleSyncProcessRole}>
                      {buttonSyncRole.text}
                    </Button>
                  </Grid>
                )}

                {buttonCreateMaterialCategory && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateMaterialCategory.text}
                    </Button>
                  </Grid>
                )}

                {buttonCreateSupplierCategory && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateSupplierCategory.text}
                    </Button>
                  </Grid>
                )}

                {buttonCreateProductCategory && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateProductCategory.text}
                    </Button>
                  </Grid>
                )}

                {buttonCreateCustomerCategory && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateCustomerCategory.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateOrder && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateOrder.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateWorkorder && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={createWorkorder}>
                      {buttonCreateWorkorder.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateCustomer && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateCustomer.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateSupplier && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateSupplier.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateWarehouseCategory && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateWarehouseCategory.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateInventoryCheck && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateInventoryCheck.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreatePurchaseMaterial && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreatePurchaseMaterial.text}
                    </Button>
                  </Grid>
                )}
                {buttonExportMaterial && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleExportMaterial}>
                      {buttonExportMaterial.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateReceivedMaterial && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateReceivedMaterial.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateMaterialWarehouse && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateMaterialWarehouse.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateWorkshop && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateWorkshop.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateProductWarehouse && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateProductWarehouse.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateGoodsIssue && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateGoodsIssue.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateGoodsReceipt && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateGoodsReceipt.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateDailyMaterial && (
                  <Grid item xs={6}>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateDailyMaterial.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateMaterialPart && (
                  <Grid item xs={6}>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateMaterialPart.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateMaterialRequisition && (
                  <Grid item xs={6}>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateMaterialRequisition.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateProduct && (
                  <Grid item xs={6}>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateProduct.text}
                    </Button>
                  </Grid>
                )}

                {buttonCreateReturnMaterial && (
                  <Grid item xs={6}>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateReturnMaterial.text}
                    </Button>
                  </Grid>
                )}
                {buttonCreateTemplateDocument && (
                  <Grid item xs={6}>
                    <Button variant="contained" color={'primary'} onClick={handleCreate}>
                      {buttonCreateTemplateDocument.text}
                    </Button>
                  </Grid>
                )}
                {buttonExportMaterialInventory && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleExportMaterialInventory}>
                      {buttonExportMaterialInventory.text}
                    </Button>
                  </Grid>
                )}
                {buttonExportMaterialInventory2 && (
                  <Grid item>
                    <Button variant="contained" color={'primary'} onClick={handleExportMaterialInventory2}>
                      {buttonExportMaterialInventory2.text}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {documentType === 'processrole' && (
              <Grid item xs={8}>
                <Grid container justifyContent="flex-start" spacing={gridSpacing}>
                  {buttonAddDeptRole && (
                    <Grid item xs={6}>
                      <Button variant="contained" color={'primary'} onClick={() => handleClickUpdateDeptProcessRole()}>
                        {buttonAddDeptRole.text}
                      </Button>
                    </Grid>
                  )}
                  {buttonAddAccountRole && (
                    <Grid item xs={6}>
                      <Button variant="contained" color={'primary'} onClick={() => handleClickUpdateUserProcessRole()}>
                        {buttonAddAccountRole.text}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
            {documentType === 'department' && (
              <Grid item xs={8}>
                <Grid container justifyContent="flex-start" spacing={gridSpacing}>
                  {buttonDeptAddUser && (
                    <>
                      <Grid item xs={10}>
                        <Autocomplete
                          size="small"
                          fullWidth
                          multiple
                          value={user}
                          options={userList}
                          onChange={(e, u) => setUserSelected(u)}
                          getOptionLabel={(option) => option.email_address}
                          renderInput={(params) => <TextField label="Tài khoản" {...params} variant="outlined" />}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button variant="contained" color={'primary'} onClick={handleSubmitAssign}>
                          {buttonDeptAddUser.text}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        {documentType !== 'department' && documentType !== 'processrole' && (
          <Grid item lg={2} md={6} xs={12} className={classes.toolSearchWrap}>
            {numSelected > 0 && (
              <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                {numSelected} bản ghi được chọn
              </Typography>
            )}
          </Grid>
        )}
        {documentType !== 'processrole' && documentType !== 'department' && (
          <Grid item lg={6} md={6} xs={12} className={classes.toolSearchWrap} alignContent="flex-start">
            <Grid container spacing={gridSpacing}>
              <>
                <div className={classes.toolSearchWrap}>
                  <SearchIcon />
                  <input
                    className={classes.toolSearchInput}
                    value={filter.search_text}
                    onChange={handleChangeSearch}
                    onKeyUp={handleEnterSearch}
                  />
                  <Button className={classes.toolButtonSearch} onClick={handleCloseInput}>
                    <ClearIcon className={classes.toolButtonIcon} />
                  </Button>
                </div>
                <ClickAwayListener onClickAway={() => setIsOpenShowColumn(false)}>
                  <div className={classes.toolButtonWrap}>
                    <Tooltip title="View Columns">
                      <Button
                        className={`${classes.toolButton} ${isOpenShowColumn ? classes.toolButtonActive : ''}`}
                        onClick={() => setIsOpenShowColumn(!isOpenShowColumn)}
                      >
                        <ViewColumnIcon className={classes.toolButtonIcon} />
                      </Button>
                    </Tooltip>

                    {isOpenShowColumn && (
                      <div className={classes.toolColumn}>
                        <div className={classes.toolColumnTitle}>
                          <div>Show Columns</div>
                          <Button className={classes.toolButtonSearch} onClick={() => setIsOpenShowColumn(false)}>
                            <ClearIcon className={classes.toolButtonIcon} />
                          </Button>
                        </div>
                        <div className={classes.toolColumnBody}>
                          {columnNames.map((columnName, index) => (
                            <div key={columnName.id} className={classes.toolColumnNameWrap}>
                              <Checkbox
                                checked={columnName.isSelected}
                                onChange={() => handleChangeColumnName(index, columnName.id)}
                                style={{ position: 'relative !important' }}
                              />
                              <span>{columnName.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ClickAwayListener>
                <div ref={filterRef} className={classes.toolButtonWrap}>
                  <Tooltip title="Filter Table">
                    <Button className={classes.toolButton} onClick={() => setIsOpenFilter(!isOpenFilter)}>
                      <FilterListIcon className={classes.toolButtonIcon} />
                    </Button>
                  </Tooltip>
                  {isOpenFilter && (
                    <div className={`${classes.toolColumn} ${classes.toolFilter}`}>
                      <div className={`${classes.toolColumnTitle} ${classes.toolFilterTitle}`}>
                        <div className={classes.toolFilterTitleBlock}>
                          <div>Filters</div>
                          <Button className={`${classes.toolButtonSearch} ${classes.toolResetButton}`} onClick={handleResetFilter}>
                            Reset
                          </Button>
                        </div>
                        <Button className={classes.toolButtonSearch} onClick={() => setIsOpenFilter(false)}>
                          <ClearIcon className={classes.toolButtonIcon} />
                        </Button>
                      </div>
                      <div className={`${classes.toolColumnBody} ${classes.toolFilterBody}`}>
                        <div className={classes.toolFilterItem}>
                          {categories && (
                            <FormControl fullWidth>
                              <InputLabel shrink id="category-label">
                                Danh mục
                              </InputLabel>
                              <Select
                                labelId="category-label"
                                id="category_id"
                                onChange={handleChangeFilter}
                                displayEmpty
                                name="category_id"
                                value={filter.category_id}
                                defaultValue={''}
                              >
                                <MenuItem value="">Tất cả</MenuItem>
                                {categories.map((item) => (
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.category_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Tooltip title="Refresh">
                  <Button className={`${classes.toolButton} ${isOpenSearch ? classes.toolButtonActive : ''}`} onClick={handleRefresh}>
                    <CachedIcon className={classes.toolButtonIcon} />
                  </Button>
                </Tooltip>
              </>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar;
