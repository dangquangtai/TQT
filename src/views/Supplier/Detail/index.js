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
  Switch,
} from '@material-ui/core';
import Alert from '../../../component/Alert';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useView from '../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, CONFIRM_CHANGE } from '../../../store/actions.js';
import { view } from '../../../store/constant';
import useStyles from './../../../utils/classes';
import FirebaseUpload from './../../FloatingMenu/FirebaseUpload/index';
import useConfirmPopup from './../../../hooks/useConfirmPopup';
import { format as formatDate } from 'date-fns';
import { AccountCircleOutlined as AccountCircleOutlinedIcon, Today as TodayIcon } from '@material-ui/icons';
import { createSupplier, updateSupplier } from '../../../services/api/Partner/Supplier.js';
import { getAllSupplierCategory } from '../../../services/api/Setting/SupplierCategory.js';

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

const SupplierModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.supplier.detail.save);
  const { supplierDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [supplierData, setSupplierData] = useState({ notes: '' });
  const [categories, setCategories] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, SupplierDocument: false });
  };

  const handleOpenSnackbar = (isOpen, type, text) => {
    setSnackbarStatus({
      isOpen: isOpen,
      type: type,
      text: text,
    });
  };

  const setDocumentToDefault = async () => {
    setSupplierData({});
    setTabIndex(0);
  };
  const setURL = (image) => {
    if (dialogUpload.type === 'image') {
      setSupplierData({ ...supplierData, image_url: image });
    } else if (dialogUpload.type === 'banner') {
      setSupplierData({ ...supplierData, banner_url: image });
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
        await updateSupplier(supplierData);
        handleOpenSnackbar(true, 'success', 'Cập nhật Nhà cung cấp thành công!');
      } else {
        await createSupplier(supplierData);
        handleOpenSnackbar(true, 'success', 'Tạo mới Nhà cung cấp thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'supplier' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  };

  const showConfirmPopup = ({ title = 'Thông báo', message = '', action = null, payload = null, onSuccess = null }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setSupplierData({ ...supplierData, [name]: value });
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setSupplierData({
      ...supplierData,
      ...selectedDocument,
    });
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllSupplierCategory();
      setCategories(data);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarStatus.isOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })}
      >
        <Alert
          onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })}
          severity={snackbarStatus.type}
          sx={{ width: '100%' }}
        >
          {snackbarStatus.text}
        </Alert>
      </Snackbar>
      <FirebaseUpload
        open={dialogUpload.open || false}
        onSuccess={setURL}
        onClose={handleCloseDiaLog}
        type="image"
        folder="Supplier"
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
              {selectedDocument?.id ? 'Cập nhật Nhà cung cấp' : 'Tạo mới Nhà cung cấp'}
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
                        Chi tiết Nhà cung cấp
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <TodayIcon className={`${tabIndex === 2 ? classes.tabActiveIcon : ''}`} />
                        Lịch sử thay đổi
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Thông tin</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Tên nhà cung cấp:</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="title"
                                  type="text"
                                  size="small"
                                  value={supplierData.title || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Mã nhà cung cấp:</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="supplier_code"
                                  type="text"
                                  size="small"
                                  value={supplierData.supplier_code || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Danh mục:</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <TextField
                                  fullWidth
                                  name="category_id"
                                  variant="outlined"
                                  select
                                  size="small"
                                  value={supplierData.category_id || ''}
                                  onChange={handleChanges}
                                >
                                  {categories?.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.category_name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Hoạt động:</span>
                              </Grid>
                              <Grid item lg={8} md={8} xs={8}>
                                <Switch
                                  checked={supplierData.is_active || false}
                                  onChange={(e) => setSupplierData({ ...supplierData, is_active: e.target.checked })}
                                  color="primary"
                                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>Ghi chú</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={12} md={12} xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  variant="outlined"
                                  name="notes"
                                  type="text"
                                  size="small"
                                  minRows={7}
                                  value={supplierData.notes || ''}
                                  onChange={handleChanges}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
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

export default SupplierModal;
