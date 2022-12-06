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
} from '@material-ui/core';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions.js';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import useStyles from './../../../utils/classes';
import RefreshIcon from '@material-ui/icons/Refresh';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="bottom" ref={ref} {...props} />;
});

const orderCode = [
  {
    id: '1',
    title: 'Đơn hàng 1',
    customer_name: 'Khách hàng 1',
    order_date: '01/01/2021',
    expected_deliver_date: '01/01/2021',
  },
  {
    id: '2',
    title: 'Đơn hàng 2',
    customer_name: 'Khách hàng 2',
    order_date: '01/01/2021',
    expected_deliver_date: '01/01/2021',
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

const OrderModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [order, setOrder] = useState({
    id: '',
    title: '',
    customer_name: '',
    order_date: '',
  });
  const [orderDetail, setOrderDetail] = useState([]);

  const handleOrderChange = (e, value) => {
    if (value) {
      dispatch({ type: FLOATING_MENU_CHANGE, order_id: value.id });
      setOrder(value);
    } else {
      dispatch({ type: FLOATING_MENU_CHANGE, order_id: '' });
      setOrder({
        id: '',
        title: '',
        customer_name: '',
        order_date: '',
      });
    }
  };

  const calculateQuantity = (quantityInBox, quantityProduced) => {
    const quantity = quantityInBox - quantityProduced;
    const color = quantity > 0 ? 'yellow' : 'green';
    return <Typography style={{ backgroundColor: color }}>{quantity}</Typography>;
  };

  useEffect(() => {
    const id = order.id;
    setOrderDetail(orderDetailList.filter((item) => item.order_id === id));
  }, [order.id]);

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
                                      id="combo-box-demo"
                                      options={orderCode}
                                      getOptionLabel={(option) => option.title}
                                      onChange={handleOrderChange}
                                      renderInput={(params) => (
                                        <TextField {...params} variant="outlined" size="small" fullWidth />
                                      )}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item lg={4} md={6} xs={12}>
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
                                <Typography>Last update: 5 phút trước</Typography>
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
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="left">STT</TableCell>
                                      <TableCell align="left">Mã sản phẩm</TableCell>
                                      <TableCell align="left">Mã sản phẩm KH</TableCell>
                                      <TableCell align="left">Tên sản phẩm</TableCell>
                                      <TableCell align="left">Số lượng cần SX</TableCell>
                                      <TableCell align="left">Đơn vị</TableCell>
                                      <TableCell align="left">Số lượng đã SX</TableCell>
                                      <TableCell align="left">Số lượng còn lại</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {orderDetail.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell align="left">{index + 1}</TableCell>
                                        <TableCell align="left">{item.product_code}</TableCell>
                                        <TableCell align="left">{item.product_customer_code}</TableCell>
                                        <TableCell align="left">{item.product_name}</TableCell>
                                        <TableCell align="left">{item.quantity_in_box}</TableCell>
                                        <TableCell align="left">{item.unit_name}</TableCell>
                                        <TableCell align="left">{item.quantity_produced}</TableCell>
                                        <TableCell align="center">
                                          {calculateQuantity(item.quantity_in_box, item.quantity_produced)}
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
              <Grid item>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }}>
                  Đóng
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }}>
                      <RefreshIcon />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }}>
                      Lưu
                    </Button>
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
