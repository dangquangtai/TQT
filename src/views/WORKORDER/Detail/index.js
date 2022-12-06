import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Box,
  Typography,
  Tab,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
  Paper,
  IconButton,
} from '@material-ui/core';
import TableScrollbar from 'react-table-scrollbar';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../store/constant.js';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions.js';
import { ArrowLeftRounded, ArrowRightRounded } from '@material-ui/icons';
import { AddCircle, SkipNext , SkipPrevious } from '@material-ui/icons';
import { Delete, Today as TodayIcon, DeleteForever } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Link } from 'react-router-dom';

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

const WorkorderModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const orderCode = [
    {
      id: '1',
      title: 'Đơn hàng 1',
      customer_name: 'Khách hàng 1',
      order_date: '01/01/2021',
    },
    {
      id: '2',
      title: 'Đơn hàng 2',
      customer_name: 'Khách hàng 2',
      order_date: '01/01/2021',
    },
  ];
  
  const orderDetailList = [
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 1200,
      product_customer_code: 'F921',
      product_name: 'Khăn lau kính.30g/c.20x30cm.3P (Nv,Br,Bk)',
      product_code: 'BST0008',
      id: '17a74935-7252-11ed-b85f-005056a3c175',
      status: '',
      order_id: '1',
      product_id: 'a4a304d8-6d69-11ed-b85f-005056a3c175',
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 500,
      product_customer_code: 'TVF-659',
      product_name: 'Khăn bếp.21g/c.33x33cm 5P (B,G,Y,P,O)',
      product_code: 'BST0002',
      id: '1',
      status: null,
      order_id: '1',
      product_id: 'a4a304d2-6d69-11ed-b85f-005056a3c175',
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 500,
      product_customer_code: 'TVF-658',
      product_name: 'Khăn hạt na.25g/c.26x37cm. 3P (P,Y,G)',
      product_code: 'BST0001',
      id: '5de651d4-7254-11ed-b85f-005056a3c175',
      status: null,
      order_id: '2',
      product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 100,
      product_customer_code: 'TVF-658',
      product_name: 'Khăn hạt na.25g/c.26x37cm. 3P (P,Y,G)',
      product_code: 'BST0001',
      id: 'f3febeac-7220-11ed-b85f-005056a3c175',
      status: null,
      order_id: '2',
      product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 500,
      quantity_in_box: 500,
      product_customer_code: 'TVF-659',
      product_name: 'Khăn bếp.21g/c.33x33cm 5P (B,G,Y,P,O)',
      product_code: 'BST0002',
      id: '1',
      status: null,
      order_id: '2',
      product_id: 'a4a304d2-6d69-11ed-b85f-005056a3c175',
    },
  ];
  const { selectedDocument } = useSelector((state) => state.document);
  const { detailDocument: openDialog, order_id} = useSelector((state) => state.floatingMenu);
  const [rows2, setRows] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [workorderRequest, setWorkorderRequest] = React.useState({
    status_code: '',
    title: '',
    date: '',
    date2:'',
    order_id: '',
  });
  const [productionStatus, setProductionStatus] = React.useState([
    { key: 1, value: 'Nháp' },
    { key: 2, value: 'Hoàn thành' },
  ]);


  const rows = [ {
    unit_name: 'Thùng',
    unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
    quantity_produced: 0,
    quantity_in_box: 1200,
    product_customer_code: 'F921',
    product_name: 'Khăn lau kính.30g/c.20x30cm.3P (Nv,Br,Bk)',
    product_code: 'BST0008',
    id: '17a74935-7252-11ed-b85f-005056a3c175',
    status: '',
    order_id: '1',
    product_id: 'a4a304d8-6d69-11ed-b85f-005056a3c175',
    vattu:'Thiếu',
  },
  {
    unit_name: 'Thùng',
    unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
    quantity_produced: 0,
    quantity_in_box: 500,
    product_customer_code: 'TVF-659',
    product_name: 'Khăn bếp.21g/c.33x33cm 5P (B,G,Y,P,O)',
    product_code: 'BST0002',
    id: '1',
    status: null,
    order_id: '1',
    product_id: 'a4a304d2-6d69-11ed-b85f-005056a3c175',
    vattu:'Đủ',
  },
  {
    unit_name: 'Thùng',
    unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
    quantity_produced: 0,
    quantity_in_box: 500,
    product_customer_code: 'TVF-658',
    product_name: 'Khăn hạt na.25g/c.26x37cm. 3P (P,Y,G)',
    product_code: 'BST0001',
    id: '5de651d4-7254-11ed-b85f-005056a3c175',
    status: null,
    order_id: '2',
    product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
    vattu:'Thiếu',
  },
  {
    unit_name: 'Thùng',
    unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
    quantity_produced: 0,
    quantity_in_box: 100,
    product_customer_code: 'TVF-658',
    product_name: 'Khăn hạt na.25g/c.26x37cm. 3P (P,Y,G)',
    product_code: 'BST0001',
    id: 'f3febeac-7220-11ed-b85f-005056a3c175',
    status: null,
    order_id: '2',
    product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
    vattu:'Đủ',
  },
  {
    unit_name: 'Thùng',
    unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
    quantity_produced: 500,
    quantity_in_box: 500,
    product_customer_code: 'TVF-659',
    product_name: 'Khăn bếp.21g/c.33x33cm 5P (B,G,Y,P,O)',
    product_code: 'BST0002',
    id: '1',
    status: null,
    order_id: '2',
    product_id: 'a4a304d2-6d69-11ed-b85f-005056a3c175',
    vattu:'Đủ',
  },];
  const calculateQuantity = (vattu) => {
    const color = vattu == 'Thiếu' ? 'yellow' : 'green';

    return <Typography style={{ backgroundColor: color }}>{vattu}</Typography>;
  };
  const handleChangeRow = (row, index) => {
    rows2[index].unit_id=row.unit_id ;
    rows2[index].quantity_produced=row.quantity_produced ;
    rows2[index].quantity_in_box=row.quantity_in_box ;
    rows2[index].product_customer_code=row.product_customer_code ;
    rows2[index].product_name=row.product_name ;
    rows2[index].product_code=row.product_code ;
    rows2[index].id=row.id ;
    rows2[index].unit_name=row.unit_name ;
    rows2[index].status=row.status ;
    rows2[index].order_id=row.order_id ;
    rows2[index].product_id=row.product_id ;
    rows2[index].vattu=row.vattu ;
    setRows([...rows2]);
  };
  const handleAddRow = () => {
    setRows([...rows2, {  unit_name: 'Thùng',
    unit_id: '',
    quantity_produced: 0,
    quantity_in_box: 0,
    product_customer_code: '',
    product_name: '',
    product_code: '',
    id: '',
    status: null,
    order_id: '',
    product_id: '', }]);
  };
  const handleDeleteRow = (index) => {
    rows2.splice(index, 1);
    setRows([...rows2]);
  };
  useEffect(() => {
    if (!selectedDocument) return;
  }, [selectedDocument]);
  useEffect(() => {
  }, [order_id]);
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const month = [1,2,3,4,5,6,7,8,9,10,11,12];
  useEffect(() => {
    setDateList([]);
    let date=[];
    if (workorderRequest.date!='' && workorderRequest.date2!=''){
      for (var d = new Date(workorderRequest.date); d <= new Date(workorderRequest.date2); d.setDate(d.getDate() + 1)) {
        date=[...date,weekday[d.getDay()]+' \n '+ d.getDate()+'/'+month[d.getMonth()]]
    
    }
    setDateList(date);
    }
  }, [workorderRequest.date, workorderRequest.date2]);
  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false });
  };
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });
  const handleOpenSnackbar = (isOpen, type, text) => {
    setSnackbarStatus({
      isOpen: isOpen,
      type: type,
      text: text,
    });
  };
  const handleUpdateAccount = async () => {
    // try {
    //   if (!workorderRequest.id) {
    //     let check = true;
    //     if (check == true) {
    //       handleOpenSnackbar(true, 'success', 'Tạo mới thành công!');
    //       dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'account' });
    //       handleCloseDialog();
    //     } else {
    //       handleOpenSnackbar(true, 'error', 'Tài khoản đã tồn tại!');
    //     }
    //   } else {
    //     let check = true;
    //     if (check == true) {
    //       handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
    //       dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'account' });
    //       handleCloseDialog();
    //     } else {
    //       handleOpenSnackbar(true, 'error', 'Tài khoản đã tồn tại!');
    //     }
    //   }
    // } catch (error) {
    //   handleOpenSnackbar(true, 'error', 'Vui lòng chọn ngày tháng năm sinh!');
    // } finally {
    // }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setWorkorderRequest({
      ...workorderRequest,
      [e.target.name]: value,
    });
  };

  const setDocumentToDefault = async () => {
    setTabIndex(0);
  };

  return (
    <React.Fragment>
      {snackbarStatus.isOpen && (
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
      )}

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
              Thông tin kế hoạch
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
                        Thông tin
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <AccountCircleOutlinedIcon className={`${tabIndex === 0 ? classes.tabActiveIcon : ''}`} />
                        Mục tiêu sản xuất
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
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={5} md={5} xs={5}>
                                  <span className={classes.tabItemLabelField}>Tên kế hoạch sản xuất: </span>
                                </Grid>
                                <Grid item lg={4} md={4} xs={4}></Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Trạng thái: </span>
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={8} md={8} xs={8}>
                                  <TextField
                                    fullWidth
                                    rows={1}
                                    rowsMax={1}
                                    variant="outlined"
                                    name="full_name"
                                    // value={''}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}></Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <Select
                                    className={classes.multpleSelectField}
                                    // value={workorderRequest.status_code}
                                    onChange={(event) =>
                                      setWorkorderRequest({ ...workorderRequest, status_code: event.key })
                                    }
                                  >
                                    {productionStatus &&
                                      productionStatus.map((item) => (
                                        <MenuItem key={item.key} value={item.key}>
                                          {item.value}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </Grid>

                              </Grid>

                              <Grid container className={classes.gridItemInfo}>
                                <Grid item lg={7} md={7} xs={7}>
                                  <span className={classes.tabItemLabelField}>Thời gian lập kế hoạch:</span>
                                </Grid>

                                <Grid item lg={5} md={5} xs={5}>
                                  <span className={classes.tabItemLabelField}>Thời gian kết thúc kế hoạch:</span>
                                </Grid>
                              </Grid>

                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={5} md={5} xs={5}>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    name="date"
                                    value={workorderRequest.date}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>
                                <Grid item lg={2} md={2} xs={2}></Grid>
                                <Grid item lg={5} md={5} xs={5}>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    name="date2"
                                    value={workorderRequest.date2}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>
                             
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}>
                                  <span>Chi tiết sản xuất:</span>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={3} md={3} xs={3}  alignItems="center">
                                <IconButton >
                                  <SkipPrevious/>
                                </IconButton>
                                <span>{' 14/12 '}</span>
                                <IconButton >
                                  <SkipNext/>
                                </IconButton>
                                </Grid>
                                <Grid item lg={9} md={9} xs={9}>
                                  <TableContainer component={Paper} >
                                    <Table aria-label="simple table">
                                      <TableHead>
                                        <TableRow>
                                          {dateList?.slice(0,6).map((item)=>(
                                             <TableCell align="right">{item}</TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {dateList?.slice(0,6).map((item)=>(
                                             <TableCell component="th" scope="row"></TableCell>
                                          ))}
                                         
                                          
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={2} md={2} xs={2}>
                                  <span className={classes.tabItemLabelField}>Số người làm:</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  <TextField
                                    fullWidth
                                    type="text"
                                    variant="outlined"
                                    // name="date"
                                    // value={workorderRequest.date}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>
                              </Grid>
                             
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={2} md={2} xs={2}>
                                  <span className={classes.tabItemLabelField}>Số giờ làm:</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  <TextField
                                    fullWidth
                                    type="text"
                                    variant="outlined"
                                    // name="date"
                                    // value={workorderRequest.date}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}></Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Công xuất hiện tại 50%</span>
                                </Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Công xuất hiện tại 100%</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}></Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  <IconButton onClick={handleAddRow} style={{background:'#30bc41',  color:'#FFFFFF'}}>
                                    <AddCircle></AddCircle>
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItem} alignItems="center">
                              <Grid item lg={12} md={12} xs={12}>
                                <TableContainer>
                                <TableScrollbar height='300px'>
                                  <Table  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell align="left">Mã ĐH</TableCell>
                                        <TableCell align="left">Mã TP của TQT</TableCell>
                                        <TableCell align="left">Mã TP của KH</TableCell>
                                        <TableCell align="left">Mã TP theo TQT(Mã hiển thị)</TableCell>
                                        <TableCell align="left">SL</TableCell>
                                        <TableCell align="left">Đơn vị tính theo TP giao cho KH</TableCell>
                                        <TableCell align="left">% công suất</TableCell>
                                        <TableCell align="left">Vật tư</TableCell>
                                        <TableCell align="left"></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {rows2?.map((item, index) => (
                                        <TableRow
                                          key={index}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                           <TableCell align="left">{index + 1}</TableCell>
                                           <TableCell align="left">{index + 1}</TableCell>
                                           <TableCell align="left"> 
                                        <Autocomplete
                                              style={{ minWidth: 240, maxWidth: 240, marginRight: 10 }}
                                              size="small"
                                              fullWidth
                                              options={rows}
                                              onChange={(e, u) => handleChangeRow(u, index)}
                                              getOptionLabel={(option) => option.product_code}
                                              renderInput={(params) => (
                                                <TextField  {...params} variant="outlined" />
                                              )}
                                            /></TableCell>
                                       
                                        <TableCell align="left">{item.product_customer_code}</TableCell>
                                        <TableCell align="left">{item.product_name}</TableCell>
                                        <TableCell align="left"> 
                                        <TextField
                                              fullWidth
                                              type="number"
                                              defaultValue={0}
                                              style={{ minWidth: 100 }}
                                              variant="outlined"
                                              InputProps={{ inputProps: { min: 0, max: item.quantity_in_box } }}
                                              // name="date"
                                              // value={workorderRequest.date}
                                              className={classes.inputField}
                                              onChange={handleChange}
                                            /></TableCell>
                                        <TableCell align="left">{item.unit_name}</TableCell>
                                        <TableCell align="center"><Typography style={{ backgroundColor: 'yellow' }}>{0}</Typography></TableCell>
                                        <TableCell align="center">  {calculateQuantity(item.vattu)}</TableCell>
                                          <TableCell align="right">
                                            <IconButton onClick={() => handleDeleteRow(index)} style={{background:'#f9c121', color:'#FFFFFF'}}>
                                              <DeleteForever />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  </TableScrollbar>
                                </TableContainer>
                              </Grid>

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
              <Grid item>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    {/* <Link to={`/dashboard/workorder/${workorderRequest.id}`} target="_blank" rel="noopener noreferrer"> */}
                    <Button
                      variant="contained"
                      style={{ background: 'rgb(97, 42, 255)' }}
                      component={Link}
                      to={`/dashboard/workorder/${workorderRequest.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mục tiêu sản xuất
                    </Button>
                    {/* </Link> */}
                  </Grid>
                  {!workorderRequest.id && (
                    <Grid item>
                      <Button
                        variant="contained"
                        style={{ background: 'rgb(97, 42, 255)' }}
                        onClick={() => handleUpdateAccount()}
                      >
                        {'Tạo mới'}
                      </Button>
                    </Grid>
                  )}
                  {!!workorderRequest.id && (
                    <Grid item>
                      <Button
                        variant="contained"
                        style={{ background: 'rgb(97, 42, 255)' }}
                        onClick={() => handleUpdateAccount()}
                      >
                        Lưu
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default WorkorderModal;
