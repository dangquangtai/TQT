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
  TableContainer,Tooltip
} from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Autocomplete } from '@material-ui/lab';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions';
import Alert from '../../../component/Alert'
import useProcessRole from '../../../hooks/useProcessRole';
import useDepartment from '../../../hooks/useDepartment';
import useRole from '../../../hooks/useRole';
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

const ProcessRoleDeptModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const { processDeptDocument: openDialog, processrolecode: process_role_code } = useSelector((state) => state.floatingMenu);
  const {getAllDepartment } = useDepartment();
  const { addDeptUser } = useProcessRole();
  const [deptSelected, setDeptSelected] = useState([]);
  const [department,setDepartment] = useState({department_code: ''});
  const [role, setRole] = React.useState({
    email_address: [],
    department_code: [],
    role_code: '',
  });
  const {getRoletemplateByDept } =useRole();
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  })
  const [deptList, setDeptList] = useState([]);
  useEffect(() => {
    const fetchDeptList = async () => {
      let data = await getAllDepartment();
      setDeptList(data);
      
    }
    fetchDeptList();
    
  }, []);
  
  const [roletemplateList,setRoleList] = useState([]);
  const [roletemplate,setRoleTemplate] = useState([]);
  const [roleSelected,setRoleSelected] = useState();
  useEffect(() => {
    const fetchDeptList = async () => {
      let data= await getRoletemplateByDept(department.department_code);
       setRoleList(data);
    }
    if (!!department){
      fetchDeptList();
    }
    
  }, [department]);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    setRole({
      email_address: [],
      department_code: [],
      role_code: '',
    });
    setDeptSelected([]);
    setRoleTemplate();
    
    setDepartment({department_code:''});
    dispatch({ type: FLOATING_MENU_CHANGE, processDeptDocument: false });
  };


  const handleUpdateSelected = (dept) => {
    if (!!dept){
      setRoleSelected(dept.department_code);
      const newSelectedList = deptSelected.filter((item) => !!item);
      setDeptSelected([...newSelectedList,dept])
      delete deptList[deptList.indexOf(dept)];
      const newList = deptList.filter((item) => !!item);
      setDeptList([...newList])
    }

  }
  const handleUpdateRoleSelected = (role) => {
    
    if (!!role){
        handleUpdateSelected(department);
        const newSelectedList = roletemplate.filter((item) => !!item);
        setRoleTemplate([...newSelectedList,role])
        delete roletemplateList[roletemplateList.indexOf(role)];
        const newList = roletemplateList.filter((item) => !!item);
        setRoleList([...newList])
    }

  }
  const handleRemove = (dept) =>{
    if (!!dept){
      const newList = deptList.filter((item) => !!item);
      setDeptList([...newList,dept]);
      handleRemoveRole(roletemplate[deptSelected.indexOf(dept)])
      delete deptSelected[deptSelected.indexOf(dept)];
    }
  }
  const handleRemoveRole = (role) =>{
    if (!!role){
      const newList = roletemplateList.filter((item) => !!item);
      setRoleList([...newList,role]);
      delete roletemplate[roletemplate.indexOf(role)];
    }
    
  }
  const handleUpdateRole = async () => {
    try {
        let dept= []
        let data;
        deptSelected.map((row,index) =>(
          data=row.department_code+"_"+roletemplate[index].id,
          dept.push(data)
          
        ))
        let check = await addDeptUser(process_role_code, dept, role.email_address)
        if (check === true) {
          handleOpenSnackbar(true, 'success', 'Thêm thành công!');
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'processrole' });
          handleCloseDialog();
        } else {
          handleOpenSnackbar(true, 'error', 'Thêm thất bại!');
        }
      


    } catch (error) {
      console.log('error update department', error)
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
      text: text
    })
  }

  return (

    <React.Fragment>

      {snackbarStatus.isOpen && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbarStatus.isOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })}>
          <Alert onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })} severity={snackbarStatus.type} sx={{ width: '100%' }}>
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
                      <Typography
                        className={classes.tabLabels}
                        component="span"
                        variant="subtitle1"
                      >

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
                            <Grid item lg={6} md={6} xs={6}>
                            <Autocomplete
                                style={{ minWidth: 300, maxWidth: 300 }}
                                size="small"
                                fullWidth
                                options={deptList}
                                onChange={(e, u) => setDepartment(u)}
                                getOptionLabel={(option) => option.department_name}
                                renderInput={(params) => <TextField label="Phòng ban" {...params} variant="outlined" />}
                              />
                            </Grid>
                            <Grid item lg={6} md={6} xs={6} >


                              <Autocomplete
                                style={{ minWidth: 300, maxWidth: 300 }}
                                size="small"
                                fullWidth
                                options={roletemplateList}
                                onChange={(e, role) => handleUpdateRoleSelected(role)}
                                getOptionLabel={(option) => option.value}
                                renderInput={(params) => <TextField label="Chức vụ" {...params} variant="outlined" />}
                              />
                            </Grid>
                          </Grid>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                         
                                  <TableCell >Tên</TableCell>
                                  <TableCell >Chức vụ</TableCell>
                                  <TableCell align="right"></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {deptSelected?.map((row,index) => (
                                  <TableRow
                                    key={row.department_name+'_'}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                   
                                
                                    <TableCell >{row.department_name}</TableCell>
                                    <TableCell >{roletemplate[index].value}</TableCell>
                                    <TableCell align="right">
                                    <Tooltip title={'Xoá'}>
                                      <Button
                                        className={`${classes.handleButton} ${classes.handleButtonNote}`}
                                        onClick={()=> handleRemove(row)}
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
                <Button
                  variant="contained"
                  style={{ background: 'rgb(70, 81, 105)', }}
                  onClick={() => handleCloseDialog()}
                >
                  Đóng
                </Button>
              </Grid>
              {role.id === '' && (
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={() => handleUpdateRole()}
                  >
                    {'Tạo mới'}
                  </Button>
                </Grid>
              )}
              {role.id !== '' && (
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={() => handleUpdateRole()}
                  >
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

export default ProcessRoleDeptModal;
