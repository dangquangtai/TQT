import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
  Paper,
  IconButton,
  Typography,
  Tooltip
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../utils/classes';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ORDER_CHANGE, ORDER_DETAIL_CHANGE } from './../../../store/actions';
import {
  getOrderCompletedList,
  getOrderProductDetail,
  getDetailOrderByWorkOrder,
} from '../../../services/api/Order/index.js';
import { testAPI } from '../../../services/api/Workorder';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="bottom" ref={ref} {...props} />;
});

const OrderModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { order: orderRedux } = useSelector((state) => state.order);
  const [order, setOrder] = useState({
    id: '',
    value: '',
    order_code: '',
  });
  const [orderSelected, setOrderSelected] = useState({
    id: '',
    value: '',
    order_code: '',
  });
  const [orderDetail, setOrderDetail] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const handleOrderChange = async (e, value) => {
    const orderDetail = await getOrderProductDetail(value.id);
    setOrderSelected(value);
    if (value) {
      setOrder({ ...value, order_code: orderDetail?.order_code, ...orderDetail });
      dispatch({
        type: ORDER_CHANGE,
        order: { ...value, order_code: orderDetail?.order_code, change: false },
        orderDetail: orderDetail.order_detail,
      });
      setOrderDetail(orderDetail.order_detail);
    } else {
      dispatch({ type: ORDER_CHANGE, order: null, orderDetail: orderDetail });
      setOrder({
        id: '',
        title: '',
        customer_name: '',
        order_date: '',
        order_code: '',
      });
      setOrderDetail(orderDetail);
    }
  };

  const handleOrderChangeSelected = async (value) => {
    var orderDetailList = {};
    if (orderRedux?.work_order_id != '') {

      orderDetailList = await getDetailOrderByWorkOrder(value.id, orderRedux.work_order_id);
    } else {
      orderDetailList = await getOrderProductDetail(value.id);
    }
    setOrderSelected(value);
    if (value) {
      setOrder({ ...value, order_code: orderDetailList?.order_code, ...orderDetailList });
      dispatch({
        type: ORDER_CHANGE,
        order: { ...value, order_code: orderDetailList.order_code, change: false, work_order_id: orderRedux.work_order_id },
        orderDetail: orderDetailList.order_detail,
        workorderDetail: orderRedux.workorderDetail

      });
      setOrderDetail(orderDetailList?.order_detail);
    } else {
      dispatch({
        type: ORDER_CHANGE,
        order: null,
        orderDetail: orderDetailList,
        workorderDetail: orderRedux.workorderDetail,
      });
      setOrder({
        id: '',
        title: '',
        customer_name: '',
        order_date: '',
        order_code: '',
      });
      setOrderDetail(orderDetailList);
    }
  };
  const calculateQuantity = (quantityInBox, quantityProduced) => {
    const quantity = quantityInBox - quantityProduced;
    const color = quantity > 0 ? 'yellow' : 'rgb(48, 188, 65)';
    return <Typography style={{ backgroundColor: color }}>{quantity.toLocaleString()}</Typography>;
  };

  const handleClose = () => {
    dispatch({ type: ORDER_CHANGE, order: null, orderDetail: null });
    dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: null });
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        let data = await getOrderCompletedList();
        setOrderList(data);
      } catch (error) {
        let data = await getOrderCompletedList();
        setOrderList(data);
      }

    };

    fetchData();
    // window.addEventListener("beforeunload", function (e) {
    //   dispatch({ type: ORDER_CHANGE, order: null, orderDetail: null });
    //   dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: null});
    //   return undefined;
    // });
  }, []);
  useEffect(() => {
    if (!orderList || orderList.length === 0) return;
    if (!orderRedux) return;
    if (!orderRedux.id) return;
    let value = orderList.find(x => x.id === orderRedux.id)
    handleOrderChangeSelected(value)
  }, [orderList]);
  useEffect(() => {

    if (orderRedux?.close) {
      handleClose()
    }
    if (!orderRedux.orderDetail) {
      if (orderRedux?.change) {
        var orderInList = orderList.find((x) => x.id === orderRedux.id)
        if (!orderInList) return
        handleOrderChangeSelected(orderInList)
      }
      return;
    }
    setOrderDetail(orderRedux.orderDetail)
  }, [orderRedux]);

  return (
    <React.Fragment>
      <Grid container>
        <Dialog open={true} fullScreen>
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Mục tiêu sản xuất
            </Grid>
          </DialogTitle>
          <DialogContent className={classes.dialogContent} style={{ background: '#f1f1f9' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item lg={12} md={12} xs={12}>
                    <div className={classes.tabItem}>
                      <div className={classes.tabItemTitle}>
                        <div className={classes.tabItemLabel}>Đơn hàng</div>
                      </div>
                      <div className={classes.tabItemBody}>
                        <Grid container spacing={1} alignItems="center" className={classes.gridItemInfo}>
                          <Grid item lg={9} md={9} xs={12}>
                            <Grid container spacing={4}>
                              <Grid item lg={3} md={6} xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <Typography variant="h6">Mã đơn hàng</Typography>
                                  </Grid>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <Autocomplete
                                      size="small"
                                      fullWidth
                                      disableClearable
                                      options={orderList}
                                      value={order}
                                      getOptionLabel={(option) => option.value}
                                      onChange={handleOrderChange}
                                      renderInput={(params) => (
                                        <TextField {...params} variant="outlined" size="small" fullWidth />
                                      )}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item lg={3} md={6} xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <Typography variant="h6">Tên đơn hàng</Typography>
                                  </Grid>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <TextField
                                      disabled
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      value={order?.title}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item lg={3} md={6} xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <Typography variant="h6">Tên khách hàng</Typography>
                                  </Grid>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <TextField
                                      disabled
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      value={order?.customer_name}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item lg={3} md={6} xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <Typography variant="h6">Ngày đặt hàng</Typography>
                                  </Grid>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <TextField
                                      disabled
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      value={order?.expected_deliver_date}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item lg={3} md={3} xs={12}>
                            <Grid container spacing={1} justifyContent="flex-end" alignItems="center">
                              <Grid item>
                                <Tooltip title="Cập nhật">
                                  <IconButton>
                                    <RefreshIcon />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                              <Grid item>
                                <Typography>5 phút trước</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <div className={classes.tabItem}>
                      <div className={classes.tabItemTitle}>
                        <div className={classes.tabItemLabel}>Thông tin sản phẩm</div>
                      </div>
                      <div className={classes.tabItemBody}>
                        <Grid container spacing={1}>
                          <Grid item lg={12} md={12} xs={12}>
                            <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                              <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                                <Table size="small" stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="left">Mã sản phẩm</TableCell>
                                      <TableCell align="left">Mã sản phẩm KH</TableCell>
                                      <TableCell align="left">Tên sản phẩm</TableCell>
                                      <TableCell align="left">Số lượng cần SX</TableCell>
                                      <TableCell align="left">Đơn vị</TableCell>
                                      <TableCell align="left">Số lượng đã lập KH</TableCell>
                                      <TableCell align="left">Số lượng đã SX</TableCell>
                                      <TableCell align="left">Số lượng còn lại</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {orderDetail?.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell align="left">{item.product_code}</TableCell>
                                        <TableCell align="left">{item.product_customer_code}</TableCell>
                                        <TableCell align="left" style={{ maxWidth: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          <Tooltip title={item.product_name}>
                                            <span>
                                              {item.product_name}
                                            </span>
                                          </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">{item.quantity_in_box.toLocaleString()}</TableCell>
                                        <TableCell align="left">{item.unit_name}</TableCell>
                                        <TableCell align="center">{item.quantity_in_workorder.toLocaleString()}</TableCell>
                                        <TableCell align="center">{item.quantity_produced.toLocaleString()}</TableCell>
                                        <TableCell align="center">
                                          {calculateQuantity(item.quantity_in_box, item.quantity_in_workorder)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="space-between">
              <Grid item></Grid>
              <Grid item>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={handleClose}>
                      Đóng
                    </Button>
                    {/* <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }}>
                      Lưu
                    </Button> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default OrderModal;
