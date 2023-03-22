import React, { useEffect, useState } from 'react';
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
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  MenuItem,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../../store/constant';
import useView from '../../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, CONFIRM_CHANGE } from '../../../../store/actions';
import { History, DescriptionOutlined, InfoOutlined } from '@material-ui/icons';
import useStyles from './../../../../utils/classes';
import { SNACKBAR_OPEN } from './../../../../store/actions';
import DatePicker from './../../../../component/DatePicker/index';
import {
  removeInventoryCheck,
  applyInventoryCheck,
  createInventoryCheck,
  updateInventoryCheck,
  importInventoryCheck,
  getMoreInventoryCheckData,
} from '../../../../services/api/Material/InventoryCheck.js';
import { materialInventoryTemplate } from './../../../../store/constants/initial';
import { downloadFile } from './../../../../utils/helper';
import FirebaseUpload from '../../../FloatingMenu/FirebaseUpload/index.js';
import useConfirmPopup from '../../../../hooks/useConfirmPopup.js';

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

const InventoryCheckModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { setConfirmPopup } = useConfirmPopup();
  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.materialInventoryCheck.detail.save);
  const buttonImport = formButtons.find((button) => button.name === view.materialInventoryCheck.detail.import);
  const buttonApply = formButtons.find((button) => button.name === view.materialInventoryCheck.detail.apply);

  const buttonRemove = formButtons.find((button) => button.name === view.materialInventoryCheck.detail.remove);
  const { materialInventoryCheckDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [tabIndex, setTabIndex] = React.useState(0);

  const [inventoryCheckData, setInventoryCheckData] = useState({ notes: '' });
  const [inventoryCheck, setInventoryCheck] = useState({
    categories: [],
    status: [],
    warehouses: [],
  });
  const [isOpenUpload, setIsOpenUpload] = useState(false);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, materialInventoryCheckDocument: false });
  };

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const showConfirmPopup = ({ title = 'Thông báo', message = '', action = null, payload = null, onSuccess = null }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess });
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
    setInventoryCheckData({ notes: '' });
    setTabIndex(0);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setInventoryCheckData({ ...inventoryCheckData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (inventoryCheckData?.id) {
        await updateInventoryCheck(inventoryCheckData);
        handleOpenSnackbar('success', 'Cập nhật thành công!');
      } else {
        await createInventoryCheck(inventoryCheckData);
        handleOpenSnackbar('success', 'Tạo mới thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'materialInventoryCheck' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleDownload = () => {
    downloadFile(materialInventoryTemplate);
  };

  const importExcel = async (image) => {
    try {
      const res = await importInventoryCheck({
        id: inventoryCheckData.id,
        file_url: image?.url,
        inventory_check_code: inventoryCheckData.inventory_check_code,
      });
      if (res.code === 200) {
        handleOpenSnackbar('success', res.message);
      } else {
        handleOpenSnackbar('error', res.message);
      }
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleApply = () => {
    showConfirmPopup({
      title: 'Xác nhận áp dụng',
      message: 'Bạn có chắc chắn muốn áp dụng?',
      action: actionApply,
      payload: inventoryCheckData.id,
      onSuccess: handleCloseDialog,
    });
  };

  const actionApply = async (id) => {
    try {
      const res = await applyInventoryCheck(id);
      if (res.code === 200) {
        handleOpenSnackbar('success', res.message);
      } else {
        handleOpenSnackbar('error', res.message);
      }
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleRemove = () => {
    showConfirmPopup({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa?',
      action: actionRemove,
      payload: inventoryCheckData.id,
      onSuccess: handleCloseDialog,
    });
  };

  const actionRemove = async (id) => {
    try {
      const res = await removeInventoryCheck(inventoryCheckData.id);
      if (res.code === 200) {
        handleOpenSnackbar('success', res.message);
      } else {
        handleOpenSnackbar('error', res.message);
      }
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleOpenDiaLog = () => {
    setIsOpenUpload(true);
  };

  const handleCloseDiaLog = () => {
    setIsOpenUpload(false);
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setInventoryCheckData({
      ...inventoryCheckData,
      ...selectedDocument,
    });
  }, [selectedDocument]);

  useEffect(() => {
    const getInventoryCheck = async () => {
      const res = await getMoreInventoryCheckData();
      setInventoryCheck({
        categories: res.categories,
        status: res.status,
        warehouses: res.warehouses,
      });
    };
    getInventoryCheck();
  }, []);

  return (
    <React.Fragment>
      <FirebaseUpload
        open={isOpenUpload || false}
        onSuccess={importExcel}
        onClose={handleCloseDiaLog}
        type="excel"
        folder="File Import/Material Inventory"
      />
      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          className={classes.useradddialog}
        >
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Kiểm kê kho vật tư
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
                        Nội dung
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <History />
                        Chi tiết
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <InfoOutlined />
                            <span>Thông tin</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tiêu đề:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                value={inventoryCheckData.title}
                                type="text"
                                size="small"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã kiểm kê:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="inventory_check_code"
                                size="small"
                                type="text"
                                value={inventoryCheckData.inventory_check_code}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Loại kiểm kê:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="category_id"
                                value={inventoryCheckData.category_id || ''}
                                size="small"
                                onChange={handleChanges}
                              >
                                {inventoryCheck.categories?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Kho vật tư:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="warehouse_id"
                                value={inventoryCheckData.warehouse_id || ''}
                                size="small"
                                onChange={handleChanges}
                              >
                                {inventoryCheck.warehouses?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Ngày kiểm kê:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <DatePicker
                                date={inventoryCheckData.inventory_check_date}
                                onChange={(date) => setInventoryCheckData({ ...inventoryCheckData, inventory_check_date: date })}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Template</span>
                          </div>
                        </div>
                        <div className={`${classes.tabItemBody} ${classes.tabItemDownload}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" align="center">
                                Sử dụng template để nhập dữ liệu nhanh hơn
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Button variant="contained" color="primary" onClick={handleDownload}>
                                Tải xuống template
                              </Button>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <InfoOutlined />
                            <span>Thông tin thêm</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Trạng thái:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="status"
                                value={inventoryCheckData.status || ''}
                                size="small"
                                onChange={handleChanges}
                              >
                                {inventoryCheck.status?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Kiểm tra bởi:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField fullWidth disabled variant="outlined" value={inventoryCheckData.checked_by} size="small" />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Xác nhận bởi:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField fullWidth disabled variant="outlined" value={inventoryCheckData.verified_by} size="small" />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Ghi chú</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={12} md={12} xs={12}>
                              <TextField
                                fullWidth
                                multiline
                                variant="outlined"
                                name="notes"
                                size="small"
                                value={inventoryCheckData.notes}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Chi tiết</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <TableContainer style={{ maxHeight: '65vh' }} component={Paper}>
                            <Table stickyHeader aria-label="simple table">
                              <TableHead>
                                <TableRow></TableRow>
                              </TableHead>
                              <TableBody></TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      </div>
                    </Grid>
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
                {selectedDocument?.id && buttonImport && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleOpenDiaLog}>
                    {buttonImport.text}
                  </Button>
                )}
                {selectedDocument?.id && buttonApply && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleApply}>
                    {buttonApply.text}
                  </Button>
                )}
                {selectedDocument?.id && buttonRemove && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleRemove}>
                    {buttonRemove.text}
                  </Button>
                )}
                {selectedDocument?.id && buttonSave && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmit}>
                    {buttonSave.text}
                  </Button>
                )}
                {!selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmit}>
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

export default InventoryCheckModal;
