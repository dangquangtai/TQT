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
import { AccountCircleOutlined as AccountCircleOutlinedIcon, Delete, Today as TodayIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import {
  FLOATING_MENU_CHANGE,
  SNACKBAR_OPEN,
  DOCUMENT_CHANGE,
  CONFIRM_CHANGE,
  CLOSE_MODAL_MATERIAL,
  SET_MATERIAL,
} from './../../../../store/actions';
import FirebaseUpload from './../../../FloatingMenu/FirebaseUpload/index';
import DatePicker from './../../../../component/DatePicker/index';
import {
  createPurchaseMaterial,
  deletePurchaseMaterialDetail,
  getPurchaseMaterialStatus,
  updatePurchaseMaterial,
} from './../../../../services/api/Material/Purchase';
import { popupWindow } from '../../../../utils/helper.js';
import { getSupplierListByWorkOrder } from './../../../../services/api/Partner/Supplier';
import { format as formatDate } from 'date-fns';
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

const PurchaseMaterialModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const { materialBuy } = useSelector((state) => state.material);
  const saveButton = formButtons.find((button) => button.name === view.purchaseMaterial.detail.save);
  const { purchaseMaterialDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [purchaseMaterialData, setPurchaseMaterialData] = useState({
    order_date: new Date(),
    delivery_date: new Date(),
    is_workorer: true,
    notes: '',
  });
  const [supplier, setSupplier] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });

  const [materialList, setMaterialList] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const newWindow = React.useRef(null);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, purchaseMaterialDocument: false });
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
    dispatch({ type: SET_MATERIAL, payload: [] });
    setPurchaseMaterialData({ order_date: new Date(), delivery_date: new Date(), is_workorer: true });
    setMaterialList([]);
    setTabIndex(0);
  };
  const setURL = (image) => {
    if (dialogUpload.type === 'image') {
      setPurchaseMaterialData({ ...purchaseMaterialData, image_url: image });
    } else if (dialogUpload.type === 'banner') {
      setPurchaseMaterialData({ ...purchaseMaterialData, banner_url: image });
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
        await updatePurchaseMaterial({ ...purchaseMaterialData, order_detail: materialList });
        handleOpenSnackbar('success', 'Cập nhật Đơn hàng thành công!');
      } else {
        await createPurchaseMaterial({ ...purchaseMaterialData, order_detail: materialList });
        handleOpenSnackbar('success', 'Tạo mới Đơn hàng thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'purchaseMaterial' });
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
    setPurchaseMaterialData({ ...purchaseMaterialData, [name]: value });
  };

  const handleChangeMaterial = (index, e) => {
    const { name, value } = e.target;
    const newMaterialList = [...materialList];
    newMaterialList[index] = { ...newMaterialList[index], [name]: value };
    setMaterialList(newMaterialList);
  };

  const handleDeleteMaterial = (index, id) => {
    if (id) {
      showConfirmPopup({
        title: 'Xóa vật tư',
        message: 'Bạn có chắc chắn muốn xóa vật tư này?',
        action: deletePurchaseMaterialDetail,
        payload: id,
        onSuccess: () => {
          const newMaterialList = [...materialList];
          newMaterialList.splice(index, 1);
          setMaterialList(newMaterialList);
        },
      });
    } else {
      const newMaterialList = [...materialList];
      newMaterialList.splice(index, 1);
      setMaterialList(newMaterialList);
    }
  };

  const handleOpenShortageDialog = () => {
    if (!purchaseMaterialData.supplier_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn nhà cung cấp!');
      return;
    }
    if (!purchaseMaterialData.warehouse_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn kho!');
      return;
    }
    newWindow.current = popupWindow(
      `/dashboard/material?supplier=${purchaseMaterialData.supplier_id}&warehouse=${purchaseMaterialData.warehouse_id}`,
      'Vật tư thiếu'
    );
  };

  const handleChangeSupplier = (e) => {
    setMaterialList([]);
    dispatch({ type: CLOSE_MODAL_MATERIAL });
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setPurchaseMaterialData({
      ...purchaseMaterialData,
      ...selectedDocument,
    });
    setMaterialList(selectedDocument?.order_detail);
    dispatch({ type: SET_MATERIAL, payload: selectedDocument?.order_detail });
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const supplier = await getSupplierListByWorkOrder();
      setSupplier(supplier);
      const { warehouse_list, status_list } = await getPurchaseMaterialStatus();
      setStatusList(status_list);
      setWarehouseList(warehouse_list);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (materialBuy === selectedDocument?.order_detail) return;
    const newMaterial = materialBuy.map((item) => {
      return {
        ...item,
        material_daily_requisition_id: item.id,
        requisition_id: selectedDocument?.id || '',
        id: '',
        notes: '',
      };
    });
    setMaterialList(newMaterial);
  }, [materialBuy]);

  useEffect(() => {
    window.onbeforeunload = function (event) {
      handleCloseDialog();
    };
  }, []);

  return (
    <React.Fragment>
      <FirebaseUpload
        open={dialogUpload.open || false}
        onSuccess={setURL}
        onClose={handleCloseDiaLog}
        type="image"
        folder="PurchaseMaterial"
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
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Mua vật tư</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={3} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã đơn hàng(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="order_code"
                                type="text"
                                size="small"
                                value={purchaseMaterialData.order_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Tên đơn hàng(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={purchaseMaterialData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày lập đơn hàng(*):</span>
                              <DatePicker
                                date={purchaseMaterialData.order_date}
                                onChange={(date) => setPurchaseMaterialData({ ...purchaseMaterialData, order_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày giao hàng(*):</span>
                              <DatePicker
                                date={purchaseMaterialData.delivery_date}
                                onChange={(date) => setPurchaseMaterialData({ ...purchaseMaterialData, delivery_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Nhà cung cấp(*):</span>
                              <Autocomplete
                                id="combo-box-demo"
                                options={supplier}
                                getOptionLabel={(option) => option.title || ''}
                                fullWidth
                                size="small"
                                value={supplier?.find((item) => item.id === purchaseMaterialData.supplier_id) || null}
                                onChange={(event, newValue) => {
                                  setPurchaseMaterialData({
                                    ...purchaseMaterialData,
                                    supplier_id: newValue?.id,
                                    supplier_name: newValue?.title,
                                  });
                                  handleChangeSupplier();
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
                                value={purchaseMaterialData.warehouse_id || ''}
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
                                value={purchaseMaterialData.status || ''}
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
                                value={purchaseMaterialData.notes || ''}
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
                          {/* <Tooltip title="Thêm vật tư">
                            <IconButton onClick={handleAddMaterial}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip> */}
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table className={classes.tableSmall} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã đơn hàng</TableCell>
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">SL cần</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Ngày sản xuất</TableCell>
                                  <TableCell align="left">Ghi chú</TableCell>
                                  <TableCell align="center">Xoá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {materialList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      {row?.order_code}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <Tooltip title={row?.part_code}>
                                        <span>{row?.part_code}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '25%' }}>
                                      <Tooltip title={row?.part_name}>
                                        <span>{row?.part_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.quantity_in_piece}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.order_date ? formatDate(new Date(row.order_date), 'dd/MM/yyyy') : ''}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '25%' }}>
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
              <Grid item className={classes.gridItemInfoButtonWrap}>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              <Grid item className={classes.gridItemInfoButtonWrap}>
                <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleOpenShortageDialog}>
                  Chi tiết vật tư thiếu
                </Button>
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

export default PurchaseMaterialModal;
