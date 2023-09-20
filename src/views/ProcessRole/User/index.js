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
  Table,
  Paper,
  TableBody,
  TableCell,
  TextField,
  Snackbar,
  TableHead,
  TableRow,
  TableContainer,
  Tooltip,
} from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Autocomplete } from '@material-ui/lab';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions';
import Alert from '../../../component/Alert';
import useProcessRole from '../../../hooks/useProcessRole';
import useAccount from '../../../hooks/useAccount';
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

const ProcessRoleUserModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const { processUserDocument: openDialog, processrolecode: process_role_code } = useSelector((state) => state.floatingMenu);
  const { getAllUser } = useAccount();
  const { addDeptUser } = useProcessRole();
  const [role, setRole] = React.useState({
    email_address: [],
    department_code: [],
    role_code: '',
  });
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });
  const [userList, setUserList] = useState([]);
  const [allUser, setAllUser] = useState([]);
  useEffect(() => {
    const fetchUserList = async () => {
      let data = await getAllUser();
      setUserList([...data]);
      setAllUser([...data]);
    };
    fetchUserList();
    setRole({ ...role, role_code: process_role_code });
  }, []);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    setRole({
      email_address: [],
      department_code: [],
      role_code: '',
    });
    setUserSelected([]);
    setUserList(allUser);
    dispatch({ type: FLOATING_MENU_CHANGE, processUserDocument: false });
  };

  const [userSelected, setUserSelected] = useState([]);

  const handleUpdateSelected = (user) => {
    if (!!user) {
      const newSelectedList = userSelected.filter((item) => !!item);
      setUserSelected([...newSelectedList, user]);
      delete userList[userList.indexOf(user)];
      const newList = userList.filter((item) => !!item);
      setUserList([...newList]);
    }
  };
  const handleRemove = (user) => {
    if (!!user) {
      const newList = userList.filter((item) => !!item);
      setUserList([...newList, user]);
      delete userSelected[userSelected.indexOf(user)];
    }
  };
  const handleUpdateRole = async () => {
    try {
      let email = [];
      userSelected.map((row) => email.push(row.email_address));
      let check = await addDeptUser(process_role_code, role.department_code, email);
      if (check === true) {
        handleOpenSnackbar(true, 'success', 'Cập nhật thành công!');
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'processrole' });
        handleCloseDialog();
      } else {
        handleOpenSnackbar(true, 'error', 'Cập nhật thất bại!');
      }
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Cập nhật thất bại!');
    } finally {
    }
  };

  const setDocumentToDefault = async () => {
    setTabIndex(0);
  };
  const handleOpenSnackbar = (isOpen, type, text) => {
    setSnackbarStatus({
      isOpen: isOpen,
      type: type,
      text: text,
    });
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
              Thêm người dùng
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
                        Thêm người dùng
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
                            <span>Thêm người dùng</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tài khoản</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Autocomplete
                                style={{ minWidth: 300, maxWidth: 300 }}
                                size="small"
                                fullWidth
                                options={userList}
                                onChange={(e, u) => handleUpdateSelected(u)}
                                getOptionLabel={(option) => option.email_address}
                                renderInput={(params) => <TextField label="Tài khoản" {...params} variant="outlined" />}
                              />
                            </Grid>
                          </Grid>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Tên</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell align="right"></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {userSelected?.map((row) => (
                                  <TableRow key={row.email_address} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{row.full_name}</TableCell>
                                    <TableCell>{row.email_address}</TableCell>
                                    <TableCell align="right">
                                      <Tooltip title={'Xoá'}>
                                        <Button
                                          className={`${classes.handleButton} ${classes.handleButtonNote}`}
                                          onClick={() => handleRemove(row)}
                                        >
                                          <RemoveCircleOutlineIcon className={classes.noteButtonIcon} />
                                        </Button>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
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
              {role.id === '' && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateRole()}>
                    {'Tạo mới'}
                  </Button>
                </Grid>
              )}
              {role.id !== '' && (
                <Grid item>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => handleUpdateRole()}>
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

export default ProcessRoleUserModal;
