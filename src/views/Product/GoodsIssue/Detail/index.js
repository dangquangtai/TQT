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
  Chip,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DescriptionOutlined, AttachFileOutlined, History } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import FirebaseUpload from './../../../FloatingMenu/FirebaseUpload/index';
import DatePicker from './../../../../component/DatePicker/index';
import { createGoodsIssue, getGoodsIssueData, updateGoodsIssue, getLink } from './../../../../services/api/Product/GoodsIssue.js';
import { downloadFile } from '../../../../utils/helper';
import { getOrderByStatus, getOrderDetailList } from './../../../../services/api/Order/index';
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

const GoodsIssueModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.goodsIssue.detail.save);
  const { goodsIssueDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [listFileData, setListFileData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [goodsIssueData, setGoodsIssueData] = useState({
    order_date: new Date(),
    notes: '',
  });

  const [issueDetailList, setIssueDetailList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const setURL = async (fileDataInput) => {
    console.log(fileDataInput?.file_name);
    const newFileData = { ...fileData, file_name: fileDataInput?.file_name, url: fileDataInput?.url };
    setFileData(newFileData);
    const res = await createFileAttachment(newFileData);
    if (res) fetchFileListData();
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
  };

  const fetchFileListData = async () => {
    const fileList = await getListFile(selectedDocument?.id);
    setListFileData(fileList);
  };

  const handleOpenDiaLog = () => {
    setIsOpenUpload(true);
  };

  const closeFirebaseDialog = () => {
    setIsOpenUpload(false);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, goodsIssueDocument: false });
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
    setGoodsIssueData({ order_date: new Date(), notes: '' });
    setIssueDetailList([]);
    setTabIndex(0);
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        await updateGoodsIssue({ ...goodsIssueData, issue_detail: issueDetailList });
        handleOpenSnackbar('success', 'Cập nhật Phiếu xuất thành phẩm thành công!');
      } else {
        if (issueDetailList?.length === 0) {
          handleOpenSnackbar('error', 'Vui lòng chọn thành phẩm!');
          return;
        }
        if (issueDetailList?.some((item) => item.status === 'Thiếu')) {
          handleOpenSnackbar('error', 'Thành phẩm không đủ số lượng!');
          return;
        }
        await createGoodsIssue({ ...goodsIssueData, issue_detail: issueDetailList });
        handleOpenSnackbar('success', 'Tạo mới Phiếu xuất thành phẩm thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'goodsIssue' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleGetLink = async () => {
    try {
      let url = await getLink(selectedDocument.id);
      downloadFile(url);
      handleOpenSnackbar('success', 'Tải file thành công!');
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const showConfirmPopup = ({ title = 'Thông báo', message = '', action = null, payload = null, onSuccess = null }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setGoodsIssueData({ ...goodsIssueData, [name]: value });
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setGoodsIssueData({
      ...goodsIssueData,
      ...selectedDocument,
    });
    setFileData({ ...fileData, id: selectedDocument?.id });
    fetchFileListData();
    setIssueDetailList(selectedDocument?.issue_detail || []);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const [data, orders] = await Promise.all([getGoodsIssueData(), getOrderByStatus('STATUS_INPROGRESS')]);
      setStatusList(data?.status);
      setWarehouseList(data?.warehouses);
      setOrderList(orders);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!goodsIssueData.customer_order_id) return;
    if (!goodsIssueData.warehouse_id) return;
    if (isDisabled) return;
    const fetchData = async () => {
      const order = await getOrderDetailList(goodsIssueData.customer_order_id, goodsIssueData.warehouse_id);
      setIssueDetailList(order);
    };
    fetchData();
  }, [goodsIssueData.customer_order_id, goodsIssueData.warehouse_id]);

  const isDisabled = !!selectedDocument?.id;

  return (
    <React.Fragment>
      {/* <FirebaseUpload open={dialogUpload.open || false} onSuccess={setURL} onClose={handleCloseDiaLog} type="image" folder="GoodsIssue" /> */}
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
              {selectedDocument?.id ? 'Cập nhật Phiếu xuất thành phẩm' : 'Tạo mới Phiếu xuất thành phẩm'}
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
                          <div className={classes.tabItemLabel}>Xuất thành phẩm</div>
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
                                value={goodsIssueData.order_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Tên phiếu nhập<sup className="required-star">*</sup>
                              </span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={goodsIssueData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>
                                Ngày xuất kho<sup className="required-star">*</sup>
                              </span>
                              <DatePicker
                                disabled={isDisabled}
                                date={goodsIssueData.order_date}
                                onChange={(date) => setGoodsIssueData({ ...goodsIssueData, order_date: date })}
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
                                value={goodsIssueData.warehouse_id || ''}
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
                              <span className={classes.tabItemLabelField}>
                                Đơn hàng<sup className="required-star">*</sup>
                              </span>
                              {isDisabled ? (
                                <TextField
                                  fullWidth
                                  disabled
                                  variant="outlined"
                                  size="small"
                                  value={goodsIssueData.customer_order_code || ''}
                                />
                              ) : (
                                <Autocomplete
                                  options={orderList || []}
                                  size="small"
                                  getOptionLabel={(option) => option.title}
                                  onChange={(event, newValue) => {
                                    setGoodsIssueData({
                                      ...goodsIssueData,
                                      customer_order_id: newValue?.id || '',
                                      customer_order_code: newValue?.order_code || '',
                                    });
                                  }}
                                  value={orderList?.find((item) => item.id === goodsIssueData.customer_order_id) || null}
                                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                                />
                              )}
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
                                value={goodsIssueData.status || ''}
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
                              <span className={classes.tabItemLabelField}>Ghi chú</span>
                              <TextField
                                fullWidth
                                multiline
                                minRows={1}
                                variant="outlined"
                                name="notes"
                                type="text"
                                size="small"
                                value={goodsIssueData.notes || ''}
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
                          <div className={classes.tabItemLabel}>Danh sách thành phẩm</div>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã TP KH</TableCell>
                                  <TableCell align="left">Mã thành phẩm</TableCell>
                                  <TableCell align="left">Tên thành phẩm</TableCell>
                                  <TableCell align="left">SL xuất</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Trạng thái</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {issueDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      {row?.product_customer_code}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      {row?.product_code}
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '40%' }}>
                                      <Tooltip title={row?.product_name}>
                                        <span>{row?.product_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.quantity_in_box}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.unit_name}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      <Chip label={row.status} style={{ backgroundColor: row.color_check }} />
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
                  <FirebaseUpload
                    open={isOpenUpload || false}
                    onSuccess={setURL}
                    onClose={closeFirebaseDialog}
                    type="other"
                    folder="File Import/GoodsIssue"
                  />
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
                {selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleGetLink}>
                    {'In phiếu'}
                  </Button>
                )}
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

export default GoodsIssueModal;
