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
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useStyles from './../../../../utils/classes';
import { ADD_MATERIAL, CLOSE_MODAL_MATERIAL } from './../../../../store/actions';
import { useParams } from 'react-router';
import { getMaterialDailyRequisitionList } from '../../../../services/api/Workorder/index.js';
import { AddCircleOutlineOutlined } from '@material-ui/icons';

const ShortageModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { materialList } = useSelector((state) => state.material);
  const { supplierID } = useParams();
  const [materials, setMaterials] = useState([]);

  const handleClose = () => {
    dispatch({ type: CLOSE_MODAL_MATERIAL });
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  const handleAddMaterial = (material) => {
    dispatch({ type: ADD_MATERIAL, payload: material });
  };

  const getMaterial = async (supplierID) => {
    try {
      const res = await getMaterialDailyRequisitionList(supplierID);
      setMaterials(res);
    } catch (error) {
      const res = await getMaterialDailyRequisitionList(supplierID);
      setMaterials(res);
    }
  };

  useEffect(() => {
    getMaterial(supplierID);
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
                                      <TableCell align="left">Mã vật tư</TableCell>
                                      <TableCell align="left">Tên vật tư</TableCell>
                                      <TableCell align="left">Kho</TableCell>
                                      <TableCell align="left">Số lượng thiếu</TableCell>
                                      <TableCell align="left">Đơn vị</TableCell>
                                      <TableCell align="left">Mua</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {materials?.map((material) => (
                                      <TableRow key={material.id}>
                                        <TableCell align="left">{material.part_code}</TableCell>
                                        <TableCell align="left">{material.part_name}</TableCell>
                                        <TableCell align="left">{material.warehouse_name}</TableCell>
                                        <TableCell align="left">{material.quantity_in_piece}</TableCell>
                                        <TableCell align="left">{material.unit_name}</TableCell>
                                        <TableCell align="left">
                                          <Tooltip title="Mua vật tư">
                                            <IconButton onClick={() => handleAddMaterial(material)}>
                                              <AddCircleOutlineOutlined />
                                            </IconButton>
                                          </Tooltip>
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
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={handleClose}>
                  Đóng
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2} justifyContent="flex-end">
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

export default ShortageModal;
