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
import { AttachFileOutlined, Delete, DescriptionOutlined, HistoryOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { AddCircleOutline } from '@material-ui/icons';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import FirebaseUpload from './../../../FloatingMenu/FirebaseUpload/index';
import DatePicker from './../../../../component/DatePicker/index';

import {
  createDeliveryMaterial,
  deleteDeliveryMaterialDetail,
  getDeliveryMaterialData,
  getInventoryByPartID,
  getInventoryBySupplier,
  updateDeliveryMaterial,
} from '../../../../services/api/Material/DailyRequisitionMaterial';
import { createFileAttachment, deleteFileAttachment, getListFile } from '../../../../services/api/Attachment/FileAttachment';
import ActivityLog from '../../../../component/ActivityLog/index.js';

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

const DeliveryMaterialModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const { materials } = useSelector((state) => state.metadata);
  const saveButton = formButtons.find((button) => button.name === view.dailyDeliveryMateial.detail.save);
  const { dailyMaterialRequitisionDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const returnIcon = [];
  const [deliveryMaterialData, setDeliveryMaterialData] = useState({
    order_date: new Date(),
    notes: '',
  });
  const [materialOrderDetailList, setMaterialOrderDetailList] = useState([]);
  const [deliveryDetailList, setDeliveryDetailList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [listFileData, setListFileData] = useState([]);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, dailyMaterialRequitisionDocument: false });
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
    setDeliveryMaterialData({ order_date: new Date(), notes: '' });
    setDeliveryDetailList([]);
    setMaterialOrderDetailList([]);
    setListFileData([]);
    setFileData([]);
    setTabIndex(0);
  };
  const setURL = async (fileDataInput) => {
    console.log(fileDataInput?.file_name);
    const newFileData = { ...fileData, file_name: fileDataInput?.file_name, url: fileDataInput?.url };
    setFileData(newFileData);
    const res = await createFileAttachment(newFileData);
    if (res) fetchFileListData();
  };

  const handleCloseDiaLog = () => {
    setDialogUpload({
      open: false,
      type: '',
    });
  };
  const closeFirebaseDialog = () => {
    setIsOpenUpload(false);
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        await updateDeliveryMaterial({ ...deliveryMaterialData, detail_list: deliveryDetailList });

        handleOpenSnackbar('success', 'Cập nhật Phiếu xuất vật tư thành công!');
      } else {
        await createDeliveryMaterial({ ...deliveryMaterialData, detail_list: deliveryDetailList });
        handleOpenSnackbar('success', 'Tạo mới Phiếu xuất vật tư thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'deliveryMaterial' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
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
  const showConfirmPopup = ({ title = 'Thông báo', message = '', action = null, payload = null, onSuccess = null }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setDeliveryMaterialData({ ...deliveryMaterialData, [name]: value });
  };
  const handleOpenDiaLog = () => {
    setIsOpenUpload(true);
  };
  const handleAddReceivedDetail = () => {
    setDeliveryDetailList([
      {
        material_order_id: '',
        id: '',
        part_id: '',
        part_name: '',
        part_code: '',
        // category_id: '',
        category_name: '',
        unit_id: '',
        unit_name: '',
        quantity_in_piece: 0,
        supplier_id: '',
        supplier_name: '',
        notes: '',
      },
      ...deliveryDetailList,
    ]);
    setMaterialOrderDetailList([[], ...materialOrderDetailList]);
  };
  const handleChangePartCode = async (index, newPartCode) => {
    document.getElementById('autoSupplier').value = '';
    const newReceivedDetailList = [...deliveryDetailList];
    newReceivedDetailList[index] = {
      ...newReceivedDetailList[index],
      material_order_id: newPartCode?.part_id,
      part_id: newPartCode?.id,
      part_code: newPartCode?.part_code,
      part_name: newPartCode?.title,
      unit_id: newPartCode?.unit_id,
      unit_name: newPartCode?.unit_name,
      category_id: newPartCode?.category_id,
      category_name: newPartCode?.category_name,
      warehouse_quantity_in_piece: 0,
      supplier_id: '',
      supplier_name: '',
    };
    setDeliveryDetailList(newReceivedDetailList);
    const newOrderPartList = [...materialOrderDetailList];
    if (deliveryDetailList.filter((item) => item.material_order_id === newPartCode?.id).length >= 1) {
      const indexMaterial = deliveryDetailList.findIndex((item) => item.material_order_id === newPartCode?.id);
      newOrderPartList[index] = materialOrderDetailList[indexMaterial];
      setMaterialOrderDetailList(newOrderPartList);
    } else {
      const partList = await getInventoryByPartID(newPartCode?.id);
      newOrderPartList[index] = partList;
      setMaterialOrderDetailList(newOrderPartList);
    }
  };

  const handleChangeSupplierCode = (index, newItem) => {
    const newMaterialList = [...deliveryDetailList];
    const newMaterial = {
      warehouse_quantity_in_piece: newItem?.quantity_in_piece || 0,
      supplier_id: newItem?.supplier_id || '',
      supplier_name: newItem?.supplier_name || '',
    };
    newMaterialList[index] = { ...newMaterialList[index], ...newMaterial };
    if (
      deliveryDetailList?.some((item) => item.part_id === newMaterialList[index].part_id) &&
      deliveryDetailList?.some((item) => item.supplier_id === newItem?.supplier_id)
    ) {
      handleOpenSnackbar('error', 'Vật tư đã tồn tại!');
      return;
    }
    setDeliveryDetailList(newMaterialList);
  };
  const getPartListByReceivedDetail = async (detail_list) => {
    const newMaterialOrderDetailList = [];
    for (const [index, item] of detail_list.entries()) {
      const checkReceivedDetail = [...detail_list].slice(0, index);
      let parts = [];
      if (checkReceivedDetail?.some((check) => check.supplier_id === item?.supplier_id)) {
        const indexPartList = checkReceivedDetail?.findIndex((check) => check.supplier_id === item?.supplier_id);
        parts = newMaterialOrderDetailList[indexPartList];
      } else parts = await getInventoryByPartID(item?.part_id);
      newMaterialOrderDetailList.push(parts);
    }
    setMaterialOrderDetailList(newMaterialOrderDetailList);
  };

  const handleChangeQuantityDelivery = (index, e) => {
    const { name, value } = e.target;
    const newdeliveryDetailList = [...deliveryDetailList];

    let quantity = newdeliveryDetailList[index].warehouse_quantity_in_piece;
    if (value < 0) {
      handleOpenSnackbar('error', 'Không được nhỏ hơn 0 !');
      return;
    } else if (value <= quantity) {
      newdeliveryDetailList[index] = { ...newdeliveryDetailList[index], [name]: value };
      setDeliveryDetailList(newdeliveryDetailList);
      console.log('ok!!!');
    } else {
      console.log('Not ok!!!');
      handleOpenSnackbar('error', 'Không được lớn hơn số lượng trong kho!');
      e.target.value = quantity;
      return;
    }
  };

  const handleDeleteMaterial = (index, id) => {
    if (id) {
      showConfirmPopup({
        title: 'Xóa vật tư',
        message: 'Bạn có chắc chắn muốn xóa vật tư này?',
        action: deleteDeliveryMaterialDetail,
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
    const newdeliveryDetailList = [...deliveryDetailList];
    newdeliveryDetailList.splice(index, 1);
    setDeliveryDetailList(newdeliveryDetailList);
    const newMaterialOrderDetailList = [...materialOrderDetailList];
    newMaterialOrderDetailList.splice(index, 1);
    setMaterialOrderDetailList(newMaterialOrderDetailList);
  };

  const handleChangeNotes = (index, e) => {
    const { name, value } = e.target;
    const newdeliveryDetailList = [...deliveryDetailList];
    newdeliveryDetailList[index] = { ...newdeliveryDetailList[index], [name]: value };
    setDeliveryDetailList(newdeliveryDetailList);
  };

  // const returnFileIcon = (fileList) => {
  //   if (fileData) {
  //     fileList.map((file, index) => {
  //       returnIcon.push(
  //         <Grid item xs={2}>
  //           <div style={{ display: 'flex' }}>
  //             <div className={classes.tabItem}>
  //               <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
  //                 <div>
  //                   {' '}
  //                   <img src={file.banner_url} alt="" style={{ width: 70, paddingTop: 10 }} />
  //                 </div>

  //                 <div style={{ textAlign: 'center' }}>{file.file_name}</div>
  //                 <div>
  //                   <a href={file.download_url} target="__blank" style={{ marginRight: 10 }}>
  //                     Tải xuống
  //                   </a>
  //                   <a onClick={handleDeleteFile(file.id)} style={{ textDecoration: 'underline' }}>
  //                     Xóa
  //                   </a>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </Grid>
  //       );
  //     });
  //     console.log(returnIcon);
  //   }

  //   return returnIcon;
  // };
  const fetchFileListData = async () => {
    const fileList = await getListFile(selectedDocument?.id);
    setListFileData(fileList);
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setDeliveryMaterialData({
      ...deliveryMaterialData,
      ...selectedDocument,
    });

    setFileData({ ...fileData, id: selectedDocument?.id });
    fetchFileListData();
    setDeliveryDetailList(selectedDocument?.detail_list);
    getPartListByReceivedDetail(selectedDocument?.detail_list);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const orders = await getInventoryBySupplier(deliveryMaterialData.supplier_id);
      setMaterialOrderDetailList(orders);
    };
    if (deliveryMaterialData.supplier_id) fetchData();
  }, [deliveryMaterialData.supplier_id]);

  useEffect(() => {
    const fetchData = async () => {
      const { status, warehouses } = await getDeliveryMaterialData();
      setStatusList(status);
      setWarehouseList(warehouses);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <FirebaseUpload
        open={isOpenUpload || false}
        onSuccess={setURL}
        onClose={closeFirebaseDialog}
        type="other"
        folder="File Import/Delivery_Material"
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
              {selectedDocument?.id ? 'Cập nhật Phiếu xuất kho vật tư' : 'Tạo mới Xuất kho nhập vật tư'}
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
                        <HistoryOutlined />
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
                          <div className={classes.tabItemLabel}>Xuất kho vật tư</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={2} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã phiếu(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="order_code"
                                type="text"
                                size="small"
                                value={deliveryMaterialData.order_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Tên phiếu nhập(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={deliveryMaterialData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày nhận hàng(*):</span>
                              <DatePicker
                                date={deliveryMaterialData.received_date}
                                onChange={(date) => setDeliveryMaterialData({ ...deliveryMaterialData, order_date: date })}
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
                                value={deliveryMaterialData.warehouse_id || ''}
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
                                value={deliveryMaterialData.status || ''}
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
                                value={deliveryMaterialData.notes || ''}
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
                          <Tooltip title="Thêm vật tư">
                            <IconButton onClick={handleAddReceivedDetail}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Nhà cung cấp</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">Tồn kho</TableCell>
                                  <TableCell align="left">SL xuất</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Ghi chú</TableCell>
                                  <TableCell align="center">Xoá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {deliveryDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <Autocomplete
                                        options={materials}
                                        getOptionLabel={(option) => option.part_code || ''}
                                        fullWidth
                                        size="small"
                                        value={materials?.find((item) => item.id === deliveryDetailList[index].part_id) || null}
                                        onChange={(event, newValue) => handleChangePartCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <Autocomplete
                                        options={materialOrderDetailList[index] || []}
                                        getOptionLabel={(option) => option.supplier_name || ''}
                                        fullWidth
                                        id="autoSupplier"
                                        blurOnSelect={true}
                                        size="small"
                                        value={materialOrderDetailList[index]?.find((item) => item.supplier_id === row.supplier_id) || null}
                                        onChange={(event, newValue) => handleChangeSupplierCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '25%' }}>
                                      <Tooltip title={row?.part_name}>
                                        <span>{row?.part_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.warehouse_quantity_in_piece === undefined ? '' : String(row.warehouse_quantity_in_piece)}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="quantity_in_piece"
                                        type="number"
                                        size="small"
                                        value={row?.quantity_in_piece || ''}
                                        onChange={(e) => handleChangeQuantityDelivery(index, e)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '20%' }}>
                                      <TextField
                                        fullWidth
                                        multiline
                                        minRows={1}
                                        variant="outlined"
                                        name="notes"
                                        type="text"
                                        size="small"
                                        value={row?.notes || ''}
                                        onChange={(e) => handleChangeNotes(index, e)}
                                      />
                                    </TableCell>
                                    <TableCell align="center" style={{ width: '5%' }}>
                                      <IconButton onClick={() => handleDeleteMaterial(index, row.id)}>
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

export default DeliveryMaterialModal;
