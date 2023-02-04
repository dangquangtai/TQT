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
import { format as formatDate } from 'date-fns';
import { AccountCircleOutlined as AccountCircleOutlinedIcon, Delete, Today as TodayIcon, AddCircleOutline } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import FirebaseUpload from './../../../FloatingMenu/FirebaseUpload/index';
import DatePicker from './../../../../component/DatePicker/index';
import {
  createGoodsReceipt,
  deleteGoodsReceiptDetail,
  getGoodsReceiptData,
  updateGoodsReceipt,
} from './../../../../services/api/Product/GoodsReceipt.js';
import { getWorkOrderRequest, getDailyWorkOrderList } from './../../../../services/api/Workorder/index';

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

const GoodsReceiptModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const { products } = useSelector((state) => state.metadata);
  const saveButton = formButtons.find((button) => button.name === view.goodsReceipt.detail.save);
  const { goodsReceiptDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [goodsReceiptData, setGoodsReceiptData] = useState({
    order_date: new Date(),
    notes: '',
  });

  const [receiptDetailList, setReceiptDetailList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [dailyWorkOrderList, setDailyWorkOrderList] = useState([]);

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
    dispatch({ type: FLOATING_MENU_CHANGE, goodsReceiptDocument: false });
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
    setGoodsReceiptData({ order_date: new Date() });
    setReceiptDetailList([]);
    setTabIndex(0);
  };
  const setURL = (image) => {
    if (dialogUpload.type === 'image') {
      setGoodsReceiptData({ ...goodsReceiptData, image_url: image });
    } else if (dialogUpload.type === 'banner') {
      setGoodsReceiptData({ ...goodsReceiptData, banner_url: image });
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
        await updateGoodsReceipt({ ...goodsReceiptData, receipt_detail: receiptDetailList });
        handleOpenSnackbar('success', 'Cập nhật Phiếu xuất thành phẩm thành công!');
      } else {
        await createGoodsReceipt({ ...goodsReceiptData, receipt_detail: receiptDetailList });
        console.log(receiptDetailList);
        handleOpenSnackbar('success', 'Tạo mới Phiếu xuất thành phẩm thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'goodsReceipt' });
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
    setGoodsReceiptData({ ...goodsReceiptData, [name]: value });
  };

  const handleChangeProduct = (index, e) => {
    const newReceiptDetailList = [...receiptDetailList];
    const { name, value } = e.target;
    if (name === 'quantity_in_box' && value > newReceiptDetailList[index].daily_quantity_in_box) {
      handleOpenSnackbar('error', 'Số lượng không được lớn hơn số lượng trong kế hoạch!');
      return;
    }
    newReceiptDetailList[index] = { ...newReceiptDetailList[index], [name]: value };
    setReceiptDetailList(newReceiptDetailList);
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setGoodsReceiptData({
      ...goodsReceiptData,
      ...selectedDocument,
    });
    setReceiptDetailList(selectedDocument?.receipt_detail || []);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const { status, warehouses, workOrders } = await getGoodsReceiptData();
      setStatusList(status);
      setWarehouseList(warehouses);
      setWorkOrderList(workOrders);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!goodsReceiptData?.work_order_id) return;
    const fetchData = async () => {
      const res = await getDailyWorkOrderList(goodsReceiptData?.work_order_id);
      setDailyWorkOrderList(res);
    };
    fetchData();
  }, [goodsReceiptData.work_order_id]);

  useEffect(() => {
    if (!goodsReceiptData?.daily_work_order_id) return;
    if (!!goodsReceiptData?.id) return;
    const fetchData = async () => {
      const { work_order_request, work_order_detail } = await getWorkOrderRequest(goodsReceiptData?.daily_work_order_id);
      const newOrderDetail = work_order_detail.map((item) => ({
        ...item,
        daily_quantity_in_box: item.quantity_in_box,
        quantity_in_box: 0,
        order_id: item?.customer_order_id,
        work_order_id: goodsReceiptData?.work_order_id,
        daily_work_order_id: goodsReceiptData?.daily_work_order_id,
      }));
      setReceiptDetailList(newOrderDetail);
    };
    fetchData();
  }, [goodsReceiptData.daily_work_order_id]);

  return (
    <React.Fragment>
      <FirebaseUpload open={dialogUpload.open || false} onSuccess={setURL} onClose={handleCloseDiaLog} type="image" folder="GoodsReceipt" />
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
              {selectedDocument?.id ? 'Cập nhật Phiếu xuất thành phẩm' : 'Tạo mới Phiếu xuất thành phẩm'}
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
                        Chi tiết
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
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Xuất thành phẩm</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={2} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã phiếu:</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="order_code"
                                type="text"
                                size="small"
                                value={goodsReceiptData.order_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Tên phiếu nhập:</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={goodsReceiptData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày nhập kho:</span>
                              <DatePicker
                                date={goodsReceiptData.order_date}
                                onChange={(date) => setGoodsReceiptData({ ...goodsReceiptData, order_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Nhà kho:</span>
                              <TextField
                                fullWidth
                                name="warehouse_id"
                                variant="outlined"
                                select
                                size="small"
                                value={goodsReceiptData.warehouse_id || ''}
                                onChange={handleChanges}
                              >
                                {warehouseList?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Kế hoạch sản xuất:</span>
                              <Autocomplete
                                options={workOrderList || []}
                                size="small"
                                getOptionLabel={(option) => option.order_title}
                                onChange={(event, newValue) => {
                                  setGoodsReceiptData({
                                    ...goodsReceiptData,
                                    work_order_id: newValue?.id || '',
                                  });
                                }}
                                value={workOrderList?.find((item) => item.id === goodsReceiptData.work_order_id) || null}
                                disabled={!!goodsReceiptData.id}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày thực hiện:</span>
                              <TextField
                                fullWidth
                                name="daily_work_order_id"
                                variant="outlined"
                                select
                                size="small"
                                value={goodsReceiptData.daily_work_order_id || ''}
                                disabled={!!goodsReceiptData.id}
                                onChange={handleChanges}
                              >
                                {dailyWorkOrderList?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {formatDate(new Date(option.work_order_date), 'dd/MM/yyyy')}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Trạng thái:</span>
                              <TextField
                                fullWidth
                                name="status"
                                variant="outlined"
                                select
                                size="small"
                                value={goodsReceiptData.status || ''}
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
                              <span className={classes.tabItemLabelField}>Ghi chú:</span>
                              <TextField
                                fullWidth
                                multiline
                                minRows={1}
                                variant="outlined"
                                name="notes"
                                type="text"
                                size="small"
                                value={goodsReceiptData.notes || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Danh sách thành phẩm</div>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã thành phẩm</TableCell>
                                  <TableCell align="left">Tên thành phẩm</TableCell>
                                  <TableCell align="left">SL kế hoạch</TableCell>
                                  <TableCell align="left">SL nhập</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Trạng thái</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {receiptDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '25%' }}>
                                      <Tooltip title={row?.product_code}>
                                        <span>{row?.product_code}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '40%' }}>
                                      <Tooltip title={row?.product_name}>
                                        <span>{row?.product_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '15%' }}>
                                      {row?.daily_quantity_in_box}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0, max: row?.daily_quantity_in_box },
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
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.status_display}
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

export default GoodsReceiptModal;
