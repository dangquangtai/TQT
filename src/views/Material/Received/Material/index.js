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
  Tooltip,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useStyles from './../../../../utils/classes';
import { MATERIAL_RECEIVED } from './../../../../store/actions';
import { useLocation } from 'react-router';
import { format as formatDate } from 'date-fns';
import { getMaterialOrderList } from '../../../../services/api/Material/Received';
import { FormattedNumber } from 'react-intl';

const MaterialModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { materialReceived } = useSelector((state) => state.material);
  const { search } = useLocation();
  const [materials, setMaterials] = useState([]);
  const [materialSelected, setMaterialSelected] = useState([]);
  const [data, setData] = useState({
    supplier: '',
    warehouse: '',
  });

  const handleClose = () => {
    setMaterialSelected([]);
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  const handleSave = () => {
    dispatch({ type: MATERIAL_RECEIVED, payload: materialSelected });
    handleClose();
  };

  const handleChangeMaterial = (material, e) => {
    const newMaterial = { ...material, material_order_id: material.requisition_id, requisition_order_detail_id: material.id };
    if (e.target.checked) {
      setMaterialSelected([...materialSelected, newMaterial]);
    } else {
      setMaterialSelected(materialSelected.filter((item) => item.part_id !== material.part_id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newMaterial = materials.map((item) => {
        return { ...item, material_order_id: item.requisition_id, requisition_order_detail_id: item.id };
      });
      setMaterialSelected(newMaterial);
    } else {
      setMaterialSelected([]);
    }
  };

  const getMaterial = async (supplierID, warehouseID) => {
    try {
      const res = await getMaterialOrderList(supplierID, warehouseID);
      setMaterials(res?.list);
      setData({
        supplier: res?.supplier?.title,
        warehouse: res?.warehouse?.warehouse_name,
      });
    } catch (error) {
      const res = await getMaterialOrderList(supplierID, warehouseID);
      setMaterials(res?.list);
      setData({
        supplier: res?.supplier?.title,
        warehouse: res?.warehouse?.warehouse_name,
      });
    }
  };

  useEffect(() => {
    if (materialReceived?.length > 0) {
      setMaterialSelected(materialReceived);
    }
  }, [materialReceived]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    getMaterial(params.get('supplier'), params.get('warehouse'));
    window.addEventListener('beforeunload', handleClose);
    return () => {
      window.removeEventListener('beforeunload', handleClose);
    };
  }, []);

  const isWorkOrder = Boolean(materials[0]?.order_code);

  return (
    <React.Fragment>
      <Grid container>
        <Dialog open={true} fullScreen>
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Nhập vật tư từ đơn hàng
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
                                  <span className={classes.tabItemLabelField}>Nhà cung cấp</span> {data.supplier}
                                </Grid>
                                <Grid item>
                                  <span className={classes.tabItemLabelField}>Kho vật tư</span>
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
                        <div className={classes.tabItemLabel}>Danh sách vật tư</div>
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
                                          checked={materialSelected?.length === materials?.length}
                                          onChange={handleSelectAll}
                                          inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                      </TableCell>
                                      {isWorkOrder && <TableCell align="left">Mã Đơn KH</TableCell>}
                                      <TableCell align="left">Mã Đơn MH</TableCell>
                                      <TableCell align="left">Mã vật tư</TableCell>
                                      <TableCell align="left">Tên vật tư</TableCell>
                                      <TableCell align="left">Mã hợp đồng</TableCell>
                                      <TableCell align="left">Giá(VNĐ)</TableCell>
                                      <TableCell align="left">SL đặt</TableCell>
                                      <TableCell align="left">SL đã nhập</TableCell>
                                      <TableCell align="left">SL còn lại</TableCell>
                                      <TableCell align="left">Đơn vị</TableCell>
                                      {isWorkOrder && <TableCell align="left">Ngày sản xuất</TableCell>}
                                      <TableCell align="left">Ngày giao hàng</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {materials?.map((material) => (
                                      <TableRow key={material.id}>
                                        <TableCell align="left">
                                          <Checkbox
                                            checked={materialSelected?.some((item) => item.id === material.id)}
                                            onChange={(e) => handleChangeMaterial(material, e)}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                          />
                                        </TableCell>
                                        {isWorkOrder && <TableCell align="left">{material.order_code}</TableCell>}
                                        <TableCell align="left">{material.requisition_order_code}</TableCell>
                                        <TableCell align="left">{material.part_code}</TableCell>
                                        <TableCell className={classes.maxWidthCell} align="left">
                                          <Tooltip title={material.part_name}>
                                            <span>{material.part_name}</span>
                                          </Tooltip>
                                        </TableCell>
                                        <TableCell align="left">{material.contract_code}</TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={material.unit_price || 0} />
                                        </TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={material.quantity_in_piece || 0} />
                                        </TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={material.entered_quantity_in_piece || 0} />
                                        </TableCell>
                                        <TableCell align="left">
                                          <FormattedNumber value={material.remain_quantity_in_piece || 0} />
                                        </TableCell>
                                        <TableCell align="left">{material.unit_name}</TableCell>
                                        {isWorkOrder && (
                                          <TableCell align="left">
                                            {material.order_date ? formatDate(new Date(material.order_date), 'dd/MM/yyyy') : ''}
                                          </TableCell>
                                        )}
                                        <TableCell align="left">
                                          {material.delivery_date ? formatDate(new Date(material.delivery_date), 'dd/MM/yyyy') : ''}
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

export default MaterialModal;
