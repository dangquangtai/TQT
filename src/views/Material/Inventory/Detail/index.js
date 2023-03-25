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
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  MenuItem,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../../store/constant';
import useView from '../../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../../store/actions';
import { History, DescriptionOutlined, AddCircleOutlineOutlined, InfoOutlined } from '@material-ui/icons';
import useStyles from './../../../../utils/classes';
import { SNACKBAR_OPEN } from './../../../../store/actions';
import BrokenModal from './../../../Dialog/Broken/index';
import { getInOutDetailList, updateMaterialInventory } from '../../../../services/api/Material/Inventory.js';
import { getMaterialWHSList } from '../../../../services/api/Workorder/index.js';

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

const InventoryModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { form_buttons: formButtons } = useView();
  // const buttonSave = formButtons.find((button) => button.name === view.inventory.detail.save);
  const { materialInventoryDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [tabIndex, setTabIndex] = React.useState(0);

  const [inventoryData, setInventoryData] = useState({});
  const [brokenDialog, setBrokenDialog] = useState(false);
  const [warehouseList, setWarehouseList] = useState([]);
  const [inOutDetailList, setInOutDetailList] = useState([]);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, materialInventoryDocument: false });
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
    setInventoryData({});
    setTabIndex(0);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setInventoryData({ ...inventoryData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const update = await updateMaterialInventory(inventoryData);
      if (update) {
        handleOpenSnackbar('success', 'Cập nhật Vật tư thành công!');
      } else {
        handleOpenSnackbar('error', 'Cập nhật Vật tư thất bại!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'materialInventory' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleOpenBrokenModal = () => {
    setBrokenDialog(true);
  };

  const handleCloseBrokenModal = () => {
    setBrokenDialog(false);
  };

  const handleSubmitBroken = (brokens, totalBroken) => {
    console.log(brokens);
    setInventoryData({ ...inventoryData, broken_list: brokens, broken_quantity_in_piece: totalBroken });
    setBrokenDialog(false);
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setInventoryData({
      ...inventoryData,
      ...selectedDocument,
    });
  }, [inventoryData, selectedDocument]);

  useEffect(() => {
    const getWarehouseList = async () => {
      const warehouseList = await getMaterialWHSList();
      setWarehouseList(warehouseList);
    };

    getWarehouseList();
  }, []);
  useEffect(() => {
    const getListInOutDetail = async () => {
      const InOutDetail = await getInOutDetailList(inventoryData.part_id, inventoryData.supplier_id);
      setInOutDetailList(InOutDetail);
    };

    getListInOutDetail();
  }, [inventoryData.part_id, inventoryData.supplier_id]);

  return (
    <React.Fragment>
      <BrokenModal
        isOpen={brokenDialog}
        isDisabled={false}
        handleClose={handleCloseBrokenModal}
        handleSubmit={handleSubmitBroken}
        handleOpenSnackbar={handleOpenSnackbar}
        list={inventoryData?.broken_list || []}
      />
      <Grid container>
        <Dialog open={openDialog || false} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog} fullScreen>
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Kho vậ tư
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
                        Chi tiết hỏng
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
                        Chi tiết xuất nhập
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
                              <span className={classes.tabItemLabelField}>Mã vật tư:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                disabled
                                variant="outlined"
                                // name="part_code"
                                value={inventoryData.part_code}
                                type="text"
                                size="small"
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên vật tư:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                disabled
                                // name="part_name"
                                value={inventoryData.part_name}
                                type="text"
                                size="small"
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Danh mục:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                disabled
                                variant="outlined"
                                // name="category_name"
                                size="small"
                                type="text"
                                value={inventoryData.category_name}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Nhà cung cấp:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                disabled
                                // name="supplier_name"
                                value={inventoryData.supplier_name}
                                size="small"
                                type="text"
                              />
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
                              <span className={classes.tabItemLabelField}>Kho:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                select
                                variant="outlined"
                                name="warehouse_id"
                                value={inventoryData?.warehouse_id || ''}
                                size="small"
                                onChange={handleChanges}
                              >
                                {warehouseList.map((item) => (
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Số lượng:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="quantity_in_piece"
                                value={inventoryData.quantity_in_piece}
                                size="small"
                                type="number"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Số lượng hỏng:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                disabled
                                name="broken_quantity_in_piece"
                                value={inventoryData.broken_quantity_in_piece}
                                size="small"
                                type="number"
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Ghi chú:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="notes"
                                value={inventoryData.notes}
                                size="small"
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
                            <span>Chi tiết hỏng</span>
                          </div>
                          <Tooltip title="Thêm mới">
                            <IconButton aria-label="add" onClick={handleOpenBrokenModal}>
                              <AddCircleOutlineOutlined />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody}>
                          <TableContainer style={{ maxHeight: '65vh' }} component={Paper}>
                            <Table stickyHeader aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Hỏng</TableCell>
                                  <TableCell align="left">Số lượng</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {inventoryData?.broken_list?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left">{row.Broken_Type_Name}</TableCell>
                                    <TableCell align="left">{row.Quantity_In_Piece}</TableCell>
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
                <TabPanel value={tabIndex} index={2}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Chi tiết xuất nhập</span>
                          </div>
                          {/* <Tooltip title="Thêm mới">
                            <IconButton aria-label="add" onClick={handleOpenBrokenModal}>
                              <AddCircleOutlineOutlined />
                            </IconButton>
                          </Tooltip> */}
                        </div>
                        <div className={classes.tabItemBody}>
                          <TableContainer style={{ maxHeight: '65vh' }} component={Paper}>
                            <Table stickyHeader aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Ngày chứng từ</TableCell>
                                  <TableCell align="left">Mã phiếu xuất/nhập kho</TableCell>
                                  <TableCell align="left">Diễn giải</TableCell>
                                  <TableCell align="left">SL nhập</TableCell>
                                  <TableCell align="left">SL nhập hỏng</TableCell>
                                  <TableCell align="left">SL xuất</TableCell>
                                  <TableCell align="left">SL xuất hỏng</TableCell>
                                  <TableCell align="left">SL tồn</TableCell>
                                  <TableCell align="left">SL tồn hỏng</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {inOutDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left">{row.order_date}</TableCell>
                                    <TableCell align="left">{row.order_code}</TableCell>
                                    <TableCell align="left">{row.detail}</TableCell>
                                    <TableCell align="left">{row.received_quantity_in_piece}</TableCell>
                                    <TableCell align="left">{row.broken_received_quantity_in_piece}</TableCell>
                                    <TableCell align="left">{row.requisition_quantity_in_piece}</TableCell>
                                    <TableCell align="left">{row.broken_requisition_quantity_in_piece}</TableCell>
                                    <TableCell align="left">{row.inventory_quantity_in_piece}</TableCell>
                                    <TableCell align="left">{row.broken_inventory_quantity_in_piece}</TableCell>
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
              <Grid item className={classes.gridItemInfoButtonWrap}>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              <Grid item className={classes.gridItemInfoButtonWrap}>
                {/* {selectedDocument?.id && buttonSave && ( */}
                <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmit}>
                  Lưu
                </Button>
                {/* )} */}
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default InventoryModal;
