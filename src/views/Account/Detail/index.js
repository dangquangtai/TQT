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
import {getUserGroupList} from '../../../services/api/UserGroup/index';
import { useStaticState } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
import { ResetTvRounded } from '@mui/icons-material';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
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

const AccountModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.user.detail.save);
  const buttonResetPass = formButtons.find((button)=> button.name=== view.user.detail.reset_password);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
 
  const { createAccount, updateAccount,  resetPassword } = useAccount();
  const { accountDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });
  const { provinces: provinceList, genders: genderList, degree: degreeList } = useSelector((state) => state.metadata);
  const [account, setAccount] = React.useState({
    ...initAccount,
  });
  useEffect(() => {
    if (!selectedDocument) return;
    setAccount({
      ...account,
      ...selectedDocument,
    });
  }, [selectedDocument]);
  

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
      if(account.employee_code===''||account.email_address===''||account.full_name===''){
        handleOpenSnackbar(true, 'error', 'Vui lòng điền đầy đủ thông tin!');
      }
       else if (!account.id) {
       
        let check = await createAccount({
          ...account,
          outputtype: 'RawJson',
        });
        if (check == true) {
          handleOpenSnackbar(true, 'success', 'Tạo mới thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'account' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Tài khoản đã tồn tại!');
        }
      } else {
        let check = await updateAccount({
          ...account,
          outputtype: 'RawJson',
        })
        if (check == true) {
          handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'account' });
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
      if(!account.new_password || !account.password){
        handleOpenSnackbar(true, 'error', 'Vui lòng điền đầy đủ thông tin!');
      }
       else {
        let check = await resetPassword(account.new_password,account.password,account.email_address)
        if (check == true) {
          handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
        } else {
          handleOpenSnackbar(true, 'error', 'Tài khoản đã tồn tại!');
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
                          <div>
                            <div>Upload/Change Image</div>
                            <Button onClick={() => handleOpenDiaLog('image')}>Chọn hình </Button>
                          </div>
                        </div>
                      </div>
                      {!!selectedDocument &&(
                         <div className={classes.tabItem}>
                         <div className={classes.tabItemTitle}>
                           <div className={classes.tabItemLabel}>
                             <span>Thay đổi mật khẩu</span>
                           </div>
                         </div>
                         <div className={`${classes.tabItemBody}`}>
                         <Grid container className={classes.gridItemInfo} alignItems="center">
                             <Grid item lg={4} md={4} xs={4}>
                               <span className={classes.tabItemLabelField}>Mật khẩu cũ(*): </span>
                             </Grid>
                             <Grid item lg={8} md={8} xs={8}>
                               <TextField
                                 fullWidth
                               
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
                               <span className={classes.tabItemLabelField}>Mật khẩu mới(*): </span>
                             </Grid>
                             <Grid item lg={8} md={8} xs={8}>
                               <TextField
                                 fullWidth
                                 variant="outlined"
                                 name="new_password"
                                 value={account.new_password || ''}
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
                              <span className={classes.tabItemLabelField}>Mã nhân viên(*): </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
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
                              <span className={classes.tabItemLabelField}>Họ và tên(*): </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
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
                              <span className={classes.tabItemLabelField}>Ngày sinh:</span>
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
                              <span className={classes.tabItemLabelField}>Email(*): </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
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
                              <span className={classes.tabItemLabelField}>SĐT:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
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
                              <span className={classes.tabItemLabelField}>Giới tính:</span>
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
                              <span className={classes.tabItemLabelField}>Tỉnh:</span>
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
                              <span className={classes.tabItemLabelField}>Địa chỉ:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={12}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
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
                              <span className={classes.tabItemLabelField}>Chức danh:</span>
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
                <Button
                  variant="contained"
                  style={{ background: 'rgb(70, 81, 105)' }}
                  onClick={() => handleCloseDialog()}
                >
                  Đóng
                </Button>
              </Grid>
              {!account.id && (
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={() => handleUpdateAccount()}
                  >
                    {'Tạo mới'}
                  </Button>
                </Grid>
              )}
              <Grid item>
              {buttonResetPass && !!selectedDocument &&(
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)', marginRight: 10 }}
                    onClick={() => handleResetPasswordAccount()}
                  >
                    {buttonResetPass.text}
                  </Button>
              )}
              {buttonSave && !!selectedDocument &&(
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={() => handleUpdateAccount()}
                  >
                    {buttonSave.text}
                  </Button>
              )}
               </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default AccountModal;
