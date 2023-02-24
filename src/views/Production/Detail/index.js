import React, { useState } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tooltip,
  TextField,
  Snackbar,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
} from '@material-ui/core';
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE } from '../../../store/actions.js';
import { downloadFile } from './../../../utils/helper';
import { getLink } from '../../../services/api/Workorder/index.js';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const ProductionRequestModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const { selectedDocument } = useSelector((state) => state.document);
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);

  const handleCloseDialog = () => {
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false, documentType: 'production' });
  };
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });
  const handleGetlink = async () => {
    setSnackbarStatus({
      isOpen: true,
      type: 'info',
      text: 'Vui lòng chờ trong giây lát. Báo cáo đang được tải xuống',
    });
    const link = await getLink(selectedDocument?.id);
    if (link !== '') {
      downloadFile(link);
      setSnackbarStatus({
        isOpen: true,
        type: 'success',
        text: 'Tải xuống báo cáo thành công',
      });
    } else {
      setSnackbarStatus({
        isOpen: true,
        type: 'error',
        text: 'Tải xuống báo cáo thất bại',
      });
    }
    ///
  };
  const handleRenderTableRow = (item, index) => {
    return (
      <>
        {' '}
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover style={{ minWidth: 10, maxWidth: 10 }}>
          <TableCell align="left">{index + 1}</TableCell>
          <TableCell align="left" style={{ maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Tooltip title={item.customer_order_code}>
              <span> {item.customer_order_code}</span>
            </Tooltip>
          </TableCell>
          <TableCell align="left" style={{ minWidth: 150, maxWidth: 150 }}>
            {item.product_code}
          </TableCell>

          <TableCell align="left">{item.product_customer_code}</TableCell>

          <TableCell align="left" style={{ maxWidth: 450, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Tooltip title={item.product_name}>
              <span> {item.product_name}</span>
            </Tooltip>
          </TableCell>
          <TableCell align="left">{item.quantity_in_box}</TableCell>
          <TableCell align="left">{item.unit_name}</TableCell>
        </TableRow>
      </>
    );
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
              Lệnh sản xuất trong ngày
            </Grid>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1} rowSpacing={1}>
                            <Grid container className={classes.gridItemInfo} alignItems="center" spacing={1}>
                              <Grid item lg={2} md={2} xs={2}>
                                <span className={classes.tabItemLabelField}>Mã kế hoạch sản xuất: </span>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  type="text"
                                  size="small"
                                  name="order_code"
                                  value={selectedDocument?.order_code}
                                />
                              </Grid>

                              <Grid item lg={6} md={6} xs={6}>
                                <span className={classes.tabItemLabelField}>Tên kế hoạch sản xuất: </span>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  type="text"
                                  size="small"
                                  name="title"
                                  value={selectedDocument?.order_title}
                                />
                              </Grid>

                              <Grid item lg={2} md={2} xs={2}>
                                <span className={classes.tabItemLabelField}>{'Ngày sản xuất: '}</span>

                                <TextField
                                  variant="outlined"
                                  name="number_of_working_hour"
                                  InputProps={{ inputProps: { min: 1 } }}
                                  value={selectedDocument?.work_order_date_string}
                                  size="small"
                                />
                              </Grid>
                              <Grid item lg={1} md={1} xs={1}>
                                <span className={classes.tabItemLabelField}>{'Số người làm: '}</span>

                                <TextField
                                  variant="outlined"
                                  name="number_of_worker"
                                  InputProps={{ inputProps: { min: 1 } }}
                                  value={selectedDocument?.number_of_worker}
                                  size="small"
                                />
                              </Grid>

                              <Grid item lg={1} md={1} xs={1}>
                                <span className={classes.tabItemLabelField}>{'Số giờ làm: '}</span>

                                <TextField
                                  variant="outlined"
                                  name="number_of_working_hour"
                                  InputProps={{ inputProps: { min: 1 } }}
                                  value={selectedDocument?.number_of_working_hour}
                                  size="small"
                                />
                              </Grid>
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Xưởng: </span>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  type="text"
                                  size="small"
                                  name="title"
                                  value={selectedDocument?.workshop_name}
                                />
                              </Grid>
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Kho vật tư: </span>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  type="text"
                                  size="small"
                                  name="title"
                                  value={selectedDocument?.material_warehouse_name}
                                />
                              </Grid>
                              <Grid item lg={4} md={4} xs={4}>
                                <span className={classes.tabItemLabelField}>Kho thành phẩm: </span>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  type="text"
                                  size="small"
                                  name="title"
                                  value={selectedDocument?.product_warehouse_name}
                                />
                              </Grid>
                            </Grid>

                            <Grid container className={classes.gridItemInfo} alignItems="center" justifyContent="flex-start">
                              <Grid item>
                                <span className={classes.tabItemLabelField}>Chi tiết sản xuất:</span>
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItem} alignItems="center">
                              <Grid item lg={12} md={12} xs={12}>
                                <TableContainer style={{ maxHeight: 380 }}>
                                  {/* <TableScrollbar height="350px"> */}
                                  <Table size="small" stickyHeader aria-label="sticky table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell align="left" style={{ minWidth: 10, maxWidth: 10 }}>
                                          STT
                                        </TableCell>
                                        <TableCell align="left">Mã ĐH</TableCell>
                                        <TableCell align="left">Mã TP của TQT</TableCell>
                                        <TableCell align="left">Mã TP của KH</TableCell>
                                        <TableCell align="left">Tên TP</TableCell>
                                        <TableCell align="left">SL</TableCell>
                                        <TableCell align="left">Đơn vị</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {selectedDocument?.product_list.map((item, index) => handleRenderTableRow(item, index))}
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
              <Grid item className={classes.gridItemInfoButtonWrap}>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item></Grid>

                  {!!selectedDocument?.id && (
                    <>
                      <Grid item>
                        <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleGetlink}>
                          In lệnh sản xuất
                        </Button>
                      </Grid>
                    </>
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

export default ProductionRequestModal;
