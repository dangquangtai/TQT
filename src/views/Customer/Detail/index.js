import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Tab,
  Tabs,
  Typography,
  TextField,
  MenuItem,
  Switch,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useView from '../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, CONFIRM_CHANGE } from '../../../store/actions.js';
import { view } from '../../../store/constant';
import useStyles from './../../../utils/classes';
import FirebaseUpload from './../../FloatingMenu/FirebaseUpload/index';
import useConfirmPopup from './../../../hooks/useConfirmPopup';
import { AccountCircleOutlined as AccountCircleOutlinedIcon, Today as TodayIcon } from '@material-ui/icons';
import { createCustomer, updateCustomer } from '../../../services/api/Partner/Customer.js';
import { getAllCustomerCategory } from '../../../services/api/Setting/CustomerCategory.js';
import { SNACKBAR_OPEN } from './../../../store/actions';

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

const CustomerModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.customer.detail.save);
  const { customerDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [customerData, setCustomerData] = useState({ notes: '', contact_person: '', is_active: true, address: '' });
  const [categories, setCategories] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, customerDocument: false });
  };

  const handleOpenSnackbar = (type, text) => {
    dispatch({
      type: SNACKBAR_OPEN,
      open: true,
      variant: 'alert',
      message: text,
      alertSeverity: type,
    });
  };

  const setDocumentToDefault = async () => {
    setCustomerData({ is_active: true, notes: '', contact_person: '', address: '' });
    setTabIndex(0);
  };
  const setURL = (image) => {
    if (dialogUpload.type === 'image') {
      setCustomerData({ ...customerData, image_url: image });
    } else if (dialogUpload.type === 'banner') {
      setCustomerData({ ...customerData, banner_url: image });
    }
  };

  const handleOpenDiaLog = (type) => {
    setDialogUpload({
      open: true,
      type: type,
    });
  };
  const handleCloseDiaLog = () => {
    setDialogUpload({
      open: false,
      type: '',
    });
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        await updateCustomer(customerData);
        handleOpenSnackbar('success', 'Cập nhật Khách hàng thành công!');
      } else {
        await createCustomer(customerData);
        handleOpenSnackbar('success', 'Tạo mới Khách hàng thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'customer' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const showConfirmPopup = ({ title = 'Thông báo', message = '', action = null, payload = null, onSuccess = null }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setCustomerData({
      ...customerData,
      ...selectedDocument,
    });
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllCustomerCategory();
      setCategories(data);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <FirebaseUpload open={dialogUpload.open || false} onSuccess={setURL} onClose={handleCloseDiaLog} type="image" folder="Customer" />
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
              {selectedDocument?.id ? 'Cập nhật Khách hàng' : 'Tạo mới Khách hàng'}
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
                        Chi tiết Khách hàng
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <TodayIcon className={`${tabIndex === 2 ? classes.tabActiveIcon : ''}`} />
                        Lịch sử thay đổi
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Thông tin</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Mã khách hàng(*):</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="customer_code"
                                  type="text"
                                  size="small"
                                  value={customerData.customer_code || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Tên khách hàng(*):</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="title"
                                  type="text"
                                  size="small"
                                  value={customerData.title || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Danh mục(*):</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  name="category_id"
                                  variant="outlined"
                                  select
                                  size="small"
                                  value={customerData.category_id || ''}
                                  onChange={handleChanges}
                                >
                                  {categories?.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.category_name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Email(*):</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="email_address"
                                  type="text"
                                  size="small"
                                  value={customerData.email_address || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Số điện thoại(*):</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="number_phone"
                                  type="text"
                                  size="small"
                                  value={customerData.number_phone || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Hoạt động:</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <Switch
                                  checked={customerData.is_active || false}
                                  onChange={(e) => setCustomerData({ ...customerData, is_active: e.target.checked })}
                                  color="primary"
                                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Thông tin thêm</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Địa chỉ:</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="address"
                                  type="text"
                                  size="small"
                                  multiline
                                  minRows={2}
                                  value={customerData.address || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Người liên hệ:</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="contact_person"
                                  type="text"
                                  size="small"
                                  value={customerData.contact_person || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Ghi chú</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={12} md={12} xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  variant="outlined"
                                  name="notes"
                                  type="text"
                                  size="small"
                                  minRows={7}
                                  value={customerData.notes || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}></Grid>
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="space-between">
              <Grid item className={classes.gridItemInfoButtonWrap}>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              <Grid item className={classes.gridItemInfoButtonWrap}>
                {saveButton && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    {saveButton.text}
                  </Button>
                )}
                {!selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    Tạo mới
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

export default CustomerModal;
