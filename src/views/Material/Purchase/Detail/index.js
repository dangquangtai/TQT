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
import { getAllSupplier } from '../../../../services/api/Partner/Supplier.js';
import { createPurchaseMaterial, updatePurchaseMaterial } from './../../../../services/api/Material/Purchase';

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

const PurchaseMaterialModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const { materials } = useSelector((state) => state.metadata);
  const saveButton = formButtons.find((button) => button.name === view.purchaseMaterial.detail.save);
  const { purchaseMaterialDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [purchaseMaterialData, setPurchaseMaterialData] = useState({ order_date: new Date() });
  const [supplier, setSupplier] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [statusList, setStatusList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });

  const [materialList, setMaterialList] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, PurchaseMaterialDocument: false });
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
    setPurchaseMaterialData({ PurchaseMaterial_date: new Date() });
    setMaterialList([]);
    setSelectedSupplier({});
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

  const handleAddMaterial = () => {
    setMaterialList([
      {
        requisition_id: selectedDocument?.id || '',
        id: '',
        part_id: '',
        part_name: '',
        part_code: '',
        supplier_id: '',
        supplier_name: '',
        category_id: '',
        category_name: '',
        status: '',
        unit_id: '',
        unit_name: '',
        quantity_in_piece: 0,
      },
      ...materialList,
    ]);
  };

  const handleChangeMaterialCode = (index, newItem) => {
    const newMaterialList = [...materialList];
    const newMaterial = {
      part_id: newItem?.id || '',
      part_code: newItem?.part_code || '',
      part_name: newItem?.title || '',
      category_id: newItem?.category_id || '',
      category_name: newItem?.category_name || '',
      supplier_id: newItem?.supplier_id || '',
      unit_id: newItem?.unit_id || '',
      unit_name: newItem?.unit_name || '',
    };
    newMaterialList[index] = { ...newMaterialList[index], ...newMaterial };
    setMaterialList(newMaterialList);
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
        action: '',
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

  useEffect(() => {
    if (!selectedDocument) return;
    setPurchaseMaterialData({
      ...purchaseMaterialData,
      ...selectedDocument,
    });
    setMaterialList(selectedDocument?.order_detail);
    setSelectedSupplier(supplier.find((item) => item.id === selectedDocument.supplier_id));
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const supplier = await getAllSupplier();
      setSupplier(supplier);
    };
    fetchData();
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
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Mua vật tư</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={3} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã đơn hàng:</span>
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
                              <span className={classes.tabItemLabelField}>Tên đơn hàng:</span>
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
                              <span className={classes.tabItemLabelField}>Ngày lập đơn hàng:</span>
                              <DatePicker
                                date={purchaseMaterialData.order_date}
                                onChange={(date) =>
                                  setPurchaseMaterialData({ ...purchaseMaterialData, order_date: date })
                                }
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày giao hàng:</span>
                              <DatePicker
                                date={purchaseMaterialData.expected_deliver_date}
                                onChange={(date) =>
                                  setPurchaseMaterialData({ ...purchaseMaterialData, expected_deliver_date: date })
                                }
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Nhà cung cấp:</span>
                              <Autocomplete
                                id="combo-box-demo"
                                options={supplier}
                                getOptionLabel={(option) => option.title || ''}
                                fullWidth
                                size="small"
                                value={selectedSupplier || null}
                                onChange={(event, newValue) => {
                                  setSelectedSupplier(newValue);
                                  setPurchaseMaterialData({ ...purchaseMaterialData, supplier_id: newValue?.id });
                                }}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Trạng thái:</span>
                              <TextField
                                fullWidth
                                name="PurchaseMaterial_status"
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
                                value={purchaseMaterialData.notes || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={5} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Vật tư thiếu</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}></Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={7} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Danh sách vật tư</div>
                          <Tooltip title="Thêm vật tư">
                            <IconButton onClick={handleAddMaterial}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">SL cần</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  {/* {selectedDocument?.id && <TableCell align="left">Trạng thái</TableCell>} */}
                                  <TableCell align="left">Ghi chú</TableCell>
                                  <TableCell align="center">Xoá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {materialList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ minWidth: '200px' }}>
                                      <Autocomplete
                                        options={materials}
                                        getOptionLabel={(option) => option.part_code || ''}
                                        fullWidth
                                        size="small"
                                        value={materials.find((item) => item.part_code === row.part_code) || null}
                                        onChange={(event, newValue) => handleChangeMaterialCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell}>
                                      <Tooltip title={row?.part_name}>
                                        <span>{row?.part_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ maxWidth: '130px' }}>
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
                                    <TableCell align="left">{row.unit_name}</TableCell>
                                    {/* {selectedDocument?.id && <TableCell align="left">{row.status_display}</TableCell>} */}
                                    <TableCell align="left">
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
                                    <TableCell align="center">
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

export default PurchaseMaterialModal;
