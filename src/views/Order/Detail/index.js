import {
  Switch,
  Snackbar,
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
  Select,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import Alert from '../../../component/Alert';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useView from '../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, CONFIRM_CHANGE } from '../../../store/actions.js';
import { view } from '../../../store/constant';
import useStyles from './../../../utils/classes';
import FirebaseUpload from './../../FloatingMenu/FirebaseUpload/index';
import useConfirmPopup from './../../../hooks/useConfirmPopup';
import { format as formatDate } from 'date-fns';
import { AccountCircleOutlined as AccountCircleOutlinedIcon, Today as TodayIcon } from '@material-ui/icons';
import { getCustomerList } from './../../../services/api/Partner/Customer';
import { getStatusList } from '../../../services/api/Order/index.js';
import { Autocomplete } from '@material-ui/lab';
import DatePicker from '../../../component/DatePicker/index.js';

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

const OrderModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.order.detail.save);
  const { orderDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [orderData, setOrderData] = useState({});
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [statusList, setStatusList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, orderDocument: false });
  };

  const handleOpenSnackbar = (isOpen, type, text) => {
    setSnackbarStatus({
      isOpen: isOpen,
      type: type,
      text: text,
    });
  };

  const setDocumentToDefault = async () => {
    setOrderData({});
    setSelectedCustomer({});
    setTabIndex(0);
  };
  const setURL = (image) => {
    if (dialogUpload.type === 'image') {
      setOrderData({ ...orderData, image_url: image });
    } else if (dialogUpload.type === 'banner') {
      setOrderData({ ...orderData, banner_url: image });
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
        handleOpenSnackbar(true, 'success', 'Cập nhật Order thành công!');
      } else {
        handleOpenSnackbar(true, 'success', 'Tạo Order thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'Order' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  };

  const showConfirmPopup = ({ title = 'Thông báo', message = '', action = null, payload = null, onSuccess = null }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setOrderData({
      ...orderData,
      ...selectedDocument,
    });
    setSelectedCustomer(customer.find((item) => item.id === selectedDocument.customer_id));
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const resCustomer = await getCustomerList();
      setCustomer(resCustomer);
      const res = await getStatusList();
      setStatusList(res);
    };
    fetchData();
    return () => {
      setCustomer([]);
      setStatusList([]);
    };
  }, []);

  return (
    <React.Fragment>
      {snackbarStatus.isOpen && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbarStatus.isOpen}
          autoHideDuration={4000}
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
        type="image"
        folder="Order"
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
              {selectedDocument?.id ? 'Cập nhật đơn hàng' : 'Tạo mới đơn hàng'}
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
                        Chi tiết Đơn hàng
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <AccountCircleOutlinedIcon className={`${tabIndex === 1 ? classes.tabActiveIcon : ''}`} />
                        File đính kèm
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(1)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <TodayIcon className={`${tabIndex === 2 ? classes.tabActiveIcon : ''}`} />
                        Lịch sử thay đổi
                      </Typography>
                    }
                    value={2}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Đơn hàng</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Khách hàng:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <Autocomplete
                                    id="combo-box-demo"
                                    options={customer}
                                    getOptionLabel={(option) => option.value}
                                    fullWidth
                                    size="small"
                                    value={selectedCustomer || null}
                                    onChange={(event, newValue) => {
                                      setOrderData({ ...orderData, customer_id: newValue?.id });
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                  />
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Mã đơn hàng:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="order_code"
                                    type="text"
                                    size="small"
                                    value={orderData.order_code || ''}
                                  />
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Ngày lập đơn hàng:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <DatePicker
                                    date={orderData.order_date}
                                    onChange={(date) => setOrderData({ ...orderData, order_date: date })}
                                  />
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Cảng đến:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="title"
                                    type="text"
                                    size="small"
                                    value={orderData.title || ''}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Ngày giao hàng:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <DatePicker
                                    date={orderData.expected_deliver_date}
                                    onChange={(date) => setOrderData({ ...orderData, expected_deliver_date: date })}
                                  />
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Trạng thái:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <TextField
                                    fullWidth
                                    name="status_id"
                                    variant="outlined"
                                    select
                                    size="small"
                                    value={orderData.status_id || ''}
                                  >
                                    {statusList?.map((option) => (
                                      <MenuItem key={option.id} value={option.id}>
                                        {option.value}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Sản phẩm</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã sản phẩm</TableCell>
                                  <TableCell align="left">Mã SP KH</TableCell>
                                  <TableCell align="left">Tên SP</TableCell>
                                  <TableCell align="left">SL cần</TableCell>
                                  <TableCell align="left">SL đã sản xuất</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Trạng thái</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody></TableBody>
                            </Table>
                          </TableContainer>
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
                <TabPanel value={tabIndex} index={2}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}></Grid>
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Button
                  variant="contained"
                  style={{ background: 'rgb(70, 81, 105)' }}
                  onClick={() => handleCloseDialog()}
                >
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

export default OrderModal;
