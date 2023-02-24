import React, { useCallback, useEffect, useState } from 'react';
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
  TableContainer,
  Paper,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableHead,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../store/constant.js';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions.js';
import { style } from '../../Table/style';
import useAccount from '../../../hooks/useAccount.js';
import { Autocomplete } from '@material-ui/lab';
import useDepartment from '../../../hooks/useDepartment.js';
import { createUserGroupDetail, updateUserGroupDetail, getUserByDepart } from '../../../services/api/UserGroup/index';
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const UserGroupModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.user.detail.save);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const { getAllUser } = useAccount();
  const [accountList, setAccountList] = useState([]);
  const { getAllDepartment } = useDepartment();
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });
  const [usergroup, setUserGroup] = useState({ group_code: '', group_name: '' });
  const [rows, setRows] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentSelected, setDepartmentSelected] = useState([]);
  const [itemAdd, setAddItem] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      let data = await getAllUser();
      setAccountList(data);
      data = await getAllDepartment();
      setDepartmentList(data);
    };
    fetch();
    if (!selectedDocument) return;
    setRows([...selectedDocument.user_list]);
    setUserGroup({ ...selectedDocument });
  }, [selectedDocument]);

  const handelRemoveItem = (item) => {
    let arrayFilter = rows.filter((itemarr) => itemarr.email_address !== item.email_address);
    setRows(arrayFilter);
    setAccountList([...accountList, item]);
  };

  const handleAddItem = async () => {
    const emailList = rows.map((object) => object.email_address);
    let arrayFilter = itemAdd.filter((item) => emailList.includes(item.email_address) === false);
    let arrayDrop = accountList.filter((itemarr) => itemAdd.includes(itemarr) === false);
    setAccountList(arrayDrop);
    let usserList = [];
    for (let i = 0; i < departmentSelected.length; i++) {
      let user = await getUserByDepart(departmentSelected[i].department_code);
      usserList = [...usserList, ...user];
    }
    setDepartmentSelected([]);
    const userList = usserList.filter((item) => emailList.includes(item.email_address) === false);
    setRows([...arrayFilter, ...userList, ...rows]);
    setAddItem([]);
  };
  const handleCloseDialog = () => {
    setRows([]);
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
      if (!selectedDocument) {
        let email_list = rows.map((item) => item.email_address);
        let check = await createUserGroupDetail(usergroup.group_code, usergroup.group_name, email_list);
        if (check) {
          handleOpenSnackbar(true, 'success', 'Tạo mới thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'usergroup' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Tạo mới lỗi!');
        }
      } else {
        let email_list = rows.map((item) => item.email_address);
        let check = await updateUserGroupDetail(usergroup.group_code, usergroup.group_name, email_list, selectedDocument.group_code);
        if (check) {
          handleOpenSnackbar(true, 'success', 'Cập nhập thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'usergroup' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Tạo mới lỗi!');
        }
      }
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Tạo mới lỗi!');
    } finally {
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUserGroup({ ...usergroup, [e.target.name]: e.target.value });
  };

  const setDocumentToDefault = async () => {
    setDepartmentSelected([]);
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'usergroup' });
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
              Thông tin nhóm người dùng
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
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin nhóm người dùng</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Mã: </span>
                            </Grid>
                            <Grid item lg={9} md={9} xs={9}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="group_code"
                                value={usergroup?.group_code}
                                className={classes.inputField}
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={3} md={3} xs={3}>
                              <span className={classes.tabItemLabelField}>Tên: </span>
                            </Grid>
                            <Grid item lg={9} md={9} xs={9}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="group_name"
                                value={usergroup?.group_name}
                                className={classes.inputField}
                                onChange={handleChange}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center" spacing={1}>
                            <Grid item lg={3} md={3} xs={12}>
                              <span className={classes.tabItemLabelField}>Danh sách tài khoản:</span>
                            </Grid>
                            <Grid item lg={4} md={4} xs={12}>
                              <Autocomplete
                                options={accountList}
                                value={itemAdd}
                                blurOnSelect={true}
                                multiple
                                size="small"
                                onChange={(e, value) => setAddItem(value)}
                                getOptionLabel={(option) => option.email_address}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={4} md={4} xs={12}>
                              <Autocomplete
                                options={departmentList}
                                value={departmentSelected}
                                blurOnSelect={true}
                                multiple
                                size="small"
                                onChange={(e, value) => setDepartmentSelected(value)}
                                getOptionLabel={(option) => option.department_name}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={1} md={1} xs={12}>
                              <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleAddItem}>
                                {'Thêm'}
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                              <Table aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Tên</TableCell>
                                    <TableCell align="right"></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {rows.map((row) => (
                                    <TableRow key={row.email_address} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      <TableCell component="th" scope="row">
                                        <img alt="" src={row.image_url} style={style.tableUserAvatar} />
                                      </TableCell>
                                      <TableCell align="left">{row.email_address}</TableCell>
                                      <TableCell align="left">{row.full_name}</TableCell>
                                      <TableCell align="right">
                                        <IconButton onClick={() => handelRemoveItem(row)}>
                                          <Delete />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
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
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              {!selectedDocument && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateAccount()}>
                    {'Tạo mới'}
                  </Button>
                </Grid>
              )}
              {!!selectedDocument && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateAccount()}>
                    Lưu
                  </Button>
                </Grid>
              )}
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default UserGroupModal;
