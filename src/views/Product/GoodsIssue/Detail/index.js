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
  createGoodsIssue,
  deleteGoodsIssueDetail,
  getGoodsIssueData,
  updateGoodsIssue,
} from './../../../../services/api/Product/GoodsIssue.js';

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

const GoodsIssueModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const { products } = useSelector((state) => state.metadata);
  const saveButton = formButtons.find((button) => button.name === view.goodsIssue.detail.save);
  const { goodsIssueDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [goodsIssueData, setGoodsIssueData] = useState({
    order_date: new Date(),
    notes: '',
  });

  const [issueDetailList, setIssueDetailList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

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
    dispatch({ type: FLOATING_MENU_CHANGE, goodsIssueDocument: false });
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
    setGoodsIssueData({ order_date: new Date() });
    setIssueDetailList([]);
    setTabIndex(0);
  };
  const setURL = (image) => {
    if (dialogUpload.type === 'image') {
      setGoodsIssueData({ ...goodsIssueData, image_url: image });
    } else if (dialogUpload.type === 'banner') {
      setGoodsIssueData({ ...goodsIssueData, banner_url: image });
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
        await updateGoodsIssue({ ...goodsIssueData, issue_detail: issueDetailList });
        handleOpenSnackbar('success', 'Cập nhật Phiếu xuất thành phẩm thành công!');
      } else {
        await createGoodsIssue({ ...goodsIssueData, issue_detail: issueDetailList });
        handleOpenSnackbar('success', 'Tạo mới Phiếu xuất thành phẩm thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'goodsIssue' });
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
    setGoodsIssueData({ ...goodsIssueData, [name]: value });
  };

  const handleAddIssueDetail = () => {
    // if (!goodsIssueData.supplier_id) {
    //   handleOpenSnackbar('error', 'Vui lòng chọn nhà cung cấp!');
    //   return;
    // }
    setIssueDetailList([
      {
        issue_id: selectedDocument?.id || '',
        id: '',
        product_id: '',
        product_code: '',
        product_name: '',
        unit_id: '',
        unit_name: '',
        quantity_in_box: 0,
      },
      ...issueDetailList,
    ]);
  };

  const handleChangeProductCode = (index, newItem) => {
    const newProductList = [...issueDetailList];
    const newProduct = {
      product_id: newItem?.id || '',
      product_code: newItem?.product_code || '',
      product_name: newItem?.title || '',
      unit_id: newItem?.unit_id || '',
      unit_name: newItem?.unit_name || '',
    };
    newProductList[index] = { ...newProductList[index], ...newProduct };
    if (issueDetailList?.some((item) => item.product_id === newItem?.id)) {
      handleOpenSnackbar('error', 'Thành phẩm đã tồn tại!');
      return;
    }
    setIssueDetailList(newProductList);
  };

  const handleChangeProduct = (index, e) => {
    const { name, value } = e.target;
    const newIssueDetailList = [...issueDetailList];
    newIssueDetailList[index] = { ...newIssueDetailList[index], [name]: value };
    setIssueDetailList(newIssueDetailList);
  };

  const handleDeleteProduct = (index, id) => {
    if (id) {
      showConfirmPopup({
        title: 'Xóa thành phẩm',
        message: 'Bạn có chắc chắn muốn xóa thành phẩm này?',
        action: deleteGoodsIssueDetail,
        payload: id,
        onSuccess: () => {
          spliceProduct(index);
        },
      });
    } else {
      spliceProduct(index);
    }
  };

  const spliceProduct = (index) => {
    const newIssueDetailList = [...issueDetailList];
    newIssueDetailList.splice(index, 1);
    setIssueDetailList(newIssueDetailList);
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setGoodsIssueData({
      ...goodsIssueData,
      ...selectedDocument,
    });
    setIssueDetailList(selectedDocument?.issue_detail || []);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const { status, warehouses, customers } = await getGoodsIssueData();
      setStatusList(status);
      setWarehouseList(warehouses);
      setCustomerList(customers);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <FirebaseUpload open={dialogUpload.open || false} onSuccess={setURL} onClose={handleCloseDiaLog} type="image" folder="GoodsIssue" />
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
                                value={goodsIssueData.order_code || ''}
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
                                value={goodsIssueData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày xuất kho:</span>
                              <DatePicker
                                date={goodsIssueData.order_date}
                                onChange={(date) => setGoodsIssueData({ ...goodsIssueData, order_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Khách hàng:</span>
                              <Autocomplete
                                options={customerList || []}
                                size="small"
                                getOptionLabel={(option) => option.value}
                                onChange={(event, newValue) => {
                                  setGoodsIssueData({
                                    ...goodsIssueData,
                                    customer_order_id: newValue?.id || '',
                                  });
                                }}
                                value={customerList?.find((item) => item.id === goodsIssueData.customer_order_id) || null}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
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
                                value={goodsIssueData.warehouse_id || ''}
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
                              <span className={classes.tabItemLabelField}>Trạng thái:</span>
                              <TextField
                                fullWidth
                                name="status"
                                variant="outlined"
                                select
                                size="small"
                                value={goodsIssueData.status || ''}
                                onChange={handleChanges}
                              >
                                {statusList?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item lg={6} md={6} xs={6}>
                              <span className={classes.tabItemLabelField}>Ghi chú:</span>
                              <TextField
                                fullWidth
                                multiline
                                minRows={1}
                                variant="outlined"
                                name="notes"
                                type="text"
                                size="small"
                                value={goodsIssueData.notes || ''}
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
                          <Tooltip title="Thêm thành phẩm">
                            <IconButton onClick={handleAddIssueDetail}>
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
                                  <TableCell align="left">Tên thành phẩm</TableCell>
                                  <TableCell align="left">SL nhập</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="center">Xoá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {issueDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '25%' }}>
                                      <Autocomplete
                                        options={products}
                                        getOptionLabel={(option) => option.product_code || ''}
                                        fullWidth
                                        size="small"
                                        value={products.find((item) => item.id === row.product_id) || null}
                                        onChange={(event, newValue) => handleChangeProductCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '40%' }}>
                                      <Tooltip title={row?.product_name}>
                                        <span>{row?.product_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '20%' }}>
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
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '5%' }}>
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

export default GoodsIssueModal;
