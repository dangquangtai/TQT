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
  Portal,
} from '@material-ui/core';
import { ImageOutlined as ImageIcon } from '@material-ui/icons';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Alert from '../../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FLOATING_MENU_CHANGE } from '../../../../store/actions.js';
import useStyles from '../../../../views/Account/Detail/classes';
import { DOCUMENT_CHANGE } from '../../../../store/actions.js';
import useAccount from '../../../../hooks/useAccount.js';
import FirebaseUpload from '../../../../views/FloatingMenu/FirebaseUpload/index';
import { initAccount } from '../../../../store/constants/initial.js';
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

const ProfileModal = (props) => {
  const { openDialog, setOpenDialog, selectedDocument } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { updateAccount, resetPassword, getAccount } = useAccount();

  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });
  const { provinces: provinceList, genders: genderList } = useSelector((state) => state.metadata);
  const [account, setAccount] = React.useState({
    ...initAccount,
    ...selectedDocument,
  });

  useEffect(() => {
    if (!selectedDocument) return;
    const fetch = async () => {
      if (openDialog) {
        let data = await getAccount(selectedDocument.id);
        setAccount({ ...account, ...selectedDocument, ...data });
      }
    };
    fetch();
  }, [openDialog]);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDocumentToDefault();
    setAccount({
      ...initAccount,
    });
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
      if (account.employee_code === '' || account.email_address === '' || account.full_name === '') {
        handleOpenSnackbar(true, 'error', 'Vui lòng điền đầy đủ thông tin!');
      } else {
        let check = await updateAccount({
          ...account,
          outputtype: 'RawJson',
        });
        if (check) {
          handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
          var user = JSON.parse(window.localStorage.getItem('user'));
          user.account = { ...user.account, avatar_url: account?.image_url, fullname: account?.full_name };
          localStorage.setItem('user', JSON.stringify(user));
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Tài khoản đã tồn tại!');
        }
      }
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Vui lòng điền đầy đủ thông tin!');
    } finally {
    }
  };
  const handleResetPasswordAccount = async () => {
    try {
      if (!account?.new_password || !account?.password || !account?.new_password_confirm) {
        handleOpenSnackbar(true, 'error', 'Vui lòng điền đầy đủ thông tin!');
      } else {
        if (account.new_password != account?.new_password_confirm) {
          handleOpenSnackbar(true, 'error', 'Mật khẩu mới không đúng!');
        } else {
          let check = await resetPassword(account?.new_password, account?.password, account?.email_address);
          if (check) {
            handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
            handleCloseDiaLog();
          } else {
            handleOpenSnackbar(true, 'error', 'Cập nhật mật khẩu không thành công!');
          }
        }
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
      image_url: image.url,
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
        <Portal>
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
        </Portal>
      )}
      <Portal>
        <FirebaseUpload
          open={dialogUpload.open || false}
          onSuccess={setURL}
          onClose={handleCloseDiaLog}
          folder="AvatarAccount"
          type="image"
        />
      </Portal>

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
              Thông tin cá nhân
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
                          <div>
                            <div>Upload/Change Image</div>
                            <Button onClick={() => handleOpenDiaLog('image')}>Chọn hình </Button>
                          </div>
                        </div>
                      </div>
                      {!!selectedDocument && (
                        <div className={classes.tabItem}>
                          <div className={classes.tabItemTitle}>
                            <div className={classes.tabItemLabel}>
                              <span>Thay đổi mật khẩu</span>
                            </div>
                          </div>
                          <div className={`${classes.tabItemBody}`}>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>
                                  Mật khẩu cũ<sup className="required-star">*</sup>{' '}
                                </span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  type="password"
                                  variant="outlined"
                                  name="password"
                                  value={account.password || ''}
                                  className={classes.inputField}
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>
                                  Mật khẩu mới<sup className="required-star">*</sup>{' '}
                                </span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="new_password"
                                  type="password"
                                  value={account.new_password || ''}
                                  className={classes.inputField}
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>
                                  Nhập lại mật khẩu mới<sup className="required-star">*</sup>{' '}
                                </span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="new_password_confirm"
                                  type="password"
                                  value={account.new_password_confirm || ''}
                                  className={classes.inputField}
                                  onChange={handleChange}
                                />
                              </Grid>
                            </Grid>
                          </div>
                        </div>
                      )}
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
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>
                                Mã nhân viên<sup className="required-star">*</sup>{' '}
                              </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
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
                              <span className={classes.tabItemLabelField}>
                                Họ và tên<sup className="required-star">*</sup>{' '}
                              </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="full_name"
                                value={account.full_name || ''}
                                className={classes.inputField}
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Ngày sinh</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                type="date"
                                variant="outlined"
                                name="dob"
                                value={account.dob}
                                className={classes.inputField}
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>
                                Email<sup className="required-star">*</sup>{' '}
                              </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="email_address"
                                type="email"
                                value={account.email_address || ''}
                                className={classes.inputField}
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={12}>
                              <span className={classes.tabItemLabelField}>SĐT</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="phone_number"
                                value={account?.phone_number}
                                className={classes.inputField}
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={12}>
                              <span className={classes.tabItemLabelField}>Giới tính</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <Select
                                className={classes.multpleSelectField}
                                value={account.gender_id || ''}
                                onChange={(event) => setAccount({ ...account, gender_id: event.target.value })}
                              >
                                {genderList &&
                                  genderList.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.value}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={12}>
                              <span className={classes.tabItemLabelField}>Tỉnh</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <Select
                                className={classes.multpleSelectField}
                                value={account.province_id || ''}
                                onChange={(event) => setAccount({ ...account, province_id: event.target.value })}
                              >
                                {provinceList &&
                                  provinceList.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.value}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={12}>
                              <span className={classes.tabItemLabelField}>Địa chỉ</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="address"
                                value={account?.address}
                                className={classes.inputField}
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={12}>
                              <span className={classes.tabItemLabelField}>Chức danh</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="major"
                                value={account?.major}
                                className={classes.inputField}
                                onChange={handleChange}
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
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  style={{ background: 'rgb(97, 42, 255)', marginRight: 10 }}
                  onClick={() => handleResetPasswordAccount()}
                >
                  {'Thay đổi mật khẩu'}
                </Button>
                <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateAccount()}>
                  {'Cập nhật thông tin'}
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default ProfileModal;
