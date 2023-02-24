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
} from '@material-ui/core';

import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions';
import Alert from '../../../component/Alert';
import useProcessRole from '../../../hooks/useProcessRole';
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

const ProcessRoleModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { form_buttons: formButtons } = useView();

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const { createProcessRole, updateProcessRole, getProcess, getApp } = useProcessRole();

  const [role, setRole] = React.useState({
    role_code: '',
    role_name: '',
    app_code: '',
    process_code: '',
    id: '',
    rank: 0,
  });
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });

  const [apps, setApp] = React.useState([]);
  const [processList, setProcess] = React.useState([]);
  useEffect(() => {
    if (!selectedDocument) return;
    setRole({
      ...selectedDocument,
    });
  }, [selectedDocument]);

  useEffect(() => {
    const fetchApp = async () => {
      let data = await getApp();
      setApp(data);
    };
    fetchApp();
  }, []);
  useEffect(() => {
    const fetchProcess = async () => {
      let data = await getProcess(role.app_code);
      setProcess(data);
    };
    fetchProcess();
  }, [role.app_code]);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    setRole({
      rank: 0,
      role_code: '',
      role_name: '',
      app_code: '',
      process_code: '',
      id: '',
    });

    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false });
  };

  const handleUpdateRole = async () => {
    try {
      if (role.id === '') {
        let check = await createProcessRole(role.role_code, role.role_name, role.process_code, role.app_code);
        console.log(check);
        if (check === true) {
          handleOpenSnackbar(true, 'success', 'Tạo mới thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'processrole' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'serror', 'Tạo mới thất bại!');
        }
      } else {
        let check = await updateProcessRole(role.role_code, role.role_name, role.process_code, role.app_code);

        if (check === true) {
          console.log(check);
          handleOpenSnackbar(true, 'success', 'Cập nhật thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'processrole' });
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
                            <span>Thông tin role</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>App: </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Select
                                labelId="department_type"
                                id="department_type"
                                value={role.app_code}
                                className={classes.multpleSelectField}
                                onChange={(event) => setRole({ ...role, app_code: event.target.value })}
                              >
                                <MenuItem value="">
                                  <em>Không chọn</em>
                                </MenuItem>
                                {apps &&
                                  apps.map((category) => (
                                    <MenuItem value={category.app_code} key={category.app_code}>
                                      {category.app_name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Process: </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Select
                                labelId="department_type"
                                id="department_type"
                                value={role.process_code}
                                className={classes.multpleSelectField}
                                onChange={(event) => setRole({ ...role, process_code: event.target.value })}
                              >
                                <MenuItem value="">
                                  <em>Không chọn</em>
                                </MenuItem>
                                {processList &&
                                  processList.map((category) => (
                                    <MenuItem value={category.id} key={category.id}>
                                      {category.value}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên chức vụ: </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                autoFocus
                                rows={1}
                                rowsMax={1}
                                margin="normal"
                                name="role_name"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                className={classes.inputField}
                                value={role.role_name || ''}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã: </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                autoFocus
                                rows={1}
                                rowsMax={1}
                                margin="normal"
                                name="role_code"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                className={classes.inputField}
                                value={role.role_code || ''}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Rank: </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                autoFocus
                                rows={1}
                                rowsMax={1}
                                margin="normal"
                                name="rank"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                className={classes.inputField}
                                value={role.rank || ''}
                              />
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
              {role.id === '' && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateRole()}>
                    {'Tạo mới'}
                  </Button>
                </Grid>
              )}
              {role.id !== '' && (
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

export default ProcessRoleModal;
