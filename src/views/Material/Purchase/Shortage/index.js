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
import useStyles from './../../../../utils/classes';
import { ADD_MATERIAL, REMOVE_MATERIAL } from './../../../../store/actions';
import { useLocation } from 'react-router';
import { getMaterialDailyRequisitionList } from '../../../../services/api/Workorder/index.js';

const ShortageModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { materialBuy } = useSelector((state) => state.material);
  const { search } = useLocation();
  const [materials, setMaterials] = useState([]);
  const [data, setData] = useState({
    supplier: '',
    warehouse: '',
  });

  const handleClose = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  const handleChangeMaterial = (material, e) => {
    const newMaterial = { ...material, material_daily_requisition_id: material.id };
    if (e.target.checked) dispatch({ type: ADD_MATERIAL, payload: newMaterial });
    else {
      dispatch({ type: REMOVE_MATERIAL, payload: {part_id: material?.part_id,material_daily_requisition_id: material.id } });
    }
  };

  const getMaterial = async (supplierID, warehouseID) => {
    try {
      const res = await getMaterialDailyRequisitionList(supplierID, warehouseID);
      setMaterials(res);
    } catch (error) {
      const res = await getMaterialDailyRequisitionList(supplierID, warehouseID);
      setMaterials(res?.list);
      setData({
        supplier: res?.supplier?.title,
        warehouse: res?.warehouse?.warehouse_name,
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    getMaterial(params.get('supplier'), params.get('warehouse'));
    window.addEventListener('beforeunload', handleClose);
    return () => {
      window.removeEventListener('beforeunload', handleClose);
    };
  }, []);

  return (
    <React.Fragment>
      <Grid container>
        <Dialog open={true} fullScreen>
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Mua vật tư thiếu
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
                                  <span className={classes.tabItemLabelField}>Nhà cung cấp:</span>
                                </Grid>
                                <Grid item>{data.supplier}</Grid>
                              </Grid>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                  <span className={classes.tabItemLabelField}>Kho vật tư:</span>
                                </Grid>
                                <Grid item>{data.warehouse}</Grid>
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
                                      <TableCell align="left">Chọn</TableCell>
                                      <TableCell align="left">Mã vật tư</TableCell>
                                      <TableCell align="left">Tên vật tư</TableCell>
                                      <TableCell align="left">Số lượng thiếu</TableCell>
                                      <TableCell align="left">Đơn vị</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {materials?.map((material) => (
                                      <TableRow key={material.id}>
                                        <TableCell align="left">
                                          <Checkbox
                                            checked={materialBuy.some((item) => (item.part_id === material.part_id)&&(item.material_daily_requisition_id===material.id))}
                                            onChange={(e) => handleChangeMaterial(material, e)}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                          />
                                        </TableCell>
                                        <TableCell align="left">{material.part_code}</TableCell>
                                        <TableCell align="left">{material.part_name}</TableCell>
                                        <TableCell align="left">{material.quantity_in_piece}</TableCell>
                                        <TableCell align="left">{material.unit_name}</TableCell>
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
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
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

export default ShortageModal;
