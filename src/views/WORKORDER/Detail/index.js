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
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, ORDER_DETAIL_CHANGE } from '../../../store/actions.js';
import { AddCircle, SkipNext, SkipPrevious } from '@material-ui/icons';
import { DeleteForever } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { month, rowsList, weekday } from './../data';

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

  const { selectedDocument } = useSelector((state) => state.document);
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { order } = useSelector((state) => state.order);
  const [rows2, setRows] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [indexDate, setIndexDate] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [workorderRequest, setWorkorderRequest] = React.useState({
    status_code: 1,
    title: '',
    date: '',
    date2: '',
    order_id: '',
    number_person: 1,
    number_hours: 1,
  });
  const [productionStatus, setProductionStatus] = React.useState([
    { key: 1, value: 'Nháp' },
    { key: 2, value: 'Hoàn thành' },
  ]);

  const [rows, setRowsList] = useState([]);
  const calculateQuantity = (vattu) => {
    const color = vattu === 'Thiếu' ? 'yellow' : 'rgb(48, 188, 65)';
    return <Typography style={{ backgroundColor: color }}>{vattu}</Typography>;
  };
  const [percent, setPercent] = useState(0);
  const handleChangeRow = (row, index) => {
    if (!!row) {
      rows2[index] = row;
      setRows([...rows2]);
      let per = 0;
      for (const value of rows2) {
        per = per + value.percent;
      }
      setPercent(per);
    }
  };
  const handleAddRow = () => {
    setRows([
      ...rows2,
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
        percent: 0,
        number: 1,
        vattu: '',
      },
    ]);
  };
  const handleDeleteRow = (index) => {
    rows2.splice(index, 1);

    setRows([...rows2]);
  };

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
    if (e.target.name === 'number_person' || e.target.name === 'number_hours') {
      dateList[indexDate].number_person = workorderRequest.number_person;
      dateList[indexDate].number_hours = workorderRequest.number_hours;
      setDateList(dateList);

      for (const value of rows2) {
        value.percent = calculatePercent(
          dateList[indexDate].number_person,
          dateList[indexDate].number_hours,
          value.piece,
          value.number,
          value.productivity
        );
      }
      let per = 0;
      for (const value of rows2) {
        per = per + value.percent;
      }
      setPercent(per);
      dateList[indexDate].rows = rows2;
      setDateList(dateList);
    }
  };

  const handleChangeNumber = (e, index) => {
    const value = e.target.value;
    let orderDetail = order?.orderDetail;
    orderDetail.find((x) => x.id === rows2[index].id).quantity_produced = value;
    dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: orderDetail });
    console.log(orderDetail);
    rows2[index].number = value;
    rows2[index].percent = calculatePercent(
      dateList[indexDate].number_person,
      dateList[indexDate].number_hours,
      rows2[index].piece,
      value,
      rows2[index].productivity
    );
    setRows([...rows2]);
    let per = 0;
    for (const value of rows2) {
      per = per + value.percent;
    }
    setPercent(per);
  };
  const calculatePercent = (number_person, number_hours, piece, sl, productivity) => {
    return parseFloat((((sl * piece) / (number_person * (number_hours / 8) * productivity)) * 100).toFixed(2));
  };
  const handleNextDate = () => {
    if (indexDate < dateList.length - 1) {
      if (end < indexDate + 2) {
        if (dateList.length - end >= 7) {
          setStart(start + 7);
          setEnd(end + 7);
        } else {
          setStart(dateList.length - 7);
          setEnd(dateList.length);
        }
      }
      let index = dateList.findIndex((obj) => obj.dateString === currentDate);
      dateList[index].rows = rows2;
      dateList[index].percent = percent;
      dateList[index].number_person = workorderRequest.number_person;
      dateList[index].number_hours = workorderRequest.number_hours;
      setDateList(dateList);
      setCurrentDate(dateList[indexDate + 1].dateString);
      setIndexDate(indexDate + 1);
      index = dateList.findIndex((obj) => obj.dateString === dateList[indexDate + 1].dateString);
      setRows([...dateList[index].rows]);
      setPercent(dateList[index].percent);
      setWorkorderRequest({
        ...workorderRequest,
        number_hours: dateList[index].number_hours,
        number_person: dateList[index].number_person,
      });
    }
  };
  const handleNextWeek = () => {
    if ((currentWeek + 1) * 7 < dateList.length) {
      setCurrentWeek(currentWeek + 1);
      setStart(start + 7);
      setEnd(end + 7);
    }
  };
  const handlePreWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
      setStart(start - 7);
      setEnd(end - 7);
    }
  };
  const handlePreDate = () => {
    if (indexDate > 0) {
      if (start > indexDate - 1) {
        if (end - 7 < 7) {
          setEnd(7);
          setStart(0);
        } else {
          setStart(start - 7);
          setEnd(end - 7);
        }
      }
      let index = dateList.findIndex((obj) => obj.dateString === currentDate);
      dateList[index].rows = rows2;
      dateList[index].percent = percent;
      dateList[index].number_person = workorderRequest.number_person;
      dateList[index].number_hours = workorderRequest.number_hours;
      setDateList(dateList);
      setCurrentDate(dateList[indexDate - 1].dateString);
      setIndexDate(indexDate - 1);
      index = dateList.findIndex((obj) => obj.dateString === dateList[indexDate - 1].dateString);
      setRows([]);
      setRows(dateList[index].rows);
      setPercent(dateList[index].percent);
      setWorkorderRequest({
        ...workorderRequest,
        number_hours: dateList[index].number_hours,
        number_person: dateList[index].number_person,
      });
    }
  };
  const handleChangeDate = (date, index) => {
    console.log(index);
    dateList[indexDate].rows = rows2;
    dateList[indexDate].percent = percent;
    dateList[indexDate].number_person = workorderRequest.number_person;
    dateList[indexDate].number_hours = workorderRequest.number_hours;
    setDateList(dateList);
    setCurrentDate(date);
    setIndexDate(index);
    setRows([]);
    setRows(dateList[index].rows);
    setPercent(dateList[index].percent);
    setWorkorderRequest({
      ...workorderRequest,
      number_hours: dateList[index].number_hours,
      number_person: dateList[index].number_person,
    });
  };

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
    if (!selectedDocument) return;
  }, [selectedDocument]);

  useEffect(() => {
    let dateCurrent = '';
    let dateCurrent2 = '';

    let date = new Date();
    if (date.getDate() < 10) {
      dateCurrent = date.getFullYear() + '-' + month[date.getMonth()] + '-0' + date.getDate();
    } else {
      dateCurrent =
        date.setDate(date.getDate() + 7).getFullYear() +
        '-' +
        month[date.setDate(date.getDate() + 7).getMonth()] +
        '-' +
        date.setDate(date.getDate() + 7).getDate();
    }
    date.setDate(date.getDate() + 7);
    if (date.getDate() < 10) {
      dateCurrent2 = date.getFullYear() + '-' + month[date.getMonth()] + '-0' + date.getDate();
    } else {
      dateCurrent2 = date.getFullYear() + '-' + month[date.getMonth()] + '-' + date.getDate();
    }
    setWorkorderRequest({ ...workorderRequest, date: dateCurrent, date2: dateCurrent2 });
  }, []);

  useEffect(() => {
    setRowsList(rowsList.filter((item) => item.order_id === order.id));
    console.log(order);
  }, [order.id]);

  useEffect(() => {
    setDateList([]);
    let date = [];
    if (workorderRequest.date !== '' && workorderRequest.date2 !== '') {
      for (var d = new Date(workorderRequest.date); d <= new Date(workorderRequest.date2); d.setDate(d.getDate() + 1)) {
        let dateString = d.getDate() + '/' + month[d.getMonth()];
        date = [
          ...date,
          {
            dateString: dateString,
            day: weekday[d.getDay()],
            rows: [],
            percent: 0,
            number_hours: 1,
            number_person: 1,
            number: 1,
          },
        ];
      }
      setStart(0);
      if (date.length > 7) {
        setEnd(7);
      } else {
        setEnd(date.length);
      }
      setCurrentDate(date[0].dateString);
      setDateList(date);
    }
  }, [workorderRequest.date, workorderRequest.date2]);
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
                              <Grid item lg={8} md={8} xs={8}>
                                <span className={classes.tabItemLabelField}>Tên kế hoạch sản xuất: </span>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  name="full_name"
                                  className={classes.inputField}
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid item lg={1} md={1} xs={1}></Grid>
                              <Grid item lg={3} md={3} xs={3}>
                                <span className={classes.tabItemLabelField}>Trạng thái: </span>
                                <TextField
                                  select
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  value={workorderRequest.status_code}
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
                                </TextField>
                              </Grid>
                            </Grid>

                            <Grid container className={classes.gridItemInfo}  >
                             
                              <Grid item lg={3} md={3} xs={3}>
                                <span className={classes.tabItemLabelField} >Thời gian lập kế hoạch:</span>
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

                              <Grid item lg={2} md={2} xs={2}>  </Grid>
                              <Grid item lg={3} md={3} xs={3}>
                                <span className={classes.tabItemLabelField}>Thời gian kết thúc:</span>
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
                          <Grid item lg={6} md={6} xs={12} style={{ background: 'rgba(224, 224, 224, 1)' }}>
                            <Grid container className={classes.gridItemInfo} alignItems="center" style={{marginTop: '20px'}}>
                              <Grid item lg={3} md={3} xs={3} alignItems="center">
                                <IconButton onClick={handlePreWeek}>
                                  <SkipPrevious />
                                </IconButton>
                                <span>{'Tuần '+(currentWeek+1)}</span>
                                <IconButton onClick={handleNextWeek}>
                                  <SkipNext />
                                </IconButton>
                              </Grid>
                              <Grid item lg={9} md={9} xs={9} >
                                <TableContainer component={Paper} >
                                  <Table size="small" classes={{ root: classes.customTable }} >
                                    <TableHead >
                                      <TableRow>
                                        {dateList?.slice(start, end).map((item,index) => (
                                          <TableCell align="center"  style={
                                            currentDate === item.dateString
                                              ? { background: 'rgb(97, 42, 255)', color: 'white' }
                                              : {}
                                          } onClick={()=>handleChangeDate(item.dateString,index+ currentWeek * 7)}>
                                            <span>
                                              {item.day}
                                              <br />
                                              {item.dateString}
                                            </span>
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {dateList?.slice(start, end).map((item) => (
                                          <TableCell component="th" scope="row" align="center">
                                            <Typography
                                              style={
                                                item?.percent >= 100
                                                  ? { backgroundColor: 'rgb(48, 188, 65)' }
                                                  : { backgroundColor: 'yellow' }
                                              }
                                            >
                                              {item.percent.toLocaleString()+"%"}
                                            </Typography>
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItemInfo} alignItems="center" justifyContent='flex-end'>
                            <Grid item lg={1} md={1} xs={1} >
                            <span className={classes.tabItemLabelField} style={{marginLeft: '-70px'}} >Chi tiết sản xuất:</span>
                            </Grid>
                            <Grid item lg={1} md={1} xs={1}></Grid>
                            <Grid item lg={1} md={1} xs={1}>
                             
                            </Grid>
                            <Grid item lg={1} md={1} xs={1}></Grid>
                            <Grid item lg={7} md={7} xs={7}>
                              <Grid container alignItems="center">
                                <Grid item lg={12} md={12} xs={12}>
                                  <Grid container alignItems="center">
                                    <Grid item lg={1.5} md={1.5} xs={1.5} >
                                      <span className={classes.tabItemLabelField}>{'Số người làm: '}</span>
                                    </Grid>
                                    <Grid item lg={1} md={1} xs={1}>
                                      <TextField
                                        style={{ marginLeft: '10px' }}
                                        type="number"
                                        variant="outlined"
                                        name="number_person"
                               
                                        InputProps={{ inputProps: { min: 1} }}
                                        value={workorderRequest.number_person}
                                        className={classes.inputField}
                                        onChange={handleChange}
                                      />
                                    </Grid>
                                    <Grid item lg={0.5} md={0.5} xs={0.5} >   </Grid>
                                    <Grid item lg={1.5} md={1.5} xs={1.5} style={{ marginLeft: '30px' }}>
                                      <span className={classes.tabItemLabelField}>{'Số giờ làm: '}</span>
                                    </Grid>
                                    <Grid item lg={1} md={1} xs={1}>
                                      <TextField
                                        type="number"
                                        variant="outlined"
                                        name="number_hours"
                                        InputProps={{ inputProps: { min: 1} }}
                                        value={workorderRequest.number_hours}
                                        className={classes.inputField}
                                        style={{ marginLeft: '10px' }}
                                        onChange={handleChange}
                                      />
                                    </Grid>

                                    <Grid item lg={1.5} md={1.5} xs={1.5} style={{ marginLeft: '30px' }}>
                                      <span className={classes.tabItemLabelField}>{'Công suất hiện tại: '}</span>
                                    </Grid>
                                    <Grid item lg={2} md={2} xs={2}>
                                      <TextField

                                        type="text"
                                        variant="outlined"
                                        disabled
                                        style={{ marginLeft: '10px' }}
                                        value={percent.toLocaleString()+"%"}
                                        className={classes.inputField}
                                        onChange={handleChange}
                                      />
                                    </Grid>


                                    <Grid item lg={1.5} md={1.5} xs={1.5} style={{ marginLeft: '30px' }}>
                                      <span className={classes.tabItemLabelField}>{'Công suất tổng: '}</span>
                                    </Grid>
                                    <Grid item lg={1} md={1} xs={1}>
                                      <TextField
                                        type="text"
                                        variant="outlined"
                                        disabled
                                        style={{ marginLeft: '10px' }}
                                        value={100}
                                        className={classes.inputField}
                                        onChange={handleChange}
                                      />
                                    </Grid>

                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>


                            <Grid item>
                              <IconButton
                                onClick={handleAddRow}
                                style={{ background: '#30bc41', color: '#FFFFFF' }}
                              >
                                <AddCircle></AddCircle>
                              </IconButton>
                            </Grid>
                          </Grid>





                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={12} md={12} xs={12}>
                            
                              <TableContainer style={{ maxHeight: 430 }}>
                                {/* <TableScrollbar height="350px"> */}
                                <Table size="small" stickyHeader aria-label="sticky table">
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
                                            disablePortal
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
                                            
                                            style={{ minWidth: 50 }}
                                            variant="outlined"
                                            InputProps={{ inputProps: { min: 1, max: item.quantity_in_box } }}
                                            // name="date"
                                            value={item.number}
                                            className={classes.inputField}
                                            onChange={(e) => handleChangeNumber(e, index)}
                                          />
                                        </TableCell>
                                        <TableCell align="left">{item.unit_name}</TableCell>
                                        <TableCell align="center">

                                          <span>{item.percent.toLocaleString() + '%'}</span>
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
