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
  Snackbar,
  Checkbox,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@material-ui/core';
import { TreeView } from '@material-ui/lab';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeItemClassKey from '@material-ui/lab/TreeItem/TreeItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../store/constant.js';
import useView from '../../../hooks/useView';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions.js';
import { getTreeViewMenuList, getMenuLookupList, updateMenuLookupList } from '../../../services/api/UserGroup/index';
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

const UserGroupMenuItemModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.user.detail.save);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const [listChecked, setListChecked] = useState([]);
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
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
  const handleChecked = (value) => {
    let check = listChecked.some(item => item === value)
    if (check) {
      let filterarray = listChecked.filter(item => item !== value)
      setListChecked([...filterarray])
    } else {
      setListChecked([...listChecked, value])
    }

  }
  const handleUpdateAccount = async () => {
    try {
      let check = await updateMenuLookupList(selectedDocument.group_code, listChecked)
      handleOpenSnackbar(true, 'success', 'Cập nhật thành công!');
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'usergroupmenuitem' });
      handleCloseDialog()
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Cập nhật thất bại!');
    } finally {
    }
  };
  const setDocumentToDefault = async () => {
    setTabIndex(0);
  };
  const [dataShow, setData] = React.useState();
  useEffect(() => {
    const fetch = async () => {
      let data = await getTreeViewMenuList();
      setData(data);
    };
    fetch();
  }, []);
  useEffect(() => {
    if (!selectedDocument) return;
    const fetch = async () => {
      let list = await getMenuLookupList(selectedDocument.group_code)
      setListChecked([...list])
    }
    fetch()
  }, [selectedDocument])

  const renderItem = (data) => {
    if (data.children.length === 0) {
      return (
        <>
          <TreeItem
            nodeId={data.id}
            label={<><Checkbox
              checked={listChecked?.some(
                (item) =>
                  item === data.id
              )}
              onChange={(e) => handleChecked(data.id)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />{data.name}</>}
            key={data.id}
            // onClick={(event) => handleClickOpen(data.id)}
            className={TreeItemClassKey.MuiTreeItemlabel}
          />
        </>
      );
    } else {
      return (
        <TreeItem
          nodeId={data.id}
          label={<><Checkbox
            checked={listChecked?.some(
              (item) =>
                item === data.id
            )}
            onChange={(e) => handleChecked(data.id)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />{data.name}</>}
          key={data.id}
        // onClick={(event) => handleClickOpen(data.id)}
        >
          {data.children.map((data2) => renderItem(data2))}
        </TreeItem>
      );

    }
  };

  function MinusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

  function PlusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }


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
              Thông tin cấu hình chức năng
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
                  <Grid item lg={7} md={7} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin nhóm người dùng</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã: </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="group_code"
                                value={selectedDocument?.group_code}
                                className={classes.inputField}
                                disabled={true}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên: </span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="group_name"
                                value={selectedDocument?.group_name}
                                className={classes.inputField}
                                disabled={true}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItem} alignItems="center">
                            <TableContainer component={Paper} style={{ maxHeight: 300 }}>
                              <Table  aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Tên</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {selectedDocument?.user_list.map((row) => (
                                    <TableRow
                                      key={row.email_address}
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell component="th" scope="row">
                                        <img alt="" src={row.image_url} style={{
                                          height: '50px',
                                          width: '50px',
                                          objectFit: 'cover',
                                          boxShadow: 'rgb(50 50 93 / 25%) 0px 2px 5px -1px, rgb(0 0 0 / 30%) 0px 1px 3px -1px',
                                          borderRadius: '4px',
                                        }} />
                                      </TableCell>
                                      <TableCell align="left">{row.email_address}</TableCell>
                                      <TableCell align="left">{row.full_name}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={5} md={5} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Danh sách chức năng</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            {dataShow && (
                              <TreeView
                                style={{ padding: 5, minHeight: 480, maxHeight: 480, background: '#fff', overflow: 'auto', 
                                maxWidth: 370, minWidth: 370, }}
                                aria-label="file system navigator"
                                defaultCollapseIcon={<MinusSquare />}
                                defaultExpandIcon={<PlusSquare />}
                                sx={{ height: 264, flexGrow: 1, maxWidth: 500, minWidth: 500, overflowY: 'auto' }}
                              >
                                <>{dataShow.map((data) => renderItem(data))}</>
                              </TreeView>
                            )}
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
              {!selectedDocument && (
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
              {!!selectedDocument && (
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
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};
export default UserGroupMenuItemModal;
