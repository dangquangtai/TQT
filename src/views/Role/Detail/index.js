import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Box,
  Typography,
  Tab,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  Checkbox,
} from '@material-ui/core';

import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../store/constant';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions';
import useDepartment from '../../../hooks/useDepartment';
import useRole from '../../../hooks/useRole';
import Alert from '../../../component/Alert';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RoleModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.department.detail.save);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { getDepartmentList, getDepartmentTypeList } = useDepartment();
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const { createRole } = useRole();
  const [role, setRole] = React.useState({
    apply_to_department_type: [],
    is_active: true,
    is_approval_role: true,
    is_visible_for_selection: true,
    role_template_code: '',
    role_template_id: '',
    role_template_name: '',
  });
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });
  const [categories, setCategory] = React.useState();
  const [departmentTypes, setDepartmentType] = React.useState();
  useEffect(() => {
    getDepartmentParent({
      parent_department_code: null,
    });
    if (!selectedDocument) return;
    setRole({
      ...selectedDocument,
    });
  }, [selectedDocument]);

  const getDepartmentParent = async (company_code, parent_department_code) => {
    try {
      let departmentData = await getDepartmentTypeList(company_code);
      setDepartmentType(departmentData);
      let categoriesData = await getDepartmentList(company_code, parent_department_code);
      setCategory(categoriesData);
    } catch {}
  };
  const handleCloseDialog = () => {
    setDocumentToDefault();
    setRole({
      apply_to_department_type: [],
      is_active: true,
      is_approval_role: true,
      is_visible_for_selection: true,
      role_template_code: '',
      role_template_id: '',
      role_template_name: '',
    });

    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false });
  };

  const handleUpdateRole = async () => {
    try {
      if (role.role_template_id === '') {
        let check = await createRole({
          ...role,
          outputtype: 'RawJson',
        });

        if (check) {
          handleOpenSnackbar(true, 'success', 'Tạo mới thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'role' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Tạo mới thất bại!');
        }
      } else {
        let check = await createRole({
          ...role,
          outputtype: 'RawJson',
        });

        if (check) {
          handleOpenSnackbar(true, 'success', 'Cập nhật thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'role' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Cập nhật thất bại!');
        }
      }
    } catch (error) {
      console.log('error update department', error);
    } finally {
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setRole({
      ...role,
      [e.target.name]: value,
    });
  };

  const setDocumentToDefault = async () => {
    setTabIndex(0);
  };
  const handleOpenSnackbar = (isOpen, type, text) => {
    setSnackbarStatus({
      isOpen: isOpen,
      type: type,
      text: text,
    });
  };

  return (
    <React.Fragment>
      {snackbarStatus.isOpen && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbarStatus.isOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })}
        >
          <Alert
            onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })}
            severity={snackbarStatus.type}
            sx={{ width: '100%' }}
          >
            {snackbarStatus.text}
          </Alert>
        </Snackbar>
      )}
      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          className={classes.useradddialog}
        >
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Chi tiết
            </Grid>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Tabs
                  value={tabIndex}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChangeTab}
                  aria-label="simple tabs example"
                  variant="scrollable"
                >
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        Nội dung
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin chức vụ</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên chức vụ</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                autoFocus
                                margin="normal"
                                name="role_template_name"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                className={classes.inputField}
                                value={role.role_template_name || ''}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã chức vụ</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                autoFocus
                                margin="normal"
                                name="role_template_code"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                className={classes.inputField}
                                value={role.role_template_code || ''}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Loại phòng ban</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Select
                                labelId="department_type"
                                id="department_type"
                                value={role.apply_to_department_type}
                                className={classes.multpleSelectField}
                                onChange={(event) => setRole({ ...role, apply_to_department_type: event.target.value })}
                                multiple={true}
                              >
                                <MenuItem value="">
                                  <em>Không chọn</em>
                                </MenuItem>
                                {departmentTypes &&
                                  departmentTypes.map((category) => (
                                    <MenuItem value={category.Key} key={category.Key}>
                                      {category.Value}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={6} md={6} xs={6}>
                              <Checkbox
                                checked={role.is_approval_role}
                                onChange={(event) => setRole({ ...role, is_approval_role: event.target.checked })}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                              Vai trò phê duyệt
                            </Grid>
                            <Grid item lg={6} md={6} xs={6}>
                              <Checkbox
                                checked={role.is_visible_for_selection}
                                onChange={(event) => setRole({ ...role, is_visible_for_selection: event.target.checked })}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                              Hiển thị trong danh sách chọn
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              {buttonSave && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateRole()}>
                    {buttonSave.text}
                  </Button>
                </Grid>
              )}
              {!buttonSave && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateRole()}>
                    Lưu
                  </Button>
                </Grid>
              )}
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default RoleModal;
