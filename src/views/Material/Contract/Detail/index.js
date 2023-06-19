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
import { Delete, History, AttachFileOutlined, DescriptionOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { AddCircleOutline } from '@material-ui/icons';
import useStyles from './../../../../utils/classes';
import useView from './../../../../hooks/useView';
import useConfirmPopup from './../../../../hooks/useConfirmPopup';
import { view } from './../../../../store/constant';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import FirebaseUpload from './../../../FloatingMenu/FirebaseUpload/index';
import DatePicker from './../../../../component/DatePicker/index';
import { createFileAttachment, deleteFileAttachment, getListFile } from '../../../../services/api/Attachment/FileAttachment';
import ActivityLog from '../../../../component/ActivityLog/index.js';
import { ContractService } from './../../../../services/api/Material/Contract';

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

const ContractModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { form_buttons: formButtons } = useView();
  const { setConfirmPopup } = useConfirmPopup();
  const { materials } = useSelector((state) => state.metadata);
  const saveButton = formButtons.find((button) => button.name === view.contract.detail.save);
  const { contractDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [listFileData, setListFileData] = useState([]);
  const [fileData, setFileData] = useState([]);

  const [contractData, setContractData] = useState({
    contract_date: new Date(),
    notes: '',
  });

  const [supplier, setSupplier] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);

  const [materialList, setMaterialList] = useState([]);
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
    dispatch({ type: FLOATING_MENU_CHANGE, contractDocument: false });
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
    setContractData({ contract_date: new Date(), notes: '' });
    setListFileData([]);
    setFileData([]);
    setMaterialList([]);
    setTabIndex(0);
  };

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        await ContractService.update({ ...contractData, detail_list: materialList });
        handleOpenSnackbar('success', 'Cập nhật Đơn hàng mua vật tư thành công!');
      } else {
        await ContractService.create({ ...contractData, detail_list: materialList });
        handleOpenSnackbar('success', 'Tạo mới Đơn hàng mua vật tư thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'contract' });
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
    setContractData({ ...contractData, [name]: value });
  };

  const handleAddMaterial = () => {
    if (!contractData.supplier_id) {
      handleOpenSnackbar('error', 'Vui lòng chọn nhà cung cấp!');
      return;
    }
    setMaterialList([
      ...materialList,
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
      supplier_id: contractData?.supplier_id || '',
      supplier_name: contractData?.supplier_name || '',
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
        action: () => {},
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
    setContractData({
      ...contractData,
      ...selectedDocument,
    });
    setFileData({ ...fileData, id: selectedDocument?.id });
    fetchFileListData();
    setMaterialList(selectedDocument?.detail_list);
  }, [selectedDocument]);

  useEffect(() => {
    const fetchData = async () => {
      const { supplier_list, status_list } = await ContractService.getData();
      setStatusList(status_list);
      setSupplier(supplier_list);
    };
    fetchData();
  }, []);

  const isDisabled = contractData.status?.includes('RECEIVED');
  const isDetail = selectedDocument?.id;
  return (
    <React.Fragment>
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
              {selectedDocument?.id ? 'Cập nhật Hợp đồng mua vật tư' : 'Tạo mới Hợp đồng mua vật tư'}
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
                        Chi tiết Hợp đồng
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
                          <div className={classes.tabItemLabel}>Chi tiết Hợp đồng</div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={3} className={classes.gridItemInfo}>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã hợp đồng(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="contract_code"
                                type="text"
                                size="small"
                                value={contractData.contract_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Tên hợp đồng(*):</span>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                type="text"
                                size="small"
                                value={contractData.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Ngày kí(*):</span>
                              <DatePicker
                                date={contractData.contract_date}
                                onChange={(date) => setContractData({ ...contractData, contract_date: date })}
                              />
                            </Grid>
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Trạng thái(*):</span>
                              <TextField
                                fullWidth
                                name="status"
                                variant="outlined"
                                select
                                size="small"
                                value={contractData.status || ''}
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
                              <span className={classes.tabItemLabelField}>Nhà cung cấp(*):</span>
                              <Autocomplete
                                id="combo-box-demo"
                                options={supplier}
                                getOptionLabel={(option) => option.title || ''}
                                fullWidth
                                disabled={isDisabled}
                                size="small"
                                value={supplier?.find((item) => item.id === contractData.supplier_id) || null}
                                onChange={(event, newValue) => {
                                  setContractData({
                                    ...contractData,
                                    supplier_id: newValue?.id,
                                    supplier_name: newValue?.title,
                                  });
                                }}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                              />
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
                                value={contractData.notes || ''}
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
                          <Tooltip title="Thêm vật tư">
                            <IconButton onClick={handleAddMaterial}>
                              <AddCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                          <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                            <Table className={classes.tableSmall} aria-label="simple table" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="left">Mã vật tư</TableCell>
                                  <TableCell align="left">Tên vật tư</TableCell>
                                  <TableCell align="left">SL đặt</TableCell>
                                  <TableCell align="left">SL còn lại</TableCell>
                                  <TableCell align="left">Đơn vị</TableCell>
                                  <TableCell align="left">Ghi chú</TableCell>
                                  {isDetail && <TableCell align="left">Trạng thái</TableCell>}
                                  {!isDisabled && <TableCell align="center">Xoá</TableCell>}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {materialList?.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <Autocomplete
                                        options={materials}
                                        getOptionLabel={(option) => option.part_code || ''}
                                        fullWidth
                                        size="small"
                                        disabled={isDisabled}
                                        value={materials.find((item) => item.part_code === row.part_code) || null}
                                        onChange={(event, newValue) => handleChangeMaterialCode(index, newValue)}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                      />
                                    </TableCell>
                                    <TableCell align="left" className={classes.maxWidthCell} style={{ width: '30%' }}>
                                      <Tooltip title={row?.part_name}>
                                        <Autocomplete
                                          options={materials}
                                          getOptionLabel={(option) => option.title || ''}
                                          fullWidth
                                          size="small"
                                          disabled={isDisabled}
                                          value={materials.find((item) => item.part_code === row.part_code) || null}
                                          onChange={(event, newValue) => handleChangeMaterialCode(index, newValue)}
                                          renderInput={(params) => <TextField {...params} variant="outlined" />}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '15%' }}>
                                      <TextField
                                        InputProps={{
                                          inputProps: { min: 0 },
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        name="quantity_in_piece"
                                        type="number"
                                        size="small"
                                        disabled={isDisabled}
                                        value={row?.quantity_in_piece || ''}
                                        onChange={(e) => handleChangeMaterial(index, e)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.remain_quantity_in_piece}
                                    </TableCell>
                                    <TableCell align="left" style={{ width: '5%' }}>
                                      {row.unit_name}
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
                                        onChange={(e) => handleChangeMaterial(index, e)}
                                      />
                                    </TableCell>
                                    {isDetail && (
                                      <TableCell align="left" style={{ width: '10%' }}>
                                        {row.status_display}
                                      </TableCell>
                                    )}
                                    {!isDisabled && (
                                      <TableCell align="center" style={{ width: '5%' }}>
                                        <IconButton onClick={() => handleDeleteMaterial(index, row.id)}>
                                          <Delete />
                                        </IconButton>
                                      </TableCell>
                                    )}
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
                    folder="File Import/Contract"
                  />
                  <div className={`${classes.tabItemMentorAvatarBody}`} style={{ paddingBottom: 10, justifyContent: 'start' }}>
                    {isDetail && (
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

export default ContractModal;
