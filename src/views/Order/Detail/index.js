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
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useView from '../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, CONFIRM_CHANGE } from '../../../store/actions.js';
import { view } from '../../../store/constant';
import useStyles from './../../../utils/classes';
import FirebaseUpload from './../../FloatingMenu/FirebaseUpload/index';
import useConfirmPopup from './../../../hooks/useConfirmPopup';
import { AttachFileOutlined, Delete, DescriptionOutlined, History } from '@material-ui/icons';
import { getCustomerList } from './../../../services/api/Partner/Customer';
import { getStatusList, updateOrder, createOrder, deleteOrderDetail } from '../../../services/api/Order/index.js';
import { Autocomplete } from '@material-ui/lab';
import DatePicker from '../../../component/DatePicker/index.js';
import { AddCircleOutline } from '@material-ui/icons';
import { getAllProduct } from '../../../services/api/Product/Product.js';
import { SNACKBAR_OPEN } from './../../../store/actions';
import { createFileAttachment, deleteFileAttachment, getListFile } from '../../../services/api/Attachment/FileAttachment';
import ActivityLog from '../../../component/ActivityLog/index.js';
import NumberFormatCustom from './../../../component/NumberFormatCustom/index';
import { FormattedNumber } from 'react-intl';

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

const OrderModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.order.detail.save);
  const { orderDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [orderData, setOrderData] = useState({ order_date: new Date(), notes: '' });
  const [customer, setCustomer] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [listFileData, setListFileData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [containers, setContainers] = useState([]);

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
    setOrderData({ order_date: new Date(), notes: '' });
    setListFileData([]);
    setFileData([]);
    setProductList([]);
    setTabIndex(0);
  };
  const setURL = async (fileDataInput) => {
    console.log(fileDataInput?.file_name);
    const newFileData = { ...fileData, file_name: fileDataInput?.file_name, url: fileDataInput?.url };
    setFileData(newFileData);
    const res = await createFileAttachment(newFileData);
    if (res) fetchFileListData();
  };
  const handleDeleteFile = async (id) => {
    showConfirmPopup({
      title: 'Xóa file',
      message: 'Bạn có chắc chắn muốn xóa file?',
      action: deleteFileAttachment,
      payload: id,
      onSuccess: () => {
        fetchFileListData();
      },
    });
  };
  const fetchFileListData = async () => {
    const fileList = await getListFile(selectedDocument?.id);
    setListFileData(fileList);
  };
  const handleOpenDiaLog = () => {
    setIsOpenUpload(true);
  };
  const closeFirebaseDialog = () => {
    setIsOpenUpload(false);
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
        unit_volume: 0,
        unit_price: 0,
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
      unit_volume: product?.unit_volume || '',
      unit_price: 0,
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
    setFileData({ ...fileData, id: selectedDocument?.id });
    fetchFileListData();
    setProductList(selectedDocument?.order_detail);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const [customers, data] = await Promise.all([getCustomerList(), getStatusList()]);
      setCustomer(customers);
      setStatusList(data?.status);
      setContainers(data?.containers);
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
      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          fullScreen
          PaperProps={{
            style: {
              backgroundColor: '#f1f1f9',
            },
          }}
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
                        <DescriptionOutlined />
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
                        <AttachFileOutlined />
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
                        <History />
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
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Đơn hàng</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={3} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Mã đơn hàng<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="order_code"
                                type="text"
                                size="small"
                                disabled={!!selectedDocument?.id}
                                value={orderData.order_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Tên đơn hàng<sup className="required-star">*</sup>
                              </span>
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
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Ngày lập đơn hàng<sup className="required-star">*</sup>
                              </span>
                              <DatePicker
                                date={orderData.order_date}
                                onChange={(date) => setOrderData({ ...orderData, order_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Cảng đến<sup className="required-star">*</sup>
                              </span>
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
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Khách hàng<sup className="required-star">*</sup>
                              </span>
                              <Autocomplete
                                options={customer}
                                getOptionLabel={(option) => option.value || ''}
                                fullWidth
                                size="small"
                                onChange={(event, newValue) => {
                                  setOrderData({ ...orderData, customer_id: newValue?.id });
                                }}
                                value={customer?.find((item) => item.id === orderData?.customer_id) || null}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Ngày giao hàng<sup className="required-star">*</sup>
                              </span>
                              <DatePicker
                                date={orderData.expected_deliver_date}
                                onChange={(date) => setOrderData({ ...orderData, expected_deliver_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Trạng thái<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                name="status"
                                variant="outlined"
                                select
                                size="small"
                                value={orderData.status || ''}
                                onChange={handleChanges}
                              >
                                {statusList?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Container</span>
                              <TextField
                                fullWidth
                                name="container"
                                variant="outlined"
                                select
                                size="small"
                                value={orderData.container || ''}
                                onChange={handleChanges}
                              >
                                {containers?.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Sản phẩm</div>
                          <Tooltip title="Thêm sản phẩm">
                            <IconButton
                              onClick={handleAddProduct}
                              disabled={selectedDocument?.status === 'STATUS_OPEN' ? false : !selectedDocument ? false : true}
                            >
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã thành phẩm</TableCell>
                                  <TableCell align="left">Mã TP KH</TableCell>
                                  <TableCell align="left">Tên thành phẩm</TableCell>
                                  <TableCell align="left">SL cần</TableCell>
                                  {selectedDocument?.id && <TableCell align="left">Đã SX</TableCell>}
                                  {selectedDocument?.id && <TableCell align="left">SL Kho</TableCell>}
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Số khối</TableCell>
                                  <TableCell align="left">Đơn giá(VNĐ)</TableCell>
                                  <TableCell align="center">Xoá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {productList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '250px' }}>
                                      <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => option.product_code || ''}
                                        fullWidth
                                        size="small"
                                        disabled={selectedDocument?.status === 'STATUS_OPEN' ? false : !selectedDocument ? false : true}
                                        value={products.find((item) => item.product_code === row.product_code) || null}
                                        onChange={(event, newValue) => handleChangeProductCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left">{row?.product_customer_code}</TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ maxWidth: 350 }}>
                                      <Tooltip title={row?.product_name}>
                                        <span>{row?.product_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '150px' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="quantity_in_box"
                                        type="number"
                                        size="small"
                                        disabled={selectedDocument?.status === 'STATUS_OPEN' ? false : !selectedDocument ? false : true}
                                        value={row?.quantity_in_box || ''}
                                        onChange={(e) => handleChangeProduct(index, e)}
                                      />
                                    </TableCell>
                                    {selectedDocument?.id && (
                                      <TableCell align="left" style={{ width: '100px' }}>
                                        {row?.quantity_produced}
                                      </TableCell>
                                    )}
                                    {selectedDocument?.id && (
                                      <TableCell align="left" style={{ width: '100px' }}>
                                        {row?.quantity_in_warehouse}
                                      </TableCell>
                                    )}
                                    <TableCell align="left">{row.unit_name}</TableCell>
                                    <TableCell align="left" style={{ width: '120px' }}>
                                      <FormattedNumber value={row.unit_volume * row.quantity_in_box} />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '150px' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                          inputComponent: NumberFormatCustom,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="unit_price"
                                        size="small"
                                        disabled={selectedDocument?.status === 'STATUS_OPEN' ? false : !selectedDocument ? false : true}
                                        value={row?.unit_price || ''}
                                        onChange={(e) => handleChangeProduct(index, e)}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <IconButton
                                        onClick={() => handleDeleteProduct(index, row.id)}
                                        disabled={selectedDocument?.status === 'STATUS_OPEN' ? false : !selectedDocument ? false : true}
                                      >
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
                  <FirebaseUpload
                    open={isOpenUpload || false}
                    onSuccess={setURL}
                    onClose={closeFirebaseDialog}
                    type="other"
                    folder="File Import/Order"
                  />
                  <div className={`${classes.tabItemMentorAvatarBody}`} style={{ paddingBottom: 10, justifyContent: 'start' }}>
                    {selectedDocument?.id && (
                      <Button onClick={() => handleOpenDiaLog()} variant="default">
                        Thêm mới
                      </Button>
                    )}
                  </div>
                  <Grid container spacing={1}>
                    {listFileData?.map((file, index) => (
                      <Grid item xs={2}>
                        <div style={{ maxWidth: 210, height: 195 }}>
                          <div className={classes.tabItem}>
                            <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center', height: 170 }}>
                              <div>
                                {' '}
                                <img src={file.banner_url} alt="" style={{ width: 70, paddingTop: 10, height: 75 }} />
                              </div>

                              <div
                                style={{
                                  textAlign: 'center',
                                  maxWidth: 205,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 2,
                                  wordWrap: 'break-word',
                                  height: 54,
                                }}
                              >
                                {file.file_name}
                              </div>
                              <div>
                                <a href={file.download_url} target="__blank" style={{ marginRight: 10 }}>
                                  Tải xuống
                                </a>
                                <a onClick={() => handleDeleteFile(file.id)} style={{ marginRight: 10, textDecoration: 'underline' }}>
                                  Xóa
                                </a>
                                {/* <button  style={{ textDecoration: 'underline' }}>
                                  Xóa
                                </button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                  <Grid container spacing={1}>
                    <ActivityLog id={selectedDocument?.id} />
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

export default OrderModal;
