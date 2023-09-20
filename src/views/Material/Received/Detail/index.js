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
import { Delete, History, AttachFileOutlined, DescriptionOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE, CLOSE_MODAL_MATERIAL } from './../../../../store/actions';
import FirebaseUpload from './../../../FloatingMenu/FirebaseUpload/index';
import DatePicker from './../../../../component/DatePicker/index';
import {
  createReceivedMaterial,
  deleteReceivedMaterialDetail,
  exportMaterialReceived,
  getReceivedMaterialStatus,
  updateReceivedMaterial,
} from './../../../../services/api/Material/Received';
import { getAllSupplier } from '../../../../services/api/Partner/Supplier.js';
import { downloadFile, popupWindow } from './../../../../utils/helper';
import { createFileAttachment, deleteFileAttachment, getListFile } from '../../../../services/api/Attachment/FileAttachment';
import ActivityLog from '../../../../component/ActivityLog/index.js';
import { FormattedNumber } from 'react-intl';
import NumberFormatCustom from './../../../../component/NumberFormatCustom/index';

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

const ReceivedMaterialModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.receivedMaterial.detail.save);
  const exportButton = formButtons.find((button) => button.name === view.receivedMaterial.detail.export);
  const { receivedMaterialDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const newWindow = React.useRef(null);
  const { materialReceived } = useSelector((state) => state.material);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [listFileData, setListFileData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [receivedMaterialData, setReceivedMaterialData] = useState({
    received_date: new Date(),
    received_by: '',
    handled_by: '',
    notes: '',
  });
  const [materialOrderDetailList, setMaterialOrderDetailList] = useState([]);
  const [receivedDetailList, setReceivedDetailList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);

  const [tabIndex, setTabIndex] = React.useState(0);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });

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
    dispatch({ type: FLOATING_MENU_CHANGE, receivedMaterialDocument: false });
    dispatch({ type: CLOSE_MODAL_MATERIAL });
    if (newWindow.current) newWindow.current.close();
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
    setReceivedMaterialData({ received_date: new Date(), received_by: '', handled_by: '', notes: '' });
    setListFileData([]);
    setFileData([]);
    setReceivedDetailList([]);
    setMaterialOrderDetailList([]);
    setTabIndex(0);
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
        await updateReceivedMaterial({ ...receivedMaterialData, received_detail: receivedDetailList });
        handleOpenSnackbar('success', 'Cập nhật Phiếu nhập vật tư thành công!');
      } else {
        await createReceivedMaterial({ ...receivedMaterialData, received_detail: receivedDetailList });
        handleOpenSnackbar('success', 'Tạo mới Phiếu nhập vật tư thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'receivedMaterial' });
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
    setReceivedMaterialData({ ...receivedMaterialData, [name]: value });
  };

  const handleDeleteMaterial = (index, id) => {
    if (id && selectedDocument?.id) {
      showConfirmPopup({
        title: 'Xóa vật tư',
        message: 'Bạn có chắc chắn muốn xóa vật tư này?',
        action: deleteReceivedMaterialDetail,
        payload: id,
        onSuccess: () => {
          spliceMaterial(index);
        },
      });
    } else {
      spliceMaterial(index);
    }
  };

  const spliceMaterial = (index) => {
    const newReceivedDetailList = [...receivedDetailList];
    newReceivedDetailList.splice(index, 1);
    setReceivedDetailList(newReceivedDetailList);
    const newMaterialOrderDetailList = [...materialOrderDetailList];
    newMaterialOrderDetailList.splice(index, 1);
    setMaterialOrderDetailList(newMaterialOrderDetailList);
  };

  const handleClickExport = async () => {
    var url = await exportMaterialReceived(receivedMaterialData.id);
    handleDownload(url);
    // showConfirmPopup({
    //   title: 'Xuất phiếu nhập vật tư',
    //   message: 'Bạn có chắc chắn muốn xuất phiếu nhập vật tư này?',
    //   action: exportMaterialReceived,
    //   payload: receivedMaterialData.id,
    //   onSuccess: (url) => handleDownload(url),
    // });
  };

  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
  };

  const handleOpenShortageDialog = () => {
    if (!receivedMaterialData.supplier_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn nhà cung cấp!');
      return;
    }
    if (!receivedMaterialData.warehouse_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn kho!');
      return;
    }
    newWindow.current = popupWindow(
      `/received/material?supplier=${receivedMaterialData.supplier_id}&warehouse=${receivedMaterialData.warehouse_id}`,
      'Vật tư'
    );
  };

  const handleChangeQuantity = (index, value) => {
    const newReceivedDetailList = [...receivedDetailList];
    // if (value > newReceivedDetailList[index].quantity_in_piece) {
    //   handleOpenSnackbar('error', 'Số lượng nhập không được lớn hơn số lượng đặt!');
    //   return;
    // }
    newReceivedDetailList[index].received_quantity_in_piece = value;
    setReceivedDetailList(newReceivedDetailList);
  };

  const handleChangeMaterial = (index, e) => {
    const { name, value } = e.target;
    const newReceivedDetailList = [...receivedDetailList];
    newReceivedDetailList[index][name] = value;
    setReceivedDetailList(newReceivedDetailList);
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setReceivedMaterialData({
      ...receivedMaterialData,
      ...selectedDocument,
    });
    setFileData({ ...fileData, id: selectedDocument?.id });
    fetchFileListData();
    const receivedDetail = selectedDocument?.received_detail;
    setReceivedDetailList(receivedDetail);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const [data, suppliers] = await Promise.all([getReceivedMaterialStatus(), getAllSupplier()]);
      setStatusList(data?.status);
      setWarehouseList(data?.warehouses);
      setSupplierList(suppliers);
    };
    fetchData();
  }, []);

  const isDisabled = !!selectedDocument?.id;
  const isCompleted = !!selectedDocument?.status?.includes('COMPLETED');
  const isWorkOrder = !!receivedDetailList[0]?.customer_order_code;

  useEffect(() => {
    if (materialReceived === selectedDocument?.order_detail) return;
    const newMaterial = materialReceived.map((item) => {
      return {
        ...item,
        received_id: selectedDocument?.id || '',
        material_order_id: item.requisition_id,
        customer_order_code: item.order_code,
        customer_order_date: item.order_date,
        requisition_order_detail_id: item.id,
      };
    });
    setReceivedDetailList(newMaterial);
  }, [materialReceived]);

  return (
    <React.Fragment>
      <FirebaseUpload
        open={dialogUpload.open || false}
        onSuccess={setURL}
        onClose={handleCloseDiaLog}
        type="image"
        folder="receivedMaterial"
      />
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
              {selectedDocument?.id ? 'Cập nhật Phiếu nhập vật tư theo nhà cung cấp' : 'Tạo mới Phiếu nhập vật tư theo nhà cung cấp'}
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
                          <div className={classes.tabItemLabel}>Nhập vật tư</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={2} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Mã phiếu<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="received_code"
                                type="text"
                                size="small"
                                disabled={isDisabled}
                                value={receivedMaterialData.received_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Tên phiếu nhập<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={receivedMaterialData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Ngày nhận hàng<sup className="required-star">*</sup>
                              </span>
                              <DatePicker
                                date={receivedMaterialData.received_date}
                                onChange={(date) => setReceivedMaterialData({ ...receivedMaterialData, received_date: date })}
                                disabled={isDisabled}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Người nhận hàng<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="received_by"
                                type="text"
                                size="small"
                                value={receivedMaterialData.received_by || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Nhà cung cấp<sup className="required-star">*</sup>
                              </span>
                              <Autocomplete
                                options={supplierList}
                                size="small"
                                getOptionLabel={(option) => option.title}
                                onChange={(event, newValue) => {
                                  setReceivedMaterialData({
                                    ...receivedMaterialData,
                                    supplier_id: newValue?.id || '',
                                    supplier_name: newValue?.title || '',
                                  });
                                }}
                                disabled={isDisabled}
                                value={supplierList?.find((item) => item.id === receivedMaterialData.supplier_id) || null}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Nhà kho<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                name="warehouse_id"
                                variant="outlined"
                                select
                                disabled={isDisabled}
                                size="small"
                                value={receivedMaterialData.warehouse_id || ''}
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
                              <span className={classes.tabItemLabelField}>
                                Người giao hàng<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="handled_by"
                                type="text"
                                size="small"
                                value={receivedMaterialData.handled_by || ''}
                                onChange={handleChanges}
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
                                value={receivedMaterialData.status || ''}
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
                              <span className={classes.tabItemLabelField}>Ghi chú</span>
                              <TextField
                                fullWidth
                                multiline
                                minRows={1}
                                variant="outlined"
                                name="notes"
                                type="text"
                                size="small"
                                value={receivedMaterialData.notes || ''}
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
                          <div className={classes.tabItemLabel}>Danh sách vật tư</div>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table size="small" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  {isWorkOrder && <TableCell align="left">Mã đơn hàng</TableCell>}
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">Mã hợp đồng</TableCell>
                                  <TableCell align="left">Giá(VND)</TableCell>
                                  <TableCell align="left">SL đặt</TableCell>
                                  <TableCell align="left">SL đã nhập</TableCell>
                                  <TableCell align="left">SL còn lại</TableCell>
                                  <TableCell align="left">SL nhập</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  {isWorkOrder && <TableCell align="left">Ngày sản xuất</TableCell>}
                                  <TableCell align="left">Ghi chú</TableCell>
                                  {!isCompleted && <TableCell align="center">Xoá</TableCell>}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {receivedDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    {isWorkOrder && (
                                      <TableCell align="left" style={{ width: '10%' }}>
                                        {row.customer_order_code}
                                      </TableCell>
                                    )}
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.part_code}
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '20%' }}>
                                      <Tooltip title={row?.part_name}>
                                        <span>{row?.part_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.contract_code}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      <FormattedNumber value={row.unit_price || 0} />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      <FormattedNumber value={row.quantity_in_piece || 0} />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      <FormattedNumber value={row.entered_quantity_in_piece || 0} />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      <FormattedNumber value={row.remain_quantity_in_piece || 0} />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                          inputComponent: NumberFormatCustom,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="received_quantity_in_piece"
                                        size="small"
                                        value={row?.received_quantity_in_piece || ''}
                                        disabled={isCompleted}
                                        onChange={(e) => handleChangeQuantity(index, e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    {isWorkOrder && (
                                      <TableCell align="left" style={{ width: '10%' }}>
                                        {row.customer_order_date ? formatDate(new Date(row.customer_order_date), 'dd/MM/yyyy') : ''}
                                      </TableCell>
                                    )}
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <TextField
                                        multiline
                                        minRows={1}
                                        fullWidth
                                        variant="outlined"
                                        name="notes"
                                        type="text"
                                        size="small"
                                        value={row.notes || ''}
                                        onChange={(e) => handleChangeMaterial(index, e)}
                                      />
                                    </TableCell>
                                    {!isCompleted && (
                                      <TableCell align="center" style={{ width: '5%' }}>
                                        <IconButton onClick={() => handleDeleteMaterial(index, row.id)}>
                                          <Delete />
                                        </IconButton>
                                      </TableCell>
                                    )}
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
                    folder="File Import/Delivery_Material"
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
                {exportButton && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleClickExport}>
                    {exportButton.text}
                  </Button>
                )}
                {saveButton && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    {saveButton.text}
                  </Button>
                )}
                {!selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleOpenShortageDialog}>
                    Danh sách vật tư
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

export default ReceivedMaterialModal;
