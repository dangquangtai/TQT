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
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, ORDER_DETAIL_CHANGE } from '../../../store/actions.js';
import {  SkipNext, SkipPrevious } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { month, dropdownDataList, weekday } from './../data';
import { Delete} from '@material-ui/icons';
import { AddCircleOutline } from '@material-ui/icons';
import {getStatusList, createWorkorOrder} from '../../../services/api/Workorder/index.js';
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
  const { selectedDocument } = useSelector((state) => state.document);
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { order } = useSelector((state) => state.order);
  const { order: orderRedux } = useSelector((state) => state.order);
  const [productList, setProductList] = useState([{
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
    number: 0,
    vattu: '',
  }]);
  const [productionDailyRequestList, setProductionDailyRequest] = useState([]);
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [indexDate, setIndexDate] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [workorderRequest, setWorkorderRequest] = React.useState({
    status_code: '',
    title: '',
    to_date: '',
    from_date: '',
    order_id: '',
  });
  const [productionStatus, setProductionStatus] = React.useState([
    {id:'',
    value:''}
  ]);

  const [dropdownData, setDopDownData] = useState([]);
  const calculateQuantity = (vattu) => {
    const color = vattu === 'Thiếu' ? 'yellow' : 'rgb(48, 188, 65)';
    return <Typography style={{ backgroundColor: color }}>{vattu}</Typography>;
  };
  const [percent, setPercent] = useState(0);
  
  const handleChangeRow = (row, index) => {
    if (!!row) {
      const newProductList = [...productList];
      const newProduct = {
          unit_name: row?.unit_name || 'Thùng',
          unit_id: row?.unit_id,
          quantity_produced: row?.quantity_produced,
          quantity_in_box: row?.quantity_in_box,
          product_customer_code: row?.product_customer_code,
          product_name: row?.product_name,
          product_code: row?.product_code,
          id: row?.id,
          status: null,
          order_id: row?.order_id,
          product_id: row?.product_id,
          vattu: row?.vattu,
          no_piece_per_box: row?.no_piece_per_box,
          productivity_per_worker: row?.productivity_per_worker,
        
      };
      newProductList[index] = { ...newProductList[index], ...newProduct };
      let data = newProductList.find((x)=>x.id==='')
      if(!data){
        setProductList([...newProductList,  {
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
          vattu: '',
        },]);
        
      } else {
        setProductList(newProductList);
      }
     
      let per = 0;
      for (const value of productList) {
        per = per + value.percent;
      }
      setPercent(per);
      
    }
  };
  const handleAddRow = () => {
    setProductList([
      ...productList,
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
        vattu: '',
      },
    ]);
  };
  const handleDeleteRow = (index) => {
    if(productList[index].id!=''){
      let orderDetail = order?.orderDetail;
      orderDetail.find((x) => (x.id === productList[index].id )).quantity_produced -= productList[index].number;
      dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: orderDetail });
    }
    productList.splice(index, 1);
    let per = 0;
      for (const value of productList) {
        per = per + value.percent;
      }
    setPercent(per);
    setProductList([...productList]);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false  });
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
  const handleCreateWorkOrder = async () => {
    await createWorkorOrder({
      to_date: workorderRequest.to_date, 
      from_date: workorderRequest.from_date,
      title: workorderRequest.title,
      order_id: order.id,
      status_code: workorderRequest.status_code,
      daily_request_list: [...productionDailyRequestList]})
  };
  const handleChangeStatus = (e) => {
    const value = e.target.value;
    
    setWorkorderRequest({
      ...workorderRequest,
      status_code: value,
    });
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setWorkorderRequest({
      ...workorderRequest,
      [e.target.name]: value,
    });
    if (e.target.name === 'number_of_worker' || e.target.name === 'number_of_working_hour') {
      productionDailyRequestList[indexDate].number_of_worker = workorderRequest.number_of_worker;
      productionDailyRequestList[indexDate].number_of_working_hour = workorderRequest.number_of_working_hour;
      setProductionDailyRequest(productionDailyRequestList);

      for (const value of productList) {
        value.percent = calculatePercent(
          productionDailyRequestList[indexDate].number_of_worker,
          productionDailyRequestList[indexDate].number_of_working_hour,
          value.piece,
          value.number,
          value.productivity_per_worker
        );
      }
      let per = 0;
      for (const value of productList) {
        per = per + value.percent;
      }
      setPercent(per);
      productionDailyRequestList[indexDate].product_list = productList;
      setProductionDailyRequest(productionDailyRequestList);
    }
  };

  const handleChangeNumber = (e, index) => {
    const value = e.target.value;
    let orderDetail = order?.orderDetail;
    orderDetail.find((x) => x.id === productList[index].id).quantity_produced += value - productList[index].number;
    dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: orderDetail });
    productList[index].quantity_in_box=value;
    setProductList([...productList]);
    let per = 0;
    for (const value of productList) {
      per = per + value.percent;
    }
    setPercent(per);
  };
  const calculatePercent = (number_of_worker, number_of_working_hour, piece, sl, productivity_per_worker) => {
   
    return parseFloat((((sl * piece) / (number_of_worker * (number_of_working_hour / 8) * productivity_per_worker)) * 100).toFixed(2));
  };
  
  const handleNextWeek = () => {
    if ((currentWeek + 1) * 7 < productionDailyRequestList.length) {
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
  
  const handleChangeDate = (date, index) => {
    productionDailyRequestList[indexDate].product_list =[...productList];
    productionDailyRequestList[indexDate].percent = percent;
    productionDailyRequestList[indexDate].number_of_worker = workorderRequest.number_of_worker;
    productionDailyRequestList[indexDate].number_of_working_hour = workorderRequest.number_of_working_hour;
    setProductionDailyRequest(productionDailyRequestList);
    setCurrentDate(date);
    setIndexDate(index);
    setProductList(productionDailyRequestList[index].product_list);
    setPercent(productionDailyRequestList[index].percent);
    setWorkorderRequest({
      ...workorderRequest,
      number_of_working_hour: productionDailyRequestList[index].number_of_working_hour,
      number_of_worker: productionDailyRequestList[index].number_of_worker,
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
    if (!selectedDocument) {
      let dateCurrent = '';
      let dateCurrent2 = '';
      let date = new Date();
      if (date.getDate() < 10) {
        dateCurrent = date.getFullYear() + '-' + month[date.getMonth()] + '-0' + date.getDate();
      } else {    
        dateCurrent = date.getFullYear() +
          '-' +
          month[date.getMonth()] +
          '-' +
          date.getDate();
      }
      date.setDate(date.getDate() + 7);
      if (date.getDate() < 10) {
        dateCurrent2 = date.getFullYear() + '-' + month[date.getMonth()] + '-0' + date.getDate();
      } else {
        dateCurrent2 = date.getFullYear() + '-' + month[date.getMonth()] + '-' + date.getDate();
      }
      fetchStatus();
      setWorkorderRequest({ ...workorderRequest, from_date: dateCurrent, to_date: dateCurrent2 }); 
    } else{
      setWorkorderRequest({
        title: selectedDocument.order_title, 
        to_date: selectedDocument.to_date, 
        from_date: selectedDocument.from_date,
        status_code: selectedDocument.status,
      })
      setProductionDailyRequest(selectedDocument.production_daily_request)
    }
  }, [selectedDocument]);

  const fetchStatus = async () =>{
    let data= await getStatusList();
    setProductionStatus(data);
  }


  useEffect(() => {
    if (orderRedux.orderDetail?.length > 0) setDopDownData(orderRedux.orderDetail);
  }, [order.id]);

  useEffect(() => {
    setProductionDailyRequest([]);
    let date = [];
    if (workorderRequest.to_date!== '' && workorderRequest.from_date !== '') {
      for (var d = new Date(workorderRequest.from_date); d <= new Date(workorderRequest.to_date); d.setDate(d.getDate() + 1)) {
        const day = d ;
        date = [
          ...date,
          {
            work_order_date: day,
            product_list: [{
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
              vattu: '',
            }],
            number_of_working_hours: 1,
            number_of_worker: 1,
          },
        ];
      }
      
      if (date.length > 7) {
        setEnd(7);
        setStart(0);
        setCurrentDate(date[0].work_order_date);
        console.log(date[5].work_order_date)
      } else if (date.length > 0) {
        setEnd(date.length);
        setStart(0);
        setCurrentDate(date[0].work_order_date);
      }
      setProductionDailyRequest(date);
    }
  }, [workorderRequest.to_date, workorderRequest.from_date]);
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
                                  name="title"
                                  value={workorderRequest.title}
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
                                  onChange={(event) => handleChangeStatus(event)
                                  }
                                 
                                >
                                  {productionStatus &&
                                    productionStatus.map((item) => (
                                      <MenuItem key={item.id} value={item.id}>
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
                                value={workorderRequest.from_date}
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
                                value={workorderRequest.to_date}
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
                                        {productionDailyRequestList?.slice(start, end).map((item,index) => (
                                          <TableCell align="center"  style={
                                            currentDate === item.work_order_date
                                              ? { background: 'rgb(97, 42, 255)', color: 'white' }
                                              : {}
                                          } onClick={()=>handleChangeDate(item.work_order_date,index+ currentWeek * 7)}>
                                            <span>
                                              {weekday[item.work_order_date.getDay()]}
                                              <br />
                                              {item.work_order_date.getDate()+'/'+ month[item.work_order_date.getMonth()]}
                                            </span>
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {productionDailyRequestList?.slice(start, end).map((item) => (
                                          <TableCell component="th" scope="row" align="center">
                                            <Typography
                                              style={
                                                item?.percent >= 100
                                                  ? { backgroundColor: 'rgb(48, 188, 65)' }
                                                  : { backgroundColor: 'yellow' }
                                              }
                                            >
                                              {calculatePercent(item.number_of_worker, item.number_of_working_hour, item.no_piece_per_box, item.quantity_in_box, item.productivity_per_worker)?.toLocaleString()+"%"}
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
                                        name="number_of_worker"
                               
                                        InputProps={{ inputProps: { min: 1} }}
                                   
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
                                        name="number_of_working_hour"
                                        InputProps={{ inputProps: { min: 1} }}
                                
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
                                        value={"%"}
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
                              
                              >
                                 <AddCircleOutline />
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
                                    {productList?.map((item, index) => (
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
                                            options={dropdownData}
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
                                            
                                            value={item.quantity_in_box}
                                            className={classes.inputField}
                                            onChange={(e) => handleChangeNumber(e, index)}
                                          />
                                        </TableCell>
                                        <TableCell align="left">{item.unit_name}</TableCell>
                                        <TableCell align="center">

                                          <span> {calculatePercent(workorderRequest.number_of_worker, workorderRequest.number_of_working_hour, item.no_piece_per_box, item.quantity_in_box, item.productivity_per_worker)?.toLocaleString()+"%"}</span>
                                        </TableCell>
                                        <TableCell align="center"> {calculateQuantity(item.vattu)}</TableCell>
                                        <TableCell align="right">
                                          <IconButton
                                            onClick={() => handleDeleteRow(index)}
                                          
                                          >
                                            <Delete />
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
                      onClick={() => handleCreateWorkOrder()}
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
                      onClick={() => handleCreateWorkOrder()}
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
