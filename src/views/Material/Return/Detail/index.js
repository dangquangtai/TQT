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
  Tooltip,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History, AttachFileOutlined, DescriptionOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CLOSE_MODAL_MATERIAL } from './../../../../store/actions';
import DatePicker from './../../../../component/DatePicker/index';
import {
  createReturnMaterial,
  updateReturnMaterial,
  getReturnMaterialData,
  exportReturnMaterial,
} from './../../../../services/api/Material/Return';
import { getAllSupplier } from '../../../../services/api/Partner/Supplier.js';
import BrokenModal from './../../../Dialog/Broken/index';
import { downloadFile, popupWindow } from './../../../../utils/helper';
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

const ReturnMaterialModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const saveButton = formButtons.find((button) => button.name === view.materialReturn.detail.save);
  const { returnMaterialDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [returnMaterialData, setReturnMaterialData] = useState({
    order_date: new Date(),
    notes: '',
  });
  const [returnDetailList, setReturnDetailList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [brokenModal, setBrokenModal] = useState({
    open: false,
    index: null,
    list: [],
  });
  const newWindow = React.useRef(null);
  const { materialReturn } = useSelector((state) => state.material);

  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, returnMaterialDocument: false });
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
    setReturnMaterialData({ order_date: new Date(), notes: '' });
    setReturnDetailList([]);
    setTabIndex(0);
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        await updateReturnMaterial({ ...returnMaterialData, detail_list: returnDetailList });
        handleOpenSnackbar('success', 'Cập nhật Phiếu hoàn trả vật tư!');
      } else {
        await createReturnMaterial({ ...returnMaterialData, detail_list: returnDetailList });
        handleOpenSnackbar('success', 'Tạo mới Phiếu hoàn trả vật tư!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'returnMaterial' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setReturnMaterialData({ ...returnMaterialData, [name]: value });
  };

  const handleCloseBrokenModal = () => {
    setBrokenModal({ open: false, index: null, list: [] });
  };

  const handleOpenBrokenModal = (item, index) => {
    setBrokenModal({ open: true, index, list: item.broken_list || [] });
  };

  const handleSubmitBroken = (brokens, totalBroken) => {
    const newReturnDetailList = [...returnDetailList];
    newReturnDetailList[brokenModal.index] = {
      ...newReturnDetailList[brokenModal.index],
      broken_list: brokens,
      return_broken_quantity_in_piece: totalBroken,
    };
    setReturnDetailList(newReturnDetailList);
    handleCloseBrokenModal();
  };

  const handleClickExport = async () => {
    var url = await exportReturnMaterial(returnMaterialData.id);
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
  };

  const handleReturnQuantity = (e, index) => {
    const { name, value } = e.target;
    const newReturnDetailList = [...returnDetailList];
    if (name === 'return_quantity_in_piece' && value > newReturnDetailList[index].quantity_in_piece) {
      handleOpenSnackbar('error', 'Số lượng hoàn trả không được lớn hơn số lượng trong kho!');
      return;
    }
    newReturnDetailList[index][name] = value;
    setReturnDetailList(newReturnDetailList);
  };

  const handleChangeMaterial = (index, e) => {
    const { name, value } = e.target;
    const newReturnDetailList = [...returnDetailList];
    newReturnDetailList[index] = { ...newReturnDetailList[index], [name]: value };
    setReturnDetailList(newReturnDetailList);
  };

  const handleOpenDialog = () => {
    if (!returnMaterialData.supplier_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn nhà cung cấp!');
      return;
    }
    if (!returnMaterialData.warehouse_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn kho!');
      return;
    }
    newWindow.current = popupWindow(
      `/return/material?supplier=${returnMaterialData.supplier_id}&warehouse=${returnMaterialData.warehouse_id}`,
      'Vật tư'
    );
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setReturnMaterialData({
      ...returnMaterialData,
      ...selectedDocument,
    });
    const returnDetail = selectedDocument?.detail_list;
    setReturnDetailList(returnDetail);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const [data, suppliers] = await Promise.all([getReturnMaterialData(), getAllSupplier()]);
      setStatusList(data?.status);
      setWarehouseList(data?.warehouses);
      setSupplierList(suppliers);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (selectedDocument?.id) return;
  //   if (!returnMaterialData.supplier_id) return;
  //   if (!returnMaterialData.warehouse_id) return;
  //   const fetchData = async () => {
  //     const res = await getMaterialBrokenList(returnMaterialData.warehouse_id, returnMaterialData.supplier_id);
  //     setReturnDetailList(res);
  //   };
  //   fetchData();
  // }, [returnMaterialData.supplier_id, returnMaterialData.warehouse_id]);

  useEffect(() => {
    if (materialReturn === selectedDocument?.detail_list) return;
    const newMaterial = materialReturn.map((item) => {
      return {
        ...item,
      };
    });
    setReturnDetailList(newMaterial);
  }, [materialReturn]);

  const isDisabled = !!selectedDocument?.id;
  const isDisabledSave = selectedDocument?.status === 'STATUS_COMPLETED';

  return (
    <React.Fragment>
      <BrokenModal
        isOpen={brokenModal.open}
        isDisabled={true}
        handleSubmit={handleSubmitBroken}
        handleClose={handleCloseBrokenModal}
        list={brokenModal.list}
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
              {selectedDocument?.id ? 'Cập nhật Phiếu hoàn trả vật tư' : 'Tạo mới Phiếu hoàn trả vật tư'}
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
                                name="order_code"
                                type="text"
                                size="small"
                                disabled={isDisabled}
                                value={returnMaterialData.order_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Tên phiếu<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={returnMaterialData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Ngày xuất kho<sup className="required-star">*</sup>
                              </span>
                              <DatePicker
                                disabled={isDisabledSave}
                                date={returnMaterialData.order_date}
                                onChange={(date) => setReturnMaterialData({ ...returnMaterialData, order_date: date })}
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
                                value={returnMaterialData.status || ''}
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
                              <span className={classes.tabItemLabelField}>
                                Nhà cung cấp<sup className="required-star">*</sup>
                              </span>
                              <Autocomplete
                                options={supplierList}
                                size="small"
                                disabled={isDisabled}
                                getOptionLabel={(option) => option.title}
                                onChange={(event, newValue) => {
                                  setReturnMaterialData({
                                    ...returnMaterialData,
                                    supplier_id: newValue?.id || '',
                                    supplier_name: newValue?.title || '',
                                  });
                                }}
                                value={supplierList?.find((item) => item.id === returnMaterialData.supplier_id) || null}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Nhà kho<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                disabled={isDisabled}
                                name="warehouse_id"
                                variant="outlined"
                                select
                                size="small"
                                value={returnMaterialData.warehouse_id || ''}
                                onChange={handleChanges}
                              >
                                {warehouseList?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            {/* <Grid item lg={6} md={6} xs={6}>
                              <span className={classes.tabItemLabelField}>Ghi chú</span>
                              <TextField
                                fullWidth
                                multiline
                                minRows={1}
                                variant="outlined"
                                name="notes"
                                type="text"
                                size="small"
                                value={returnMaterialData.notes || ''}
                                onChange={handleChanges}
                              />
                            </Grid> */}
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
                            <Table aria-label="simple table" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">SL A</TableCell>
                                  <TableCell align="left">SL B</TableCell>
                                  <TableCell align="left">SL A</TableCell>
                                  <TableCell align="left">SL B</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Hỏng</TableCell>
                                  <TableCell align="left">Ghi chú</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {returnDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '20%' }}>
                                      {row.part_code}
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '25%' }}>
                                      <Tooltip title={row?.part_name}>
                                        <span>{row?.part_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.quantity_in_piece}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.total_broken_quantity_in_piece}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="return_quantity_in_piece"
                                        type="number"
                                        size="small"
                                        value={row.return_quantity_in_piece || ''}
                                        onChange={(e) => handleReturnQuantity(e, index)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="return_broken_quantity_in_piece"
                                        type="number"
                                        size="small"
                                        disabled
                                        value={row.return_broken_quantity_in_piece || ''}
                                        onChange={(e) => handleReturnQuantity(e, index)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{ width: '5%', cursor: 'pointer', textDecoration: 'underline' }}
                                      onClick={() => handleOpenBrokenModal(row, index)}
                                    >
                                      Chi tiết
                                    </TableCell>
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
                                        onChange={(e) => handleReturnQuantity(e, index)}
                                      />
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
                {selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleClickExport}>
                    In phiếu
                  </Button>
                )}
                {saveButton && selectedDocument?.id && (
                  <Button
                    disabled={isDisabledSave}
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={handleSubmitForm}
                  >
                    {saveButton.text}
                  </Button>
                )}
                {!selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleOpenDialog}>
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

export default ReturnMaterialModal;
