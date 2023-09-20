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
  TextField,
  Snackbar,
} from '@material-ui/core';
import { ImageOutlined as ImageIcon } from '@material-ui/icons';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../store/constant.js';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions.js';
import useAccount from '../../../hooks/useAccount.js';
import FirebaseUpload from '../../FloatingMenu/FirebaseUpload/index.js';
import { initAccount } from '../../../store/constants/initial.js';
import { getUserGroupList } from '../../../services/api/UserGroup/index';
import { Autocomplete } from '@material-ui/lab';
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

const AccountPermissionModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.user.detail.save);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const [permissionGroup, setPermissionGroup] = useState('');
  const [groupAccountList, setGroupAccountList] = useState([]);
  const { updatePermisstionGroup, getPermisstionGroup } = useAccount();
  const { accountDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });

  const [account, setAccount] = React.useState({
    ...initAccount,
  });
  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    if (!selectedDocument) return;
    setAccount({
      ...account,
      ...selectedDocument,
    });
    const fetch = async () => {
      let data = await getPermisstionGroup(selectedDocument.account_id);
      setPermissionGroup(data.data);
      setGroupAccountList(data.list);
    };
    fetch();
  }, [selectedDocument]);
  useEffect(() => {
    const fetch = async () => {
      let list = await getUserGroupList();
      setGroupList(list);
    };
    fetch();
  }, []);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    setAccount({
      ...initAccount,
    });
    dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: false });
  };
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });
  const handleOpenSnackbar = (isOpen, type, text) => {
    setSnackbarStatus({
      isOpen: isOpen,
      type: type,
      text: text,
    });
  };
  const handleUpdateAccount = async () => {
    try {
      let group_name_list = groupAccountList.map((item) => item.group_code);
      let check = await updatePermisstionGroup(account.id, permissionGroup.group_code, account.email_address, group_name_list);
      if (check) {
        handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'accountpermission' });
        handleCloseDialog();
      } else {
        handleOpenSnackbar(true, 'error', 'Cập nhập thành công!');
      }
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Vui lòng điền đầy đủ thông tin!');
    } finally {
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAccount({
      ...account,
      [e.target.name]: value,
    });
  };

  const setDocumentToDefault = async () => {
    setTabIndex(0);
  };
  const setURL = (image) => {
    setAccount({
      ...account,
      image_url: image,
    });
  };

  const handleOpenDiaLog = () => {
    setDialogUpload({ open: true, type: 'image' });
  };
  const handleCloseDiaLog = () => {
    setDialogUpload({ open: false, type: 'image' });
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
      <FirebaseUpload
        open={dialogUpload.open || false}
        onSuccess={setURL}
        onClose={handleCloseDiaLog}
        folder="AvatarAccount"
        type="image"
      />
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
              Thông tin người dùng
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
                        <AccountCircleOutlinedIcon className={`${tabIndex === 0 ? classes.tabActiveIcon : ''}`} />
                        Thông tin
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
                    <Grid item lg={6} md={6} xs={6}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <ImageIcon />
                            <span>Hình ảnh</span>
                          </div>
                        </div>
                        <div className={`${classes.tabItemBody} ${classes.tabItemMentorAvatarBody}`}>
                          <img src={account.image_url} alt="" />
                          {/* <div>
                            <div>Upload/Change Image</div>
                            <Button onClick={() => handleOpenDiaLog('image')}>Chọn hình </Button>
                          </div> */}
                        </div>
                        <Grid container className={classes.gridItemInfo} alignItems="center">
                          <Grid item lg={4} md={4} xs={4}>
                            <span className={classes.tabItemLabelField}>Mã nhân viên</span>
                          </Grid>
                          <Grid item lg={8} md={8} xs={8}>
                            <TextField
                              fullWidth
                              disabled
                              variant="outlined"
                              name="employee_code"
                              value={account.employee_code || ''}
                              className={classes.inputField}
                              onChange={handleChange}
                            />
                          </Grid>
                        </Grid>
                        <Grid container className={classes.gridItemInfo} alignItems="center">
                          <Grid item lg={4} md={4} xs={4}>
                            <span className={classes.tabItemLabelField}>Họ và tên</span>
                          </Grid>
                          <Grid item lg={8} md={8} xs={8}>
                            <TextField
                              fullWidth
                              disabled
                              variant="outlined"
                              name="full_name"
                              value={account.full_name || ''}
                              className={classes.inputField}
                              onChange={handleChange}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>

                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin cá nhân</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={12}>
                              <span className={classes.tabItemLabelField}>Nhóm phân quyền</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <Autocomplete
                                value={permissionGroup}
                                options={groupList}
                                getOptionLabel={(option) => option.group_code}
                                fullWidth
                                onChange={(e, value) => setPermissionGroup(value)}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={12}>
                              <span className={classes.tabItemLabelField}>Nhóm người dùng</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <Autocomplete
                                value={groupAccountList}
                                options={groupList}
                                getOptionLabel={(option) => option.group_code}
                                fullWidth
                                onChange={(e, value) => setGroupAccountList(value)}
                                multiple={true}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
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
              {!account.id && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateAccount()}>
                    {'Tạo mới'}
                  </Button>
                </Grid>
              )}
              {buttonSave && !!account.id && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateAccount()}>
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

export default AccountPermissionModal;
