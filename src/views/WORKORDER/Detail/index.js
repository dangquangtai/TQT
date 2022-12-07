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
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../store/constant.js';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions.js';
import { ArrowLeftRounded, ArrowRightRounded } from '@material-ui/icons';
import { AddCircle, SkipNext, SkipPrevious } from '@material-ui/icons';
import { Delete, Today as TodayIcon, DeleteForever } from '@material-ui/icons';

import { Autocomplete } from '@material-ui/lab';
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

 
  const { selectedDocument } = useSelector((state) => state.document);
  const { detailDocument: openDialog, order_id } = useSelector((state) => state.floatingMenu);
  const { order } = useSelector((state) => state.order);
  const [rows2, setRows] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [indexDate, setIndexDate] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [workorderRequest, setWorkorderRequest] = React.useState({
    status_code: '',
    title: '',
    date: '',
    date2: '',
    order_id: '',
    number_person: 0,
    number_hours: 0,
  });
  const [productionStatus, setProductionStatus] = React.useState([
    { key: 1, value: 'Nháp' },
    { key: 2, value: 'Hoàn thành' },
  ]);

  const rowsList = [
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
      order_id: 'KHT10-001',
      product_id: 'a4a304d8-6d69-11ed-b85f-005056a3c175',
      vattu: 'Thiếu',
      percent: 30,
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
      order_id: 'KHT10-001',
      product_id: 'a4a304d2-6d69-11ed-b85f-005056a3c175',
      vattu: 'Đủ',
      percent: 30,
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
      order_id: 'KHT10-002',
      product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
      vattu: 'Thiếu',
      percent: 30,
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 100,
      product_customer_code: 'TVF-658',
      product_name: 'Khăn hạt na.25g/c.26x37cm. 3P (P,Y,G)',
      product_code: 'BST0003',
      id: 'f3febeac-7220-11ed-b85f-005056a3c175',
      status: null,
      order_id: 'KHT10-002',
      product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
      vattu: 'Đủ',
      percent: 10,
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 500,
      quantity_in_box: 500,
      product_customer_code: 'TVF-659',
      product_name: 'Khăn bếp.21g/c.33x33cm 5P (B,G,Y,P,O)',
      product_code: 'BST0007',
      id: '1',
      status: null,
      order_id: 'KHT10-002',
      product_id: 'a4a304d2-6d69-11ed-b85f-005056a3c175',
      vattu: 'Thiếu',
      percent: 30,
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 1200,
      product_customer_code: 'F921',
      product_name: 'Khăn lau kính.30g/c.20x30cm.3P (Nv,Br,Bk)',
      product_code: 'BST0009',
      id: '17a74935-7252-11ed-b85f-005056a3c175',
      status: '',
      order_id: 'KHT10-001',
      product_id: 'a4a304d8-6d69-11ed-b85f-005056a3c175',
      vattu: 'Đủ',
      percent: 20,
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 500,
      product_customer_code: 'TVF-659',
      product_name: 'Khăn bếp.21g/c.33x33cm 5P (B,G,Y,P,O)',
      product_code: 'BST00012',
      id: '1',
      status: null,
      order_id: 'KHT10-001',
      product_id: 'a4a304d2-6d69-11ed-b85f-005056a3c175',
      vattu: 'Thiếu',
      percent: 30,
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 500,
      product_customer_code: 'TVF-658',
      product_name: 'Khăn hạt na.25g/c.26x37cm. 3P (P,Y,G)',
      product_code: 'BST00011',
      id: '5de651d4-7254-11ed-b85f-005056a3c175',
      status: null,
      order_id: 'KHT10-002',
      product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
      vattu: 'Đủ',
      percent: 40,
    },
    {
      unit_name: 'Thùng',
      unit_id: 'ccd58746-67df-11ed-b85d-005056a3c175',
      quantity_produced: 0,
      quantity_in_box: 100,
      product_customer_code: 'TVF-658',
      product_name: 'Khăn hạt na.25g/c.26x37cm. 3P (P,Y,G)',
      product_code: 'BST00013',
      id: 'f3febeac-7220-11ed-b85f-005056a3c175',
      status: null,
      order_id: 'KHT10-002',
      product_id: 'a4a304d1-6d69-11ed-b85f-005056a3c175',
      vattu: 'Đủ',
      percent: 30,
    },
  ];
  const [rows,setRowsList] = useState([]);
  const calculateQuantity = (vattu) => {
    const color = vattu == 'Thiếu' ? 'yellow' : 'rgb(48, 188, 65)';
    return <Typography style={{ backgroundColor: color }}>{vattu}</Typography>;
  };
  const [percent, setPercent] =useState(0);
  const handleChangeRow = (row, index) => {
    rows2[index]= row;
    setRows([...rows2]);
    setPercent(0);
    for (const value of rows2) {
      setPercent(percent+ value.percent);
    }
  };
  const handleAddRow = () => {
    setRows([
      {
        unit_name: 'Thùng',
        unit_id: '',
        quantity_produced: 0,
        quantity_in_box: 0,
        product_customer_code: '',
        product_name: '',
        product_code: '',
        id: '',
        status: null,
        order_id: '',
        product_id: '',
      },
      ...rows2
      
    ]);
  
  };
  const handleDeleteRow = (index) => {
    rows2.splice(index, 1);
    setRows([...rows2]);
  };
  useEffect(() => {
    if (!selectedDocument) return;
  }, [selectedDocument]);
  useEffect(() => {
    let dateCurrent='';
    let dateCurrent2='';
    const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    let date = new Date()
    if (date.getDate()<10){
      dateCurrent= date.getFullYear()+'-'+ month[date.getMonth()] + '-0'+date.getDate()
    }
    else {
   
      dateCurrent= date.setDate(date.getDate() + 7).getFullYear()+'-'+ month[date.setDate(date.getDate() + 7).getMonth()] + '-'+date.setDate(date.getDate() + 7).getDate()
    }
    date.setDate(date.getDate() + 7)
    if (date.getDate()<10){
    dateCurrent2= date.getFullYear()+'-'+ month[date.getMonth()] + '-0'+date.getDate()
    }
    else{
      dateCurrent2= date.getFullYear()+'-'+ month[date.getMonth()] + '-'+date.getDate()
    }
    setWorkorderRequest({...workorderRequest, date: dateCurrent, date2: dateCurrent2});
  }, []);
  useEffect(() => {
    setRowsList(rowsList.filter((item) => item.order_id === order.id));
  }, [order.id]);
  const weekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  useEffect(() => {
    setDateList([]);
    let date = [];
    if (workorderRequest.date != '' && workorderRequest.date2 != '') {
      for (var d = new Date(workorderRequest.date); d <= new Date(workorderRequest.date2); d.setDate(d.getDate() + 1)) {
        let dateString = d.getDate() + '/' + month[d.getMonth()]
        date = [...date, {dateString: dateString, day: weekday[d.getDay()], rows: [], percent: 0, number_hours:0,number_person:0, number:0}];
      }
      setStart(0);
      if (date.length>7){
        setEnd(7);
      } else {
        setEnd(date.length);
      }
      setCurrentDate(date[0].dateString);
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
  const handleChangeNumber = (e,index) => {
    const value = e.target.value;
    rows2[index].number= value;
    setRows([...rows2]);
  };
  const handleNextDate = () =>{
    if (end < indexDate + 2){
      if (dateList.length - end >= 7){
        setStart(start + 7)
        setEnd(end + 7);
      }
      else {
        setStart(dateList.length - 7)
        setEnd(dateList.length)
      }
    }
    let index = dateList.findIndex(obj => obj.dateString === currentDate);
    dateList[index].rows=rows2;
    dateList[index].percent=percent
    dateList[index].number_person=workorderRequest.number_person
    dateList[index].number_hours=workorderRequest.number_hours
    setDateList(dateList);
    setCurrentDate(dateList[indexDate + 1].dateString);
    setIndexDate(indexDate + 1);
    index = dateList.findIndex(obj => obj.dateString === dateList[indexDate + 1].dateString);
    setRows([...dateList[index].rows]);
    setPercent(dateList[index].percent);
    setWorkorderRequest({...workorderRequest, number_hours: dateList[index].number_hours,number_person:dateList[index].number_person})
  }
  const handlePreDate = () =>{
    if (start > indexDate -1 ){
      if ((end - 7 < 7)){
        setEnd(7);
        setStart(0);
      }
      else{
        setStart(start - 7);
        setEnd(end -7);
      }
    }
    let index = dateList.findIndex(obj => obj.dateString === currentDate);
    dateList[index].rows=rows2;
    dateList[index].percent=percent
    dateList[index].number_person=workorderRequest.number_person
    dateList[index].number_hours=workorderRequest.number_hours
    setDateList(dateList);
    setCurrentDate(dateList[indexDate - 1].dateString);
    setIndexDate(indexDate - 1);
    index = dateList.findIndex(obj => obj.dateString === dateList[indexDate - 1].dateString);
    setRows([]);
    setRows(dateList[index].rows);
    setPercent(dateList[index].percent);
    setWorkorderRequest({...workorderRequest, number_hours: dateList[index].number_hours,number_person:dateList[index].number_person})
  }
  const setDocumentToDefault = async () => {
    setTabIndex(0);
  };

  const popupWindow = (url, title, h) => {
    var width = window.outerWidth ? window.outerWidth : document.documentElement.clientWidth;
    var height = window.outerHeight ? window.outerHeight : document.documentElement.clientHeight;

    var w = width * 0.9;

    var left = width / 2 - w / 2;
    var top = height / 2 - h / 2;
    var newWindow = window.open(
      url,
      title,
      'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left
    );

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  };

  useEffect(() => {
    console.log(order);
  }, [order]);

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
                            
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3} alignItems="center">
                                  {indexDate > 0 && (
                                     <IconButton onClick={handlePreDate}>
                                     <SkipPrevious />
                                   </IconButton>
                                  )}
                                 
                                 <TextField
                                    style={{maxWidth:80}}
                                    type="text"
                                    variant="outlined"
                                    disabled
                                    value={currentDate}
                                    className={classes.inputField}
                                   
                                  />
                                  {indexDate < (dateList.length - 1) &&(
                                    <IconButton onClick={handleNextDate}>
                                    <SkipNext />
                                  </IconButton>
                                  )}
                                  
                                </Grid>
                                <Grid item lg={9} md={9} xs={9}>
                                  <TableContainer component={Paper}>
                                    <Table size="small" stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {dateList?.slice(start, end).map((item) => (
                                            <TableCell align="center"><span>{item.day}<br/>{item.dateString}</span></TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          {dateList?.slice(start, end).map((item) => (
                                            <TableCell component="th" scope="row" align="center"><Typography style={ item?.percent === 100?{ backgroundColor: 'rgb(48, 188, 65)' }:{ backgroundColor: 'yellow' } }>{item.percent}</Typography></TableCell>
                                          ))}
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Grid>
                              </Grid>
                            </Grid>
                      
                            <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={6} md={6} xs={6}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Chi tiết sản xuất:</span>
                                </Grid>    
                                <Grid item lg={6} md={6} xs={6}></Grid>
                                <Grid item lg={1.5} md={1.5} xs={1.5}>
                                  <span className={classes.tabItemLabelField}>Số người làm:</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  <TextField
                                    style={{maxWith: 50 }}
                                    type="text"
                                    variant="outlined"
                                    name="number_person"
                                    value={workorderRequest.number_person}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>
                              </Grid>
                              </Grid>
                              <Grid item lg={6} md={6} xs={6}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={1.5} md={1.5} xs={1.5} alignContent='right'>
                                  <span className={classes.tabItemLabelField}>Số giờ làm:</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                <TextField
                                  type="text"
                                  variant="outlined"
                                  name="number_hours"
                                  value={workorderRequest.number_hours}
                                  className={classes.inputField}
                                  fullWidth
                                  onChange={handleChange}
                                />
                                </Grid>
                                <Grid item lg={1} md={1} xs={1} alignContent='right'></Grid>
                                <Grid item lg={1.5} md={1.5} xs={1.5}>
                                  <span className={classes.tabItemLabelField}>Công suất hiện tại</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                   <TextField
                                    fullWidth
                                    type="text"
                                    variant="outlined"
                                    disabled
                                    value={percent}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                  </Grid>
                                <Grid item lg={1} md={1} xs={1} alignContent='right'></Grid>
                                 
                                 
                                <Grid item lg={1.5} md={1.5} xs={1.5}>
                                  <span className={classes.tabItemLabelField}>Công suất tổng</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  <TextField
                                  
                                    type="text"
                                    variant="outlined"
                                    disabled
                                    value={100}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                  </Grid>
                                  <Grid item lg={1} md={1} xs={1} alignContent='right'></Grid>
                              
                                <Grid item lg={1} md={1} xs={1} alignItems='right'>
                                  <IconButton
                                    onClick={handleAddRow}
                                    style={{ background: '#30bc41', color: '#FFFFFF' }}
                                  >
                                    <AddCircle></AddCircle>
                                  </IconButton>
                                </Grid>
                                </Grid>
                              </Grid>
                              </Grid>
                      
                            <Grid container className={classes.gridItem} alignItems="center">
                              <Grid item lg={12} md={12} xs={12}>

                                <TableContainer style={{ maxHeight: 350 }} >
                                  {/* <TableScrollbar height="350px"> */}
                                    <Table size="small" stickyHeader aria-label="sticky table" scrollToIndex={1000} >
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>STT</TableCell>
                                          <TableCell align="left">Mã ĐH</TableCell>
                                          <TableCell align="left">Mã TP của TQT</TableCell>
                                          <TableCell align="left">Mã TP của KH</TableCell>
                                          <TableCell align="left">Mã TP theo TQT(Mã hiển thị)</TableCell>
                                          <TableCell align="left">SL</TableCell>
                                          <TableCell align="left">Đơn vị</TableCell>
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
                                            hover
                                          >
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell align="left">{item.order_id}</TableCell>
                                            <TableCell align="left">
                                              <Autocomplete
                                                value={item}
                                                size="small"
                                                fullWidth
                                                options={rows}
                                                onChange={(e, u) => handleChangeRow(u, index)}
                                                getOptionLabel={(option) => option.product_code}
                                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                                              />
                                            </TableCell>

                                            <TableCell align="left">{item.product_customer_code}</TableCell>
                                            <TableCell align="left">{item.product_name}</TableCell>
                                            <TableCell align="left">
                                              <TextField
                                                fullWidth
                                                type="number"
                                                defaultValue={0}
                                                style={{ minWidth: 50 }}
                                                variant="outlined"
                                                InputProps={{ inputProps: { min: 0, max: item.quantity_in_box } }}
                                                // name="date"
                                                value={item.number}
                                                className={classes.inputField}
                                                onChange={(e)=>handleChangeNumber(e,index)}
                                              />
                                            </TableCell>
                                            <TableCell align="left">{item.unit_name}</TableCell>
                                            <TableCell align="center">
                                              <span>{item.percent+'%'}</span>
                                            </TableCell>
                                            <TableCell align="center"> {calculateQuantity(item.vattu)}</TableCell>
                                            <TableCell align="right">
                                              <IconButton
                                                onClick={() => handleDeleteRow(index)}
                                                style={{ background: '#f9c121', color: '#FFFFFF' }}
                                              >
                                                <DeleteForever />
                                              </IconButton>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  {/* </TableScrollbar> */}
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
                      onClick={() =>
                        popupWindow(`/dashboard/workorder/${workorderRequest.id}`, `Mục tiêu sản xuất`, 400)
                      }
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
