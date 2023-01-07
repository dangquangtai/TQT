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
  Switch,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useView from './../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, SNACKBAR_OPEN } from './../../store/actions.js';
import { view } from './../../store/constant';
import useStyles from './../../utils/classes';
import { DescriptionOutlined as DescriptionOutlinedIcon, InfoOutlined as InfoOutlinedIcon } from '@material-ui/icons';
import Alert from './../../component/Alert/index';
import { initCategory } from '../../store/constants/initial.js';
import { createMaterialCategory, updateMaterialCategory } from './../../services/api/Setting/MaterialCategory';
import { createSupplierCategory, updateSupplierCategory } from './../../services/api/Setting/SupplierCategory';
import { createCustomerCategory, updateCustomerCategory } from './../../services/api/Setting/CustomerCategory';
import { createProductCategory, updateProductCategory } from './../../services/api/Setting/ProductCategory';

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

const CategoryModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { form_buttons: formButtons } = useView();
  const { categoryDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument, documentType } = useSelector((state) => state.document);

  const buttonUpdateMaterialCategory = formButtons.find((button) => button.name === view.materialCategory.detail.save);
  const buttonUpdateSupplierCategory = formButtons.find((button) => button.name === view.supplierCategory.detail.save);
  const buttonUpdateCustomerCategory = formButtons.find((button) => button.name === view.customerCategory.detail.save);
  const buttonUpdateProductCategory = formButtons.find((button) => button.name === view.productCategory.detail.save);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [categoryData, setCategoryData] = React.useState(initCategory);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, categoryDocument: false });
  };

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
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
    setCategoryData(initCategory);
    setTabIndex(0);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        switch (documentType) {
          case 'materialCategory':
            await updateMaterialCategory(categoryData);
            break;
          case 'supplierCategory':
            await updateSupplierCategory(categoryData);
            break;
          case 'productCategory':
            await updateProductCategory(categoryData);
            break;
          case 'customerCategory':
            await updateCustomerCategory(categoryData);
            break;
          default:
            break;
        }
        handleOpenSnackbar('success', 'Cập nhật Danh mục thành công!');
      } else {
        switch (documentType) {
          case 'materialCategory':
            await createMaterialCategory(categoryData);
            break;
          case 'supplierCategory':
            await createSupplierCategory(categoryData);
            break;
          case 'productCategory':
            await createProductCategory(categoryData);
            break;
          case 'customerCategory':
            await createCustomerCategory(categoryData);
            break;
          default:
            break;
        }
        handleOpenSnackbar('success', 'Tạo mới Danh mục thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: documentType });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setCategoryData({ ...selectedDocument });
  }, [selectedDocument]);

  return (
    <React.Fragment>
      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          className={classes.partnerdialog}
        >
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              {selectedDocument?.id ? 'Chi tiết' : 'Tạo mới'} danh mục
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
                        <DescriptionOutlinedIcon className={`${tabIndex === 0 ? classes.tabActiveIcon : ''}`} />
                        Nội dung
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <InfoOutlinedIcon />
                            <span>Thông tin</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên danh mục:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                name="category_name"
                                value={categoryData.category_name}
                                size="small"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã danh mục:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                type="text"
                                variant="outlined"
                                name="category_code"
                                value={categoryData.category_code}
                                size="small"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Hoạt động:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Switch
                                checked={categoryData.is_active}
                                onChange={(e) => setCategoryData({ ...categoryData, is_active: e.target.checked })}
                                color="primary"
                              />
                            </Grid>
                          </Grid>
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
                {buttonUpdateMaterialCategory && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    {buttonUpdateMaterialCategory.text}
                  </Button>
                )}
                {buttonUpdateSupplierCategory && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    {buttonUpdateSupplierCategory.text}
                  </Button>
                )}
                {buttonUpdateProductCategory && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    {buttonUpdateProductCategory.text}
                  </Button>
                )}
                {buttonUpdateCustomerCategory && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    {buttonUpdateCustomerCategory.text}
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

export default CategoryModal;
