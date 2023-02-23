import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Grid, TextField, MenuItem, Snackbar, Select, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import useStyles from '../Tree_View/classes';
import Alert from '../../../component/Alert/index.js';
import ClearIcon from '@material-ui/icons/Clear';
import useAccount from '../../../hooks/useAccount.js';
import useRole from '../../../hooks/useRole.js';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
const style = {
  title: {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    position: 'relative',
  },
  buttonWrap: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCancel: {
    margin: '0 12px',
    background: 'rgb(70, 81, 105)',
  },
  buttonSubmit: {
    margin: '0 12px',
    background: 'rgb(97, 42, 255)',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 0,
    minWidth: '20px',
  },
};


export default function UserDepartModal({ isOpen, department_code, handleClose, }) {
  const classes = useStyles();
  const [formData, setFormData] = useState({ email: '', number_phone: '' });
  const { getAllUserByDept,   assignAccount, removeAccount, } = useAccount();
  const { getRoletemplateByDept } = useRole();
  const [roletemplateList, setRoleList] = useState([]);
  const [useDeptList, setUserDeptList] = useState([]);
  const [userSelectionList , setUserSelection] = useState([]);
  const [userDepart, setUserDeptSelected] = useState({
    department_code: '',
    role_template_code: '',
    email_address: '',
  })
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  });

  const handleAssignAccount= async () => {
    let data = await assignAccount({email_address: userDepart.email_address,department_code: department_code, role_template_code: userDepart.role_template_code}); 
    if (data){
      setSnackbarStatus({
        isOpen: true,
        type: 'success',
        text: 'Thêm thành công!',
      });
      let data = await getAllUserByDept(department_code, userDepart.role_template_code);
      setUserDeptList(data.list);
      setUserSelection(data.all_user);
    } else {
      setSnackbarStatus({
        isOpen: true,
        type: 'error',
        text: 'Thêm không thành công!',
      });
    }
  };
  const handleRemoveAccount= async (email_address) => {
    let data = await removeAccount({email_address: email_address,department_code: department_code, role_template_code: userDepart.role_template_code}) ;
    if (data){
      setSnackbarStatus({
        isOpen: true,
        type: 'success',
        text: 'Xoá thành công!',
      });
      let data = await getAllUserByDept(department_code, userDepart.role_template_code);
      setUserDeptList(data.list);
      setUserSelection(data.all_user);
    } else {
      setSnackbarStatus({
        isOpen: true,
        type: 'error',
        text: 'Xoá không thành công!',
      });
    }
  };
  const handleChangeRole = async (e) => {
    setUserDeptSelected({ ...userDepart, role_template_code: e.target.value, department_code: department_code })
    let data = await getAllUserByDept(department_code, e.target.value);
    setUserDeptList(data.list);
    setUserSelection(data.all_user);
  }

  useEffect(() => {
    // const fetchdata = async () => {
    //   // let data = await getRoletemplateByDept(department_code);
    //   // setRoleList(data);
    // }
    // if(!!department_code){
    //   fetchdata();
    // }
    setUserDeptSelected({
      department_code: '',
      role_template_code: '',
      email_address: '',
    })
  }, [isOpen]);

  return (
    <div>
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
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`${classes.editBox} ${''}`}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            <div>{'Cập nhật danh sách tài khoản cuản phòng ban'}</div>
            <div>
              <Button style={style.closeButton} onClick={()=> handleClose()}>
                <ClearIcon />
              </Button>
            </div>
          </div>
          <div id="modal-modal-description" sx={{ mt: 2 }}>



            <Grid container className={classes.gridItem} alignItems="center">
              <Grid item lg={2} md={2} xs={12}>
                <span className={classes.tabItemLabelField}>Chức danh:</span>
              </Grid>
              <Grid item lg={4} md={4} xs={12}>
                <Select
                  className={classes.multpleSelectField}
                  value={userDepart.role_template_code || ''}
                  onChange={(event) => handleChangeRole(event)}
                >
                  {roletemplateList &&
                    roletemplateList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.value}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
              <Grid item lg={2} md={2} xs={12}>
                <span className={classes.tabItemLabelField}>Tài khoản:</span>
              </Grid>
              <Grid item lg={2} md={2} xs={12}>
                <Select
                  className={classes.multpleSelectField}
                  value={userDepart.email_address || ''}
                onChange={(event) => setUserDeptSelected({...userDepart, email_address: event.target.value})}
                >
                  {userSelectionList &&
                    userSelectionList.map((item) => (
                      <MenuItem key={item.email_address} value={item.email_address}>
                        {item.email_address}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
              <Grid item lg={2} md={2} xs={12}>
                <Button type="button" variant="contained" style={style.buttonCancel} onClick={()=> handleAssignAccount()}>
                  Thêm
                </Button>
              </Grid>
            </Grid>
            <Grid container className={classes.gridItem} alignItems="center">
              <TableContainer>
                <Table
                  stickyHeader
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={'medium'}
                // aria-label="enhanced table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        Email
                      </TableCell>
                      <TableCell padding="checkbox">
                        Tên
                      </TableCell>
                      <TableCell padding="checkbox">
                        SDT
                      </TableCell>
                      <TableCell padding="checkbox">
                        
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {useDeptList && useDeptList.map((row, index) => {

                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          tabIndex={-1}
                          key={row.id}

                        >
                          <TableCell padding="checkbox">
                            <>
                              <span
                                className={classes.tableItemName}

                              >
                                {row.email_address}
                              </span>
                            </>
                          </TableCell>
                          <TableCell padding="checkbox">
                            <>
                              <span
                                className={classes.tableItemName}

                              >
                                {row.full_name}
                              </span>
                            </>
                          </TableCell>
                          <TableCell padding="checkbox">
                            <>
                              <span
                                className={classes.tableItemName}

                              >
                                {row.phone_number}
                              </span>
                            
                            </>
                          </TableCell>
                          <TableCell>
                          <Button type="button" variant="contained" className={classes.handleButton} onClick={()=> handleRemoveAccount(row.email_address)}>
                                    <DeleteForeverIcon className={classes.noteButtonIcon} />
                            </Button>
                          </TableCell>
                           
                     

                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

            </Grid>


          </div>
          <div id="modal-modal-footer" sx={{ mt: 2 }}>
            <div style={style.buttonWrap}>
            
              {/*             
                <Button
                  disabled={isDisabledSaving}
                  type="button"
                  variant="contained"
                  style={style.buttonSubmit}
          
                >
                  Lưu
                </Button> */}

            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
