import React, { useEffect, useState } from 'react';
import {
  Switch,
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
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  MenuItem,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../../store/constant';
import useView from '../../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../../store/actions';
import { History, DescriptionOutlined as DescriptionOutlinedIcon, AddCircleOutline, Delete, InfoOutlined } from '@material-ui/icons';
import useStyles from './../../../../utils/classes';
import FirebaseUpload from '../../../FloatingMenu/FirebaseUpload/index.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { updateProduct } from '../../../../services/api/Product/Product.js';
import { SNACKBAR_OPEN } from './../../../../store/actions';
import { getMaterialLoadData } from '../../../../services/api/Material/MaterialPart';
import { getAllMaterialPart } from './../../../../services/api/Material/MaterialPart';
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

const ProductModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.product.detail.save);
  const { productDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [openDialogUploadImage, setOpenDiaLogUploadImage] = React.useState(false);
  const [dataUnitList, setDataUnitList] = useState([]);
  const [productData, setProductData] = useState({
    volume: '',
    is_active: true,
    id: '',
  });
  const [partList, setPartList] = useState([]);
  // const { materials } = useSelector((state) => state.metadata);
  const [materials, setMaterials] = useState([]);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, productDocument: false });
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
    setProductData({ is_active: true, volume: '', id: '' });
    setPartList([]);
    setTabIndex(0);
  };
  const setURL = (image) => {
    setProductData({ ...productData, image_url: image });
  };

  const handleCloseDiaLog = () => {
    setOpenDiaLogUploadImage(false);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    if (name === 'unit_id') {
      const unit = dataUnitList.find((item) => item.id);
      setProductData({ ...productData, [name]: value, unit_name: unit.value });
    }
  };

  const handleAddPart = () => {
    setPartList([
      ...partList,
      {
        part_id: '',
        part_name: '',
        part_code: '',
        quantity_in_piece: 0,
        unit_id: '',
        unit_name: '',
        category_id: '',
        category_name: '',
        product_id: productData?.id || '',
      },
    ]);
  };

  const handleDeletePart = (index) => {
    const newParts = partList?.filter((item, i) => i !== index);
    setPartList(newParts);
  };

  const handleChangePart = (index, newValue) => {
    const newPartList = [...partList];
    const newParts = {
      part_id: newValue?.id || '',
      part_name: newValue?.title || '',
      part_code: newValue?.part_code || '',
      quantity_in_piece: 0,
      unit_id: newValue?.unit_id || '',
      unit_name: newValue?.unit_name || '',
      category_id: newValue?.category_id || '',
      category_name: newValue?.category_name || '',
    };
    newPartList[index] = { ...newPartList[index], ...newParts };
    setPartList(newPartList);
  };

  const handleChangeQuantity = (index, newValue) => {
    const newPartList = [...partList];
    newPartList[index] = { ...newPartList[index], quantity_in_piece: newValue };
    setPartList(newPartList);
  };

  const handleSubmit = async () => {
    try {
      const update = await updateProduct({
        ...productData,
        part_list: partList,
      });
      if (update.return === 200) {
        handleOpenSnackbar('success', update.message);
      } else {
        handleOpenSnackbar('error', update.message);
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'product' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setProductData({
      ...productData,
      ...selectedDocument,
    });
    setPartList(selectedDocument?.part_list || []);
  }, [selectedDocument]);

  useEffect(() => {
    if (!openDialog) return;
    const fetchData = async () => {
      const [loadData, materialList] = await Promise.all([getMaterialLoadData(), getAllMaterialPart()]);
      setDataUnitList(loadData?.data_unit_list);
      setMaterials(materialList || []);
    };

    fetchData();
  }, [openDialog]);
  return (
    <React.Fragment>
      <FirebaseUpload open={openDialogUploadImage} onSuccess={setURL} onClose={handleCloseDiaLog} type="image" folder="Podcast" />
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
              Thành phẩm
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
                        <DescriptionOutlinedIcon />
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
                        Vật tư
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
                    <Grid item lg={6} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <InfoOutlined />
                            <span>Thông tin</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã thành phẩm(*):</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                multiline
                                variant="outlined"
                                name="product_code"
                                size="small"
                                type="text"
                                disabled={!!productData?.id}
                                value={productData.product_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên thành phẩm(*):</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                variant="outlined"
                                name="title"
                                value={productData.title || ''}
                                type="text"
                                size="small"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã khách hàng(*):</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="product_customer_code"
                                value={productData.product_customer_code || ''}
                                size="small"
                                type="text"
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
                                checked={productData.is_active || true}
                                onChange={(e) => setProductData({ ...productData, is_active: e.target.checked })}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={6} md={12} xs={12}>
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
                              <span className={classes.tabItemLabelField}>Đơn vị(*):</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="unit_id"
                                value={productData.unit_id || ''}
                                size="small"
                                onChange={handleChanges}
                              >
                                {dataUnitList.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Số lượng thành phẩm/thùng(*):</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="no_piece_per_box"
                                value={productData.no_piece_per_box || ''}
                                size="small"
                                type="number"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Năng suất 1 công nhân trong 8h(*):</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="productivity_per_worker"
                                value={productData.productivity_per_worker || ''}
                                size="small"
                                type="number"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Thể tích 1 đơn vị(*):</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="unit_volume"
                                value={productData.unit_volume || ''}
                                size="small"
                                onChange={handleChanges}
                                InputProps={{
                                  inputProps: { min: 0 },
                                  inputComponent: NumberFormatCustom,
                                }}
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
                            <span>Thành phần</span>
                          </div>
                          <Tooltip title="Thêm sản phẩm">
                            <IconButton onClick={handleAddPart}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody}>
                          <TableContainer style={{ maxHeight: '65vh' }} component={Paper}>
                            <Table stickyHeader aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã thành phần</TableCell>
                                  <TableCell align="left">Tên thành phần</TableCell>
                                  <TableCell align="left">Số lượng</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left"></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {partList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" component="th" scope="row" style={{ width: '30%' }}>
                                      <Autocomplete
                                        size="small"
                                        options={materials}
                                        fullWidth
                                        getOptionLabel={(option) => option.part_code || ''}
                                        value={partList[index] || null}
                                        // getOptionSelected={(option, value) => option.id === value.part_id}
                                        onChange={(event, newValue) => handleChangePart(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell}>
                                      <Tooltip title={row?.part_name || ''}>
                                        <span>{row?.part_name || ''}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                        value={row?.quantity_in_piece || ''}
                                        onChange={(e) => handleChangeQuantity(index, e.target.value)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      <Tooltip title="Xóa">
                                        <IconButton onClick={() => handleDeletePart(index)}>
                                          <Delete />
                                        </IconButton>
                                      </Tooltip>
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
                {!selectedDocument && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmit}>
                    {'Tạo mới'}
                  </Button>
                )}
                {selectedDocument?.id && buttonSave && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmit}>
                    {buttonSave.text}
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

export default ProductModal;
