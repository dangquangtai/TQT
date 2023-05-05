import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  Grid,
  FormControl,
  TableCell,
  IconButton,
  TextField,
  MenuItem,
  TableContainer,
  Tab,
  DialogActions,
  Collapse,
  Table,
  TableBody,
  Dialog,
  DialogTitle,
  Slide,
  DialogContent,
  Tabs,
  Typography,
  TableHead,
  Paper,
  TableRow,
  Link,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './../../../../utils/classes';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import DatePicker, { getAllSupplier } from './../../../../services/api/Partner/Supplier';
import { History, DescriptionOutlined, AddCircleOutlineOutlined, InfoOutlined } from '@material-ui/icons';
import { exportDetailedSummaryMaterialInventory } from '../../../../services/api/Material/Warehouse';
import { downloadFile } from '../../../../utils/helper';
import { Autocomplete } from '@material-ui/lab';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/Remove';

import {
  addMaterialReportFileToReport,
  getMaterialInventorySynthesis,
  getViewDataForReporTemplate,
} from '../../../../services/api/Report/MaterialReport';
import Row from './row.table.';
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
const style = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '80%',
    boxShadow: 24,
    background: '#FFFFFF',
    borderRadius: '15px',
  },
  title: {
    padding: '16px 32px 20px',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  body: {
    padding: '0 32px',
  },
  form: {
    width: '100%',
    marginBottom: '10px',
  },
  BrokenContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  BrokenLabel: {
    fontWeight: 'bold',
    // marginTop: 15,
  },
  input: {},
  buttonWrap: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 32px 16px',
  },
  button: {
    margin: '0 12px',
    background: '#FFC000',
  },
  closeButton: {
    margin: '0 12px',
    background: '#465169',
  },
  submitButton: {
    margin: '0 12px',
    background: '#612AFF',
  },
  error: {
    color: 'red',
  },
  formlabel: {
    fontWeight: 'bold',
  },
  table: {
    maxHeight: 250,
    marginBottom: 25,
  },
  flexEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};
const useRowStyles = {
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
};

export default function ViewReportDataModal(props) {
  const {
    isOpen,
    listCol,
    listColDetail,
    fromDate,
    toDate,
    listSupplier,
    listPart,
    handleClose,
    reportID,
    listProductID,
    reportType,
    listCustomerCode,
  } = props;
  const { reportViewDataTableDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const dispatch = useDispatch();
  const { selectedDocument } = useSelector((state) => state.document);
  const classes = useStyles();
  const [listViewData, setListViewData] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [exportData, setExportData] = useState({
    from_date: new Date(),
    to_date: new Date(),
    supplier_id: '',
  });
  const handleSubmited = async () => {
    if (!exportData?.supplier_id) {
      handleOpenSnackbar('error', 'Không được để trống nha cung cấp!');
      return;
    }
    const getURL = await exportDetailedSummaryMaterialInventory(exportData);
    handleDownload(getURL);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setExportData({ ...exportData, [name]: value });
  };

  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
  };

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };
  const handleExportReportTemplate = async () => {
    const url = await addMaterialReportFileToReport({
      from_date: fromDate,
      to_date: toDate,
      report_id: reportID,
      supplier_id_list: listSupplier,
      part_id_list: listPart,
      product_code_list: listProductID,
      customer_code_list: listCustomerCode,
    });
    dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialReport' });
    handleDownload(url);
  };
  const handleOpenSnackbar = (type, text) => {
    dispatch({
      type: SNACKBAR_OPEN,
      open: true,
      variant: 'alert',
      message: text,
      alertSeverity: type,
    });
  };
  const setDocumentToDefault = async () => {
    setExportData({});
    setTabIndex(0);
  };
  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, reportViewDataTableDocument: false });
  };
  useEffect(() => {
    const fetchData = async () => {
      const getListViewData = await getViewDataForReporTemplate({
        supplier_id_list: listSupplier,
        part_id_list: listPart,
        from_date: fromDate,
        to_date: toDate,
        report_id: reportID,
        product_code_list: listProductID,
        customer_code_list: listCustomerCode,
      });
      {
        const listViewData =
          reportType === 'KH_GIAO_HANG_CHO_NHA_CUNG_CAP'
            ? getListViewData?.list
            : reportType === 'KH_GIAO_HANG_CHO_KHACH'
            ? getListViewData?.list_delivery_to_customer
            : reportType === 'TONG_HOP_TON_KHO_VAT_TU'
            ? getListViewData?.list_data_synthesis
            : undefined;
        setListViewData(listViewData);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen, listSupplier, listPart, reportID]);

  return (
    <Grid container>
      <Dialog open={isOpen || false} TransitionComponent={Transition} keepMounted onClose={() => handleClose()} fullScreen>
        <DialogTitle className={classes.dialogTitle}>
          <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
            Dữ liệu báo cáo
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
                {/* <Tab
                  className={classes.unUpperCase}
                  label={
                    <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                      <History />
                      Chi tiết xuất nhập
                    </Typography>
                  }
                  value={0}
                  {...a11yProps(0)}
                /> */}
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={tabIndex} index={0}>
                <Grid container spacing={1}>
                  <Grid item lg={12} md={12} xs={12}>
                    <div className={classes.tabItem}>
                      <div className={classes.tabItemBody}>
                        <TableContainer style={{ maxHeight: '65vh' }} component={Paper}>
                          <Table stickyHeader aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell />
                                {listCol?.map((col, index) => (
                                  <TableCell align="left">{col}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {listViewData?.map((row, index) => (
                                <Row
                                  key={index}
                                  row={row}
                                  reportType={reportType}
                                  listColDetail={listColDetail}
                                  reportID={reportID}
                                  fromDate={fromDate}
                                  toDate={toDate}
                                />
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
            <Grid item className={classes.gridItemInfoButtonWrap}>
              <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleClose()}>
                Đóng
              </Button>
            </Grid>
            {reportType === 'TONG_HOP_TON_KHO_VAT_TU' ? undefined : (
              <Grid item className={classes.gridItemInfoButtonWrap}>
                {/* {selectedDocument?.id && buttonSave && ( */}
                <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleExportReportTemplate}>
                  Xuất File
                </Button>
                {/* )} */}
              </Grid>
            )}
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
