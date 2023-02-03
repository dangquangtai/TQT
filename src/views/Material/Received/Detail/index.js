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
import { AccountCircleOutlined as AccountCircleOutlinedIcon, Delete, Today as TodayIcon } from '@material-ui/icons';
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
  createReceivedMaterial,
  deleteReceivedMaterialDetail,
  getReceivedMaterialStatus,
  updateReceivedMaterial,
} from './../../../../services/api/Material/Received';
import { getPurchaseMaterialByOrder, getPurchaseMaterialList } from '../../../../services/api/Material/Purchase.js';
import { getAllSupplier } from '../../../../services/api/Partner/Supplier.js';

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
  const { materials } = useSelector((state) => state.metadata);
  const saveButton = formButtons.find((button) => button.name === view.receivedMaterial.detail.save);
  const { receivedMaterialDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [receivedMaterialData, setReceivedMaterialData] = useState({
    received_date: new Date(),
    received_by: '',
    handled_by: '',
  });
  const [materialOrderList, setMaterialOrderList] = useState([]);
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

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, receivedMaterialDocument: false });
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
    setReceivedMaterialData({ received_date: new Date() });
    setReceivedDetailList([]);
    setMaterialOrderDetailList([]);
    setTabIndex(0);
  };
  const setURL = (image) => {
    if (dialogUpload.type === 'image') {
      setReceivedMaterialData({ ...receivedMaterialData, image_url: image });
    } else if (dialogUpload.type === 'banner') {
      setReceivedMaterialData({ ...receivedMaterialData, banner_url: image });
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

  const handleAddReceivedDetail = () => {
    if (!receivedMaterialData.supplier_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn nhà cung cấp!');
      return;
    }
    setReceivedDetailList([
      {
        received_id: selectedDocument?.id || '',
        material_order_id: '',
        id: '',
        part_id: '',
        part_name: '',
        part_code: '',
        category_id: '',
        category_name: '',
        unit_id: '',
        unit_name: '',
        quantity_in_piece: 0,
        supplier_id: '',
        supplier_name: '',
      },
      ...receivedDetailList,
    ]);
    setMaterialOrderDetailList([[], ...materialOrderDetailList]);
  };

  const handleChangeOrder = async (index, newOrder) => {
    const newReceivedDetailList = [...receivedDetailList];
    newReceivedDetailList[index] = {
      ...newReceivedDetailList[index],
      material_order_id: newOrder?.id,
      supplier_id: receivedMaterialData?.supplier_id,
      supplier_name: receivedMaterialData?.supplier_name,
    };
    setReceivedDetailList(newReceivedDetailList);
    const newOrderPartList = [...materialOrderDetailList];
    if (receivedDetailList.filter((item) => item.material_order_id === newOrder?.id).length >= 1) {
      const indexMaterial = receivedDetailList.findIndex((item) => item.material_order_id === newOrder?.id);
      newOrderPartList[index] = materialOrderDetailList[indexMaterial];
      setMaterialOrderDetailList(newOrderPartList);
    } else {
      const partList = await getPartListByOrder(newOrder?.id);
      newOrderPartList[index] = partList;
      setMaterialOrderDetailList(newOrderPartList);
    }
  };

  const handleChangeMaterialCode = (index, newItem) => {
    const newMaterialList = [...receivedDetailList];
    const newMaterial = {
      part_id: newItem?.part_id || '',
      part_code: newItem?.part_code || '',
      part_name: newItem?.part_name || '',
      category_id: newItem?.category_id || '',
      category_name: newItem?.category_name || '',
      unit_id: newItem?.unit_id || '',
      unit_name: newItem?.unit_name || '',
    };
    newMaterialList[index] = { ...newMaterialList[index], ...newMaterial };
    if (
      receivedDetailList?.some((item) => item.material_order_id === newItem?.requisition_id) &&
      receivedDetailList?.some((item) => item.part_id === newItem?.part_id)
    ) {
      handleOpenSnackbar('error', 'Vật tư đã tồn tại!');
      return;
    }
    setReceivedDetailList(newMaterialList);
  };

  const handleChangeMaterial = (index, e) => {
    const { name, value } = e.target;
    const newReceivedDetailList = [...receivedDetailList];
    newReceivedDetailList[index] = { ...newReceivedDetailList[index], [name]: value };
    setReceivedDetailList(newReceivedDetailList);
  };

  const handleDeleteMaterial = (index, id) => {
    if (id) {
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

  const getPartListByOrder = async (id) => {
    const parts = await getPurchaseMaterialByOrder(id);
    return parts;
  };

  const getPartListByReceivedDetail = async (receivedDetail) => {
    const newMaterialOrderDetailList = [];
    for (const [index, item] of receivedDetail.entries()) {
      const checkReceivedDetail = [...receivedDetail].slice(0, index);
      let parts = [];
      if (checkReceivedDetail?.some((check) => check.material_order_id === item?.material_order_id)) {
        const indexPartList = checkReceivedDetail?.findIndex((check) => check.material_order_id === item?.material_order_id);
        parts = newMaterialOrderDetailList[indexPartList];
      } else parts = await getPurchaseMaterialByOrder(item?.material_order_id);
      newMaterialOrderDetailList.push(parts);
    }
    setMaterialOrderDetailList(newMaterialOrderDetailList);
  };
  useEffect(() => {
    if (!selectedDocument) return;
    setReceivedMaterialData({
      ...receivedMaterialData,
      ...selectedDocument,
    });
    const receivedDetail = selectedDocument?.received_detail;
    setReceivedDetailList(receivedDetail);
    getPartListByReceivedDetail(receivedDetail);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const orders = await getPurchaseMaterialList(receivedMaterialData.supplier_id);
      setMaterialOrderList(orders);
    };
    if (receivedMaterialData.supplier_id) fetchData();
  }, [receivedMaterialData.supplier_id]);

  useEffect(() => {
    const fetchData = async () => {
      const { status, warehouses } = await getReceivedMaterialStatus();
      setStatusList(status);
      setWarehouseList(warehouses);
      const suppliers = await getAllSupplier();
      setSupplierList(suppliers);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <FirebaseUpload open={dialogUpload.open || false} onSuccess={setURL} onClose={handleCloseDiaLog} type="image" folder="receivedMaterial" />
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
              {selectedDocument?.id ? 'Cập nhật Phiếu nhập vật tư' : 'Tạo mới Phiếu nhập vật tư'}
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
                          <div className={classes.tabItemLabel}>Nhập vật tư</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={2} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã phiếu:</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="received_code"
                                type="text"
                                size="small"
                                value={receivedMaterialData.received_code || ''}
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
                                value={receivedMaterialData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày nhận hàng:</span>
                              <DatePicker
                                date={receivedMaterialData.received_date}
                                onChange={(date) => setReceivedMaterialData({ ...receivedMaterialData, received_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Người nhận hàng:</span>
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
                              <span className={classes.tabItemLabelField}>Nhà cung cấp:</span>
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
                                value={supplierList?.find((item) => item.id === receivedMaterialData.supplier_id) || null}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Người giao hàng:</span>
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
                              <span className={classes.tabItemLabelField}>Nhà kho:</span>
                              <TextField
                                fullWidth
                                name="warehouse_id"
                                variant="outlined"
                                select
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
                              <span className={classes.tabItemLabelField}>Trạng thái:</span>
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
                              <span className={classes.tabItemLabelField}>Ghi chú:</span>
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
                          <Tooltip title="Thêm vật tư">
                            <IconButton onClick={handleAddReceivedDetail}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã đơn hàng</TableCell>
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">SL nhập</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="center">Xoá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {receivedDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '20%' }}>
                                      <Autocomplete
                                        options={materialOrderList}
                                        getOptionLabel={(option) => option.order_code || ''}
                                        fullWidth
                                        size="small"
                                        value={materialOrderList?.find((item) => item.id === row.material_order_id) || null}
                                        onChange={(event, newValue) => handleChangeOrder(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '25%' }}>
                                      <Autocomplete
                                        options={materialOrderDetailList[index] || []}
                                        getOptionLabel={(option) => option.part_code || ''}
                                        fullWidth
                                        size="small"
                                        value={materialOrderDetailList[index]?.find((item) => item.part_code === row.part_code) || null}
                                        onChange={(event, newValue) => handleChangeMaterialCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '35%' }}>
                                      <Tooltip title={row?.part_name}>
                                        <span>{row?.part_name}</span>
                                      </Tooltip>
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
                                        onChange={(e) => handleChangeMaterial(index, e)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
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

export default ReceivedMaterialModal;