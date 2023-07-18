import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
  Paper,
  Checkbox,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useStyles from '../../../../utils/classes';
import { PRODUCT_RECEIVED } from '../../../../store/actions';
import { useLocation } from 'react-router';
import { format as formatDate } from 'date-fns';
import { ProductReceivedService } from '../../../../services/api/Product/Received';
import { FormattedNumber } from 'react-intl';

const ProductModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { productReceived } = useSelector((state) => state.product);
  const { search } = useLocation();
  const [Products, setProducts] = useState([]);
  const [ProductSelected, setProductSelected] = useState([]);
  const [data, setData] = useState({
    supplier: '',
    warehouse: '',
  });

  const handleClose = () => {
    setProductSelected([]);
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  const handleSave = () => {
    dispatch({ type: PRODUCT_RECEIVED, payload: ProductSelected });
    handleClose();
  };

  const handleChangeProduct = (Product, e) => {
    const newProduct = { ...Product, requisition_order_id: Product.requisition_id, requisition_order_detail_id: Product.id };
    if (e.target.checked) {
      setProductSelected([...ProductSelected, newProduct]);
    } else {
      setProductSelected(ProductSelected.filter((item) => item.product_id !== Product.product_id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newProduct = Products.map((item) => {
        return { ...item, requisition_order_id: item.requisition_id, requisition_order_detail_id: item.id };
      });
      setProductSelected(newProduct);
    } else {
      setProductSelected([]);
    }
  };

  const getProduct = async (supplierID, warehouseID) => {
    try {
      const res = await ProductReceivedService.getOrderdRequistion(supplierID, warehouseID);
      setProducts(res?.list);
      setData({
        supplier: res?.supplier?.title,
        warehouse: res?.warehouse?.warehouse_name,
      });
    } catch (error) {
      const res = await ProductReceivedService.getOrderdRequistion(supplierID, warehouseID);
      setProducts(res?.list);
      setData({
        supplier: res?.supplier?.title,
        warehouse: res?.warehouse?.warehouse_name,
      });
    }
  };

  useEffect(() => {
    if (productReceived?.length > 0) {
      setProductSelected(productReceived);
    }
  }, [productReceived]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    getProduct(params.get('supplier'), params.get('warehouse'));
    window.addEventListener('beforeunload', handleClose);
    return () => {
      window.removeEventListener('beforeunload', handleClose);
    };
  }, [search]);

  return (
    <React.Fragment>
      <Grid container>
        <Dialog open={true} fullScreen>
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Nhập thành phẩm từ đơn hàng
            </Grid>
          </DialogTitle>
          <DialogContent className={classes.dialogContent} style={{ background: '#f1f1f9' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item lg={12} md={12} xs={12}>
                    <div className={classes.tabItem}>
                      <div className={classes.tabItemTitle}>
                        <div className={classes.tabItemLabel}>Thông tin</div>
                      </div>
                      <div className={classes.tabItemBody}>
                        <Grid container spacing={1}>
                          <Grid item lg={12} md={12} xs={12}>
                            <div className={classes.tabItemBody}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                  <span className={classes.tabItemLabelField}>Nhà cung cấp: </span> {data.supplier}
                                </Grid>
                                <Grid item>
                                  <span className={classes.tabItemLabelField}>Kho thành phẩm: </span>
                                  {data.warehouse}
                                </Grid>
                              </Grid>
                            </div>
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
                      <div className={classes.tabItemBody}>
                        <Grid container spacing={1}>
                          <Grid item lg={12} md={12} xs={12}>
                            <div className={classes.tabItemBody} style={{ paddingBottom: '8px' }}>
                              <TableContainer style={{ maxHeight: 500 }} component={Paper}>
                                <Table size="small" stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="left">
                                        <Checkbox
                                          checked={ProductSelected?.length === Products?.length}
                                          onChange={handleSelectAll}
                                          inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                      </TableCell>
                                      <TableCell align="left">Mã ĐH</TableCell>
                                      <TableCell align="left">Mã TP</TableCell>
                                      <TableCell align="left">Mã TP KH</TableCell>
                                      <TableCell align="left">Tên thành phẩm</TableCell>
                                      <TableCell align="left">Mã hợp đồng</TableCell>
                                      <TableCell align="left">Giá(VNĐ)</TableCell>
                                      <TableCell align="left">SL đặt</TableCell>
                                      <TableCell align="left">SL đã nhập</TableCell>
                                      <TableCell align="left">SL còn lại</TableCell>
                                      <TableCell align="left">Đơn vị</TableCell>
                                      <TableCell align="left">Ngày mua hàng</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {Products?.map((Product) => (
                                      <TableRow key={Product.id}>
                                        <TableCell align="left">
                                          <Checkbox
                                            checked={ProductSelected?.some((item) => item.id === Product.id)}
                                            onChange={(e) => handleChangeProduct(Product, e)}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                          />
                                        </TableCell>
                                        <TableCell align="left">{Product.requisition_order_code}</TableCell>
                                        <TableCell align="left">{Product.product_code}</TableCell>{' '}
                                        <TableCell align="left">{Product.product_customer_code}</TableCell>
                                        <TableCell align="left">{Product.product_name}</TableCell>
                                        <TableCell align="left">{Product.contract_code}</TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={Product.unit_price || 0} />
                                        </TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={Product.quantity_in_box || 0} />
                                        </TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={Product.entered_quantity_in_box || 0} />
                                        </TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={Product.remain_quantity_in_box || 0} />
                                        </TableCell>
                                        <TableCell align="left">{Product.unit_name}</TableCell>
                                        <TableCell align="left">
                                          {Product.requisition_order_date
                                            ? formatDate(new Date(Product.requisition_order_date), 'dd/MM/yyyy')
                                            : ''}
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
              <Grid item className={classes.gridItemInfoButtonWrap}>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={handleClose}>
                  Đóng
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleSave} style={{ background: 'rgb(97, 42, 255)' }}>
                  Chọn
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default ProductModal;
