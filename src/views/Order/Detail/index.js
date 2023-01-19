import {
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
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
import { AccountCircleOutlined as AccountCircleOutlinedIcon, Delete, Today as TodayIcon } from '@material-ui/icons';
import { getCustomerList } from './../../../services/api/Partner/Customer';
import { getStatusList, updateOrder } from '../../../services/api/Order/index.js';
import { Autocomplete } from '@material-ui/lab';
import DatePicker from '../../../component/DatePicker/index.js';
import { AddCircleOutline } from '@material-ui/icons';
import { getAllProduct } from '../../../services/api/Product/Product.js';
import { createOrder, deleteOrderDetail } from './../../../services/api/Order/index';
import { SNACKBAR_OPEN } from './../../../store/actions';

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

  const [orderData, setOrderData] = useState({ order_date: new Date() });
  const [customer, setCustomer] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });

  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, orderDocument: false });
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
    setOrderData({ order_date: new Date() });
    setProductList([]);
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
        await updateOrder({ ...orderData, order_detail: productList });
        handleOpenSnackbar('success', 'Cập nhật Đơn hàng thành công!');
      } else {
        await createOrder({ ...orderData, order_detail: productList });
        handleOpenSnackbar('success', 'Tạo mới Đơn hàng thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'order' });
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
    setOrderData({ ...orderData, [name]: value });
  };

  const getProductList = async () => {
    const response = await getAllProduct();
    setProducts(response);
  };

  const handleAddProduct = () => {
    setProductList([
      {
        order_id: selectedDocument?.id || '',
        id: '',
        product_id: '',
        product_code: '',
        product_name: '',
        product_customer_code: '',
        order_status: '',
        unit_id: '',
        unit_name: '',
        quantity_in_box: 0,
        quantity_produced: 0,
      },
      ...productList,
    ]);
  };

  const handleChangeProductCode = (index, product) => {
    const newProductList = [...productList];
    const newProduct = {
      product_id: product?.id || '',
      product_code: product?.product_code || '',
      product_name: product?.title || '',
      product_customer_code: product?.product_customer_code || '',
      unit_id: product?.unit_id || '',
      unit_name: product?.unit_name || '',
    };
    newProductList[index] = { ...newProductList[index], ...newProduct };
    setProductList(newProductList);
  };

  const handleChangeProduct = (index, e) => {
    const { name, value } = e.target;
    const newProductList = [...productList];
    newProductList[index] = { ...newProductList[index], [name]: value };
    setProductList(newProductList);
  };

  const handleDeleteProduct = (index, id) => {
    if (id) {
      showConfirmPopup({
        title: 'Xóa sản phẩm',
        message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
        action: deleteOrderDetail,
        payload: id,
        onSuccess: () => {
          const newProductList = [...productList];
          newProductList.splice(index, 1);
          setProductList(newProductList);
        },
      });
    } else {
      const newProductList = [...productList];
      newProductList.splice(index, 1);
      setProductList(newProductList);
    }
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setOrderData({
      ...orderData,
      ...selectedDocument,
    });
    setProductList(selectedDocument?.order_detail);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const resCustomer = await getCustomerList();
      setCustomer(resCustomer);
      const res = await getStatusList();
      setStatusList(res);
    };
    fetchData();
    getProductList();
    return () => {
      setCustomer([]);
      setStatusList([]);
    };
  }, []);

  return (
    <React.Fragment>
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
                                    getOptionLabel={(option) => option.value || ''}
                                    fullWidth
                                    size="small"
                                    value={customer?.find((item) => item.id === selectedDocument?.customer_id) || null}
                                    onChange={(event, newValue) => {
                                      setOrderData({ ...orderData, customer_id: newValue?.id });
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                  />
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Tên đơn hàng:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="title"
                                    type="text"
                                    size="small"
                                    value={orderData.title || ''}
                                    onChange={handleChanges}
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
                                    onChange={handleChanges}
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
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={4} md={4} xs={4}>
                                  <span className={classes.tabItemLabelField}>Cảng đến:</span>
                                </Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="deliver_address"
                                    type="text"
                                    size="small"
                                    value={orderData.deliver_address || ''}
                                    onChange={handleChanges}
                                  />
                                </Grid>
                              </Grid>
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
                                    name="order_status"
                                    variant="outlined"
                                    select
                                    size="small"
                                    value={orderData.order_status || ''}
                                    onChange={handleChanges}
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
                          <Tooltip title="Thêm sản phẩm">
                            <IconButton onClick={handleAddProduct}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã sản phẩm</TableCell>
                                  <TableCell align="left">Mã SP KH</TableCell>
                                  <TableCell align="left">Tên sản phẩm</TableCell>
                                  <TableCell align="left">SL cần</TableCell>
                                  {selectedDocument?.id && <TableCell align="left">Đã SX</TableCell>}
                                  <TableCell align="left">Đơn vị</TableCell>
                                  {selectedDocument?.id && <TableCell align="left">Trạng thái</TableCell>}
                                  <TableCell align="center">Xoá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {productList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ minWidth: '200px' }}>
                                      <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => option.product_code || ''}
                                        fullWidth
                                        size="small"
                                        value={products.find((item) => item.product_code === row.product_code) || null}
                                        onChange={(event, newValue) => handleChangeProductCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left">{row?.product_customer_code}</TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell}>
                                      <Tooltip title={row?.product_name}>
                                        <span>{row?.product_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '130px' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="quantity_in_box"
                                        type="number"
                                        size="small"
                                        value={row?.quantity_in_box || ''}
                                        onChange={(e) => handleChangeProduct(index, e)}
                                      />
                                    </TableCell>
                                    {selectedDocument?.id && (
                                      <TableCell align="left" style={{ width: '100px' }}>
                                        {row?.quantity_produced}
                                      </TableCell>
                                    )}
                                    <TableCell align="left">{row.unit_name}</TableCell>
                                    {selectedDocument?.id && <TableCell align="left">{row.status_display}</TableCell>}
                                    <TableCell align="center">
                                      <IconButton onClick={() => handleDeleteProduct(index, row.id)}>
                                        <Delete />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
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
