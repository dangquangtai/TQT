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
import { AddCircle } from '@material-ui/icons';
import { Delete, Today as TodayIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Link } from 'react-router-dom';

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
  const [rows2, setRows] = useState([{ name: '', calories: '', fat: '', carbs: '', protein: '' }]);
  const [workorderRequest, setWorkorderRequest] = React.useState({
    status_code: '',
    title: '',
    date: new Date(),
    order_id: '',
  });
  const [productionStatus, setProductionStatus] = React.useState([
    { key: 1, value: 'Nháp' },
    { key: 2, value: 'Hoàn thành' },
  ]);
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [createData('1', 159, 'Khăn', 24, 4.0), createData('2', 237, 'Khăn', 37, 4.3)];
  const handleChangeRow = (row, index) => {
    rows2[index].name = row.name;
    rows2[index].calories = row.calories;
    rows2[index].fat = row.fat;
    rows2[index].carbs = row.carbs;
    setRows([...rows2]);
  };
  const handleAddRow = () => {
    setRows([...rows2, { name: '', calories: '', fat: '', carbs: '' }]);
  };
  const handleDeleteRow = (index) => {
    rows2.splice(index, 1);
    setRows([...rows2]);
  };
  useEffect(() => {
    if (!selectedDocument) return;
  }, [selectedDocument]);
  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: false });
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
    try {
      if (!workorderRequest.id) {
        let check = true;
        if (check == true) {
          handleOpenSnackbar(true, 'success', 'Tạo mới thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'account' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Tài khoản đã tồn tại!');
        }
      } else {
        let check = true;
        if (check == true) {
          handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'account' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Tài khoản đã tồn tại!');
        }
      }
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Vui lòng chọn ngày tháng năm sinh!');
    } finally {
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setWorkorderRequest({
      ...workorderRequest,
      [e.target.name]: value,
    });
  };

  const setDocumentToDefault = async () => {
    setTabIndex(0);
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
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <AccountCircleOutlinedIcon className={`${tabIndex === 0 ? classes.tabActiveIcon : ''}`} />
                        Mục tiêu sản xuất
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(1)}
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
                                <Grid item lg={2} md={2} xs={2}></Grid>
                                <Grid item lg={5} md={5} xs={5}>
                                  <span className={classes.tabItemLabelField}>Trạng thái: </span>
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}>
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
                                <Grid item lg={3} md={3} xs={3}></Grid>
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
                                <Grid item lg={3} md={3} xs={3}></Grid>
                              </Grid>

                              <Grid container className={classes.gridItemInfo}>
                                <Grid item lg={6} md={6} xs={6}>
                                  <span>Thời gian lập KH:</span>
                                </Grid>

                                <Grid item lg={6} md={6} xs={6}>
                                  <span className={classes.tabItemLabelField}></span>
                                </Grid>
                              </Grid>

                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}>
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
                                <Grid item lg={3} md={3} xs={3}></Grid>
                                <Grid item lg={3} md={3} xs={3}>
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
                                <Grid item lg={3} md={3} xs={3}></Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}>
                                  <span>Chi tiết sản xuất:</span>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={12} md={12} xs={12}>
                                  <TableContainer component={Paper} style={{ minWidth: 700, maxWidth: 700 }}>
                                    <Table aria-label="simple table">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell align="right">Thứ</TableCell>
                                          <TableCell align="right">Thứ</TableCell>
                                          <TableCell align="right">Thứ</TableCell>
                                          <TableCell align="right">Thứ</TableCell>
                                          <TableCell align="right">Thứ</TableCell>
                                          <TableCell align="right">Thứ</TableCell>
                                          <TableCell align="right">Thứ</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          <TableCell component="th" scope="row"></TableCell>
                                          <TableCell component="th" scope="row"></TableCell>
                                          <TableCell component="th" scope="row"></TableCell>
                                          <TableCell component="th" scope="row"></TableCell>
                                          <TableCell component="th" scope="row"></TableCell>
                                          <TableCell component="th" scope="row"></TableCell>
                                          <TableCell component="th" scope="row"></TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}></Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}></Grid>
                              </Grid>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={2} md={2} xs={2}>
                                  <span className={classes.tabItemLabelField}>Số người làm:</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  <TextField
                                    fullWidth
                                    type="text"
                                    variant="outlined"
                                    // name="date"
                                    // value={workorderRequest.date}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>

                                <Grid item lg={2} md={2} xs={2}>
                                  <span className={classes.tabItemLabelField}>Số giờ làm:</span>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  <TextField
                                    fullWidth
                                    type="text"
                                    variant="outlined"
                                    // name="date"
                                    // value={workorderRequest.date}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  />
                                </Grid>

                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Công xuất hiện tại 50%</span>
                                </Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Công xuất hiện tại 100%</span>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItem} alignItems="center">
                              <Grid item lg={11} md={11} xs={12}>
                                <TableContainer component={Paper}>
                                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>STT</TableCell>

                                        <TableCell align="center">Mã ĐH</TableCell>
                                        <TableCell align="center">Mã TP TQT</TableCell>
                                        <TableCell align="center">Mã TP KH</TableCell>
                                        <TableCell align="center">Tên TP</TableCell>
                                        <TableCell align="center">SL</TableCell>
                                        <TableCell align="center">Đơn vị tính</TableCell>
                                        <TableCell align="center">% công suất</TableCell>
                                        <TableCell align="center">Vật tư</TableCell>
                                        <TableCell align="center"></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {rows2?.map((row, index) => (
                                        <TableRow
                                          key={row.name}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                          <TableCell component="th" scope="row">
                                            {row.name}
                                          </TableCell>
                                          <TableCell align="right"></TableCell>
                                          <TableCell align="right">{row.fat}</TableCell>
                                          <TableCell align="right">{row.carbs}</TableCell>
                                          <TableCell align="right">
                                            <Autocomplete
                                              style={{ minWidth: 240, maxWidth: 240, marginRight: 10 }}
                                              size="small"
                                              fullWidth
                                              options={rows}
                                              onChange={(e, u) => handleChangeRow(u, index)}
                                              getOptionLabel={(option) => option.fat}
                                              renderInput={(params) => (
                                                <TextField label="Tên TP" {...params} variant="outlined" />
                                              )}
                                            />
                                          </TableCell>
                                          <TableCell align="right">
                                            <TextField
                                              fullWidth
                                              type="number"
                                              style={{ minWidth: 100 }}
                                              variant="outlined"
                                              // name="date"
                                              // value={workorderRequest.date}
                                              className={classes.inputField}
                                              onChange={handleChange}
                                            />
                                          </TableCell>
                                          <TableCell align="right">{'Thùng'}</TableCell>
                                          <TableCell align="right">{}</TableCell>
                                          <TableCell align="right">{}</TableCell>
                                          <TableCell align="right">
                                            <IconButton onClick={() => handleDeleteRow(index)}>
                                              <Delete />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                              <Grid item lg={1} md={1} xs={12}>
                                <IconButton onClick={handleAddRow}>
                                  <AddCircle></AddCircle>
                                </IconButton>
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
                      component={Link}
                      to={`/dashboard/workorder/${workorderRequest.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
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
