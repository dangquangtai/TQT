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
import { DescriptionOutlined, AttachFileOutlined, History } from '@material-ui/icons';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import DatePicker from './../../../../component/DatePicker/index';
import {
  updateDailyMaterialReceived,
  getDailyMaterialReceivedData,
  exportDailyMaterialReceived,
} from '../../../../services/api/Production/MaterialReceived.js';
import BrokenModal from './../../../Dialog/Broken/index';
import { downloadFile } from '../../../../utils/helper.js';
import { createFileAttachment, deleteFileAttachment, getListFile } from '../../../../services/api/Attachment/FileAttachment';
import FirebaseUpload from '../../../FloatingMenu/FirebaseUpload';
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

const DailyMaterialReceivedModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const saveButton = formButtons.find((button) => button.name === view.productionDailyMaterialReceived.detail.save);
  const { dailyMaterialReceivedDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [listFileData, setListFileData] = useState([]);
  const [fileData, setFileData] = useState([]);

  const [dailyMaterialReceivedData, setDailyMaterialReceivedData] = useState({
    notes: '',
  });

  const [receivedDetailList, setReceivedDetailList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);

  const [openBrokenModal, setOpenBrokenModal] = useState(false);
  const [brokenDetail, setBrokenDetail] = useState({
    index: null,
    list: [],
  });

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
    // const res = await deleteFileAttachment(id);
    // if (res)
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
    dispatch({ type: FLOATING_MENU_CHANGE, dailyMaterialReceivedDocument: false });
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
    setDailyMaterialReceivedData({ notes: '' });
    setReceivedDetailList([]);
    setListFileData([]);
    setFileData([]);
    setTabIndex(0);
  };

  const handleSubmitForm = async () => {
    try {
      await updateDailyMaterialReceived({ ...dailyMaterialReceivedData, detail_list: receivedDetailList });
      handleOpenSnackbar('success', 'Cập nhật Phiếu nhập vật tư hàng ngày thành công!');
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'dailyMaterialReceived' });
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
    setDailyMaterialReceivedData({ ...dailyMaterialReceivedData, [name]: value });
  };

  const handleChangeProduct = (index, e) => {
    const newreceivedDetailList = [...receivedDetailList];
    var { name, value } = e.target;
    var number = parseInt(value);
    // if (name === 'consumed_quantity_in_piece') {
    //   const check =
    //     number + newreceivedDetailList[index].total_return_quantity_in_piece + newreceivedDetailList[index].total_broken_quantity_in_piece;

    //   if (check > newreceivedDetailList[index].quantity_in_piece) {
    //     number =
    //       newreceivedDetailList[index].quantity_in_piece -
    //       (newreceivedDetailList[index].consumed_quantity_in_piece +
    //         newreceivedDetailList[index].total_return_quantity_in_piece +
    //         newreceivedDetailList[index].total_broken_quantity_in_piece) -
    //       newreceivedDetailList[index].consumed_quantity_in_piece;
    //     return;
    //   }
    // }
    // if (name === 'total_return_quantity_in_piece') {
    //   const check =
    //     newreceivedDetailList[index].consumed_quantity_in_piece + number + newreceivedDetailList[index].total_broken_quantity_in_piece;
    //   if (check > newreceivedDetailList[index].quantity_in_piece) {
    //     number =
    //       newreceivedDetailList[index].quantity_in_piece -
    //       (newreceivedDetailList[index].consumed_quantity_in_piece +
    //         newreceivedDetailList[index].total_return_quantity_in_piece +
    //         newreceivedDetailList[index].total_broken_quantity_in_piece) +
    //       newreceivedDetailList[index].total_return_quantity_in_piece;
    //     return;
    //   }
    // }
    newreceivedDetailList[index] = { ...newreceivedDetailList[index], [name]: number };
    setReceivedDetailList(newreceivedDetailList);
  };

  const handleCloseBrokenModal = () => {
    setOpenBrokenModal(false);
    setBrokenDetail({ index: null, list: [] });
  };

  const handleOpenBrokenModal = (item, index) => {
    setOpenBrokenModal(true);
    setBrokenDetail({ index, list: item.broken_list || [] });
  };

  const handleSubmitBroken = (brokens, totalBroken) => {
    const newreceivedDetailList = [...receivedDetailList];
    newreceivedDetailList[brokenDetail.index] = {
      ...newreceivedDetailList[brokenDetail.index],
      broken_list: brokens,
      total_broken_quantity_in_piece: totalBroken,
    };
    setReceivedDetailList(newreceivedDetailList);
    handleCloseBrokenModal();
  };

  const handleClickExport = async () => {
    var url = await exportDailyMaterialReceived(dailyMaterialReceivedData.id || '');
    handleDownload(url);
    // showConfirmPopup({
    //   title: 'Xuất phiếu nhập vật tư',
    //   message: 'Bạn có chắc chắn muốn xuất phiếu nhập vật tư này?',
    //   action: exportDailyMaterialReceived,
    //   payload: dailyMaterialReceivedData.daily_work_order_id,
    //   onSuccess: (url) => handleDownload(url),
    // });
  };

  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setDailyMaterialReceivedData({
      ...dailyMaterialReceivedData,
      ...selectedDocument,
    });
    setFileData({ ...fileData, id: selectedDocument?.id });
    fetchFileListData();
    setReceivedDetailList(selectedDocument?.detail_list || []);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const { status, warehouses } = await getDailyMaterialReceivedData();
      setStatusList(status);
      setWarehouseList(warehouses);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <BrokenModal
        isOpen={openBrokenModal}
        isDisabled={false}
        handleClose={handleCloseBrokenModal}
        handleSubmit={handleSubmitBroken}
        handleOpenSnackbar={handleOpenSnackbar}
        list={brokenDetail?.list || []}
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
              Cập nhật Phiếu nhập vật tư theo lệnh sản xuất
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
                          <div className={classes.tabItemLabel}>nhập vật tư</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={2} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã phiếu:</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="order_code"
                                type="text"
                                size="small"
                                value={dailyMaterialReceivedData.order_code || ''}
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
                                value={dailyMaterialReceivedData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày nhập kho:</span>
                              <DatePicker
                                disabled={true}
                                date={dailyMaterialReceivedData.order_date}
                                onChange={(date) => setDailyMaterialReceivedData({ ...dailyMaterialReceivedData, order_date: date })}
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
                                value={dailyMaterialReceivedData.warehouse_id || ''}
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
                                value={dailyMaterialReceivedData.status || ''}
                                onChange={handleChanges}
                              >
                                {statusList?.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item lg={9} md={9} xs={9}>
                              <span className={classes.tabItemLabelField}>Ghi chú:</span>
                              <TextField
                                fullWidth
                                multiline
                                minRows={1}
                                variant="outlined"
                                name="notes"
                                type="text"
                                size="small"
                                value={dailyMaterialReceivedData.notes || ''}
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
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table aria-label="simple table" size="small" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">Nhà cung cấp</TableCell>
                                  <TableCell align="left">SL xuất</TableCell>
                                  <TableCell align="left">SL sử dụng</TableCell>
                                  <TableCell align="left">SL nhập lại</TableCell>
                                  <TableCell align="left">SL hỏng</TableCell>
                                  <TableCell align="left">Chênh lệch</TableCell>
                                  <TableCell align="left">Hỏng</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {receivedDetailList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <Tooltip title={row?.part_code}>
                                        <span>{row?.part_code}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '30%' }}>
                                      <Tooltip title={row?.part_name}>
                                        <span>{row?.part_name}</span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      {row.supplier_name}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.quantity_in_piece}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="consumed_quantity_in_piece"
                                        type="number"
                                        size="small"
                                        disabled={selectedDocument?.status === 'STATUS_COMPLETED' ? true : false}
                                        value={row?.consumed_quantity_in_piece || ''}
                                        onChange={(e) => handleChangeProduct(index, e)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '10%' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="total_return_quantity_in_piece"
                                        type="number"
                                        size="small"
                                        disabled={selectedDocument?.status === 'STATUS_COMPLETED' ? true : false}
                                        value={row?.total_return_quantity_in_piece || ''}
                                        onChange={(e) => handleChangeProduct(index, e)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row?.total_broken_quantity_in_piece || '0'}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.consumed_quantity_in_piece +
                                        row.total_return_quantity_in_piece +
                                        row.total_broken_quantity_in_piece -
                                        row.quantity_in_piece}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      style={{ width: '5%', cursor: 'pointer', textDecoration: 'underline' }}
                                      onClick={() => handleOpenBrokenModal(row, index)}
                                    >
                                      Chi tiết
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
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
                    folder="File Import/DailyMaterialReceived"
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
                <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleClickExport}>
                  In phiếu
                </Button>
                {saveButton && selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmitForm}>
                    {saveButton.text}
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

export default DailyMaterialReceivedModal;
