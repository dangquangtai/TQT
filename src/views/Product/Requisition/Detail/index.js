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
import { History, AttachFileOutlined, DescriptionOutlined, AddCircleOutline } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import FirebaseUpload from './../../../FloatingMenu/FirebaseUpload/index';
import DatePicker from './../../../../component/DatePicker/index';
import { createFileAttachment, deleteFileAttachment, getListFile } from '../../../../services/api/Attachment/FileAttachment';
import ActivityLog from '../../../../component/ActivityLog/index.js';
import TableCollapse from './collapse.js';
import { ProductRequisitionService } from '../../../../services/api/Product/Requisition.js';
import { getAllSupplier } from '../../../../services/api/Partner/Supplier.js';
import { ProductContractService } from '../../../../services/api/Product/Contract.js';

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

const ProductRequisitionModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.productRequisition.detail.save);
  const { productRequisitionDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [listFileData, setListFileData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [ProductRequisitionData, setProductRequisitionData] = useState({
    order_date: new Date(),
    delivery_date: new Date(),
    notes: '',
  });
  const [supplier, setSupplier] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);

  const [ProductList, setProductList] = useState([]);
  const [contractList, setContractList] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
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
    // const res = await deleteFileAttachment(id);
    // if (res)
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
  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, productRequisitionDocument: false });
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
    setProductRequisitionData({ order_date: new Date(), delivery_date: new Date(), notes: '' });
    setListFileData([]);
    setFileData([]);
    setProductList([]);
    setTabIndex(0);
    setContractList([]);
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        await ProductRequisitionService.update({ ...ProductRequisitionData, order_detail: ProductList });
        handleOpenSnackbar('success', 'Cập nhật Đơn hàng mua thành phẩm thành công!');
      } else {
        await ProductRequisitionService.create({ ...ProductRequisitionData, order_detail: ProductList });
        handleOpenSnackbar('success', 'Tạo mới Đơn hàng mua thành phẩm thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'productRequisition' });
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
    setProductRequisitionData({ ...ProductRequisitionData, [name]: value });
  };

  const handleAddProduct = () => {
    if (!ProductRequisitionData.supplier_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn nhà cung cấp!');
      return;
    }
    setProductList([
      ...ProductList,
      {
        requisition_id: selectedDocument?.id || '',
        id: '',
        product_id: '',
        product_name: '',
        product_code: '',
        supplier_id: ProductRequisitionData?.supplier_id || '',
        supplier_name: ProductRequisitionData?.supplier_name || '',
        category_id: '',
        category_name: '',
        status: '',
        unit_id: '',
        unit_name: '',
        quantity_in_box: 0,
        contract_id: '',
      },
    ]);
  };

  const handleChangeProductCode = (index, newItem) => {
    const newProductList = [...ProductList];
    const newProduct = {
      product_id: newItem?.id || '',
      product_code: newItem?.product_code || '',
      product_customer_code: newItem?.product_customer_code || '',
      product_name: newItem?.title || '',
      category_id: newItem?.category_id || '',
      category_name: newItem?.category_name || '',
      unit_id: newItem?.unit_id || '',
      unit_name: newItem?.unit_name || '',
      unit_price: newItem?.unit_price,
    };
    newProductList[index] = { ...newProductList[index], ...newProduct };
    setProductList(newProductList);
  };

  const handleChangeContract = (index, newItem) => {
    const newProductList = [...ProductList];
    const newProduct = {
      contract_id: newItem?.contract_id || newItem?.id,
      contract_title: newItem?.contract_title || newItem?.title,
      contract_code: newItem?.contract_code,
      unit_price: newItem?.unit_price,
    };
    newProductList[index] = { ...newProductList[index], ...newProduct };
    setProductList(newProductList);
  };

  const handleChangeProduct = (index, e) => {
    const { name, value } = e.target;
    const newProductList = [...ProductList];
    newProductList[index] = { ...newProductList[index], [name]: value };
    setProductList(newProductList);
  };

  const handleDeleteProduct = (index, id) => {
    if (id) {
      showConfirmPopup({
        title: 'Xóa thành phẩm',
        message: 'Bạn có chắc chắn muốn xóa thành phẩm này?',
        action: () => {},
        payload: id,
        onSuccess: () => {
          const newProductList = [...ProductList];
          newProductList.splice(index, 1);
          setProductList(newProductList);
        },
      });
    } else {
      const newProductList = [...ProductList];
      newProductList.splice(index, 1);
      setProductList(newProductList);
    }
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setProductRequisitionData({
      ...ProductRequisitionData,
      ...selectedDocument,
    });
    setFileData({ ...fileData, id: selectedDocument?.id });
    fetchFileListData();
    setProductList(selectedDocument?.order_detail);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const [supplier, { warehouse_list, status_list }] = await Promise.all([getAllSupplier(), ProductRequisitionService.getData()]);
      setSupplier(supplier);
      setStatusList(status_list);
      setWarehouseList(warehouse_list);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [contract_list] = await Promise.all([ProductContractService.getContractUnfinished(ProductRequisitionData.supplier_id)]);
      setContractList(contract_list);
    };
    if (ProductRequisitionData.supplier_id) fetchData();
    else setContractList([]);
  }, [ProductRequisitionData.supplier_id]);

  const isDisabled = selectedDocument?.status?.includes('RECEIVED');
  const isDetail = selectedDocument?.id;

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
              {selectedDocument?.id ? 'Cập nhật Đơn hàng mua thành phẩm' : 'Tạo mới Đơn hàng mua thành phẩm'}
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
                          <div className={classes.tabItemLabel}>Mua thành phẩm</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={3} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã đơn mua hàng(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="order_code"
                                type="text"
                                size="small"
                                value={ProductRequisitionData.order_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Tên đơn mua hàng(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={ProductRequisitionData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày lập đơn hàng(*):</span>
                              <DatePicker
                                date={ProductRequisitionData.order_date}
                                onChange={(date) => setProductRequisitionData({ ...ProductRequisitionData, order_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày giao hàng(*):</span>
                              <DatePicker
                                date={ProductRequisitionData.delivery_date}
                                onChange={(date) => setProductRequisitionData({ ...ProductRequisitionData, delivery_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Nhà cung cấp(*):</span>
                              <Autocomplete
                                id="combo-box-demo"
                                options={supplier}
                                getOptionLabel={(option) => option.title || ''}
                                fullWidth
                                disabled={isDisabled}
                                size="small"
                                value={supplier?.find((item) => item.id === ProductRequisitionData.supplier_id) || null}
                                onChange={(event, newValue) => {
                                  setProductRequisitionData({
                                    ...ProductRequisitionData,
                                    supplier_id: newValue?.id,
                                    supplier_name: newValue?.title,
                                  });
                                }}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Nhà kho(*):</span>
                              <TextField
                                fullWidth
                                name="warehouse_id"
                                variant="outlined"
                                select
                                size="small"
                                disabled={isDisabled}
                                value={ProductRequisitionData.warehouse_id || ''}
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
                              <span className={classes.tabItemLabelField}>Trạng thái(*):</span>
                              <TextField
                                fullWidth
                                name="status"
                                variant="outlined"
                                select
                                size="small"
                                value={ProductRequisitionData.status || ''}
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
                                value={ProductRequisitionData.notes || ''}
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
                            <IconButton size="small" onClick={handleAddProduct}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table size="small" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell />
                                  <TableCell align="left">Mã thành phẩm</TableCell>
                                  <TableCell align="left">Tên thành phẩm</TableCell>
                                  <TableCell align="left">SL cần</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Hợp đồng</TableCell>
                                  {!isDetail && <TableCell align="left">SL còn lại</TableCell>}
                                  <TableCell align="left">Giá(VNĐ)</TableCell>
                                  <TableCell align="left">Ghi chú</TableCell>
                                  {isDetail && <TableCell align="left">Trạng thái</TableCell>}
                                  {!isDisabled && <TableCell align="center">Xoá</TableCell>}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {ProductList?.map((row, index) => (
                                  <TableCollapse
                                    key={index}
                                    row={row}
                                    index={index}
                                    isDisabled={isDisabled}
                                    isDetail={isDetail}
                                    handleDeleteProduct={handleDeleteProduct}
                                    handleChangeProductCode={handleChangeProductCode}
                                    classes={classes}
                                    handleChangeProduct={handleChangeProduct}
                                    handleChangeContract={handleChangeContract}
                                    contractList={contractList}
                                  />
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
                    folder="File Import/ProductRequisition"
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

export default ProductRequisitionModal;
