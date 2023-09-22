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
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/vi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  addMaterialReportFileToReport,
  getMaterialInventorySynthesis,
  getViewDataForReporTemplate,
} from '../../../../services/api/Report/MaterialReport';
import Row from './row.table.';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
const usetableStyles = makeStyles({
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
    '& td': {
      // border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
      width: '15%',
    },
    '& th': {
      // border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
      fontWeight: 'bold',
      backgroundColor: '#f2f2f2',
      // width: '15%',
    },
    '& .center': {
      textAlign: 'center',
      '& td': {
        width: '50%',
      },
    },
  },
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
  scroll: {
    height: 60,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flexStart',
    whiteSpace: 'pre-wrap',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
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
    listCustomerOrderCode,
    reportName,
  } = props;
  const { reportViewDataTableDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const dispatch = useDispatch();
  const { selectedDocument } = useSelector((state) => state.document);
  const classes = useStyles();
  const classesTable = usetableStyles();
  const [listViewData, setListViewData] = useState([]);
  const [sumaryDataa, setsumaryDataa] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isSynthetic, setIsSynthetic] = useState(false);
  const [isCompact, setisCompact] = useState(false);
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
  useEffect(() => {
    if (isCompact === true) {
      handleExportReportTemplate();
    }
  }, [isCompact]);
  const handleExportReportTemplate = async () => {
    const addMaterialReportFile = async () => {
      const url = await addMaterialReportFileToReport({
        from_date: fromDate,
        to_date: toDate,
        report_id: reportID,
        supplier_id_list: listSupplier,
        part_id_list: listPart,
        product_code_list: listProductID,
        customer_code_list: listCustomerCode,
        customer_order_code_list: listCustomerOrderCode,
        is_synthetic: isSynthetic,
        is_compact: isCompact,
      });
      return url;
    };

    const url = await addMaterialReportFile();
    handleDownload(url);

    setisCompact(false);
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
    setListViewData([]);
    setTabIndex(0);
  };
  const handleCloseModel = () => {
    setDocumentToDefault();
    handleClose();
  };
  useEffect(() => {
    if (!selectedDocument) return;
    setsumaryDataa({
      ...setsumaryDataa,
      ...selectedDocument,
    });
  }, [selectedDocument]);
  useEffect(() => {
    const fetchData = async () => {
      if (
        reportType === 'BAO_CAO_SU_DUNG_VAT_TU_NHA_CUNG_CAP' ||
        'BAO_CAO_THEO_DOI_HOP_DONG' ||
        'BAO_CAO_THEO_DOI_HOP_DONG_THANH_PHAM' ||
        'TONG_HOP_TON_KHO_VAT_TU' ||
        'TONG_HOP_TON_KHO_THANH_PHAM' ||
        'BAO_CAO_THUA_THIEU_VAT_TU_NHA_CUNG_CAP' ||
        'BAO_CAO_THUC_TE_SAN_XUAT'
      ) {
        await setIsSynthetic(true);
      }

      const getListViewData = await getViewDataForReporTemplate({
        supplier_id_list: listSupplier,
        part_id_list: listPart,
        from_date: fromDate,
        to_date: toDate,
        report_id: reportID,
        product_code_list: listProductID,
        customer_code_list: listCustomerCode,
        customer_order_code_list: listCustomerOrderCode,
        is_synthetic: isSynthetic,
      });
      const listViewData =
        reportType === 'KH_GIAO_HANG_CHO_NHA_CUNG_CAP'
          ? getListViewData?.list
          : reportType === 'KH_GIAO_HANG_CHO_KHACH'
          ? getListViewData?.list_delivery_to_customer
          : reportType === 'TONG_HOP_TON_KHO_VAT_TU'
          ? getListViewData?.list_data_synthesis
          : reportType === 'KH_XUAT_NHAP'
          ? getListViewData?.list_requisition_received_plan
          : reportType === 'KH_SAN_XUAT'
          ? getListViewData?.list_data_production_detail_plan
          : reportType === 'BAO_CAO_THUC_TE_SAN_XUAT'
          ? getListViewData?.list_data_for_production_reality
          : reportType === 'TONG_HOP_TON_KHO_THANH_PHAM'
          ? getListViewData?.list_data_product_inventory
          : reportType === 'BAO_CAO_SU_DUNG_VAT_TU_NHA_CUNG_CAP'
          ? getListViewData?.list_use_of_material_supplier_detail
          : reportType === 'BAO_CAO_THUA_THIEU_VAT_TU_NHA_CUNG_CAP'
          ? getListViewData?.list_difference_data
          : reportType === 'BAO_CAO_SU_DUNG_VAT_TU_THEO_DON_HANG'
          ? getListViewData?.list_use_of_material_supplier_from_order
          : reportType === 'BAO_CAO_THEO_DOI_HOP_DONG'
          ? getListViewData?.list_contract_view_data
          : reportType === 'BAO_CAO_THEO_DOI_HOP_DONG_THANH_PHAM'
          ? getListViewData?.list_product_contract_view_data
          : undefined;

      setListViewData(listViewData);
    };
    if (isOpen) {
      fetchData();
    }
  }, [
    isOpen,
    listSupplier,
    listPart,
    reportID,
    fromDate,
    toDate,
    listProductID,
    listCustomerCode,
    listCustomerOrderCode,
    reportType,
    isSynthetic,
  ]);
  const formats = {
    dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd, DD/MM/YYYY', culture),
    agendaDateFormat: (date, culture, localizer) => localizer.format(date, 'DD/MM/YYYY', culture),
    agendaTimeFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture),
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
    monthHeaderFormat: (date, culture, localizer) => localizer.format(date, 'MMMM YYYY', culture),
    agendaHeaderFormat: (date, culture, localizer) => localizer.format(date, 'dddd, DD/MM/YYYY', culture),
    selectRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'DD/MM/YYYY', culture)} - ${localizer.format(end, 'DD/MM/YYYY', culture)}`,
    weekNumberFormat: (weekNumber) => `Tuần ${weekNumber}`,
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'DD/MM/YYYY', culture)} - ${localizer.format(end, 'DD/MM/YYYY', culture)}`,
    todayFormat: (date, culture, localizer) => localizer.format(date, '[Hôm nay], DD/MM/YYYY', culture),
    toolbarDateFormat: (date, culture, localizer) => localizer.format(date, 'MMMM YYYY', culture),
    agendaTodayLabel: {
      long: 'Hôm nay',
      short: 'Hôm nay',
    },
    agendaYesterdayLabel: {
      long: 'Hôm qua',
      short: 'Hôm qua',
    },
    agendaTomorrowLabel: {
      long: 'Ngày mai',
      short: 'Ngày mai',
    },
    agendaEventLabel: {
      long: 'Sự kiện',
      short: 'Sự kiện',
    },
    allDayLabel: 'Cả ngày',
    previousLabel: 'Trước',
    nextLabel: 'Tiếp',
    showMore: (total) => `Xem thêm (${total})`,
  };
  const messages = {
    allDay: 'Cả ngày',
    previous: 'Trước',
    next: 'Tiếp',
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần',
    day: 'Ngày',
    agenda: 'Lịch công việc',
    date: 'Ngày',
    time: 'Thời gian',
    event: 'Sự kiện',
    noEventsInRange: 'Không có sự kiện nào trong phạm vi này.',
    showMore: (total) => `Xem thêm (${total})`,
  };

  const Event = ({ event }) => (
    <div className={classes.scroll}>
      <div
        style={{
          Width: '100%',
          whiteSpace: 'break-spaces',
          wordBreak: 'break-all',
        }}
      >
        {event.received_title}
      </div>
      <br></br>
      <div
        style={{
          Width: '100%',
          whiteSpace: 'break-spaces',
          wordBreak: 'break-all',
        }}
      >
        {event.requisition_title}
      </div>
    </div>
  );

  const localizer = momentLocalizer(moment);

  return (
    <Grid container>
      <Dialog open={isOpen || false} TransitionComponent={Transition} keepMounted onClose={() => handleCloseModel()} fullScreen>
        <DialogTitle className={classes.dialogTitle}>
          <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
            Dữ liệu báo cáo
          </Grid>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TabPanel value={tabIndex} index={0}>
                <Grid container spacing={1}>
                  <Grid item lg={12} md={12} xs={12}>
                    <div style={{ textAlign: 'center' }}>
                      <h1>{reportName}</h1>
                      <span>
                        Từ ngày {moment(fromDate).format('DD/MM/YYYY')} đến ngày {moment(toDate).format('DD/MM/YYYY')}
                      </span>
                    </div>
                  </Grid>

                  <Grid item lg={12} md={12} xs={12}>
                    <div className={classes.tabItem}>
                      <div className={classes.tabItemBody}>
                        {reportType !== 'KH_XUAT_NHAP' ? (
                          <TableContainer style={{ maxHeight: '65vh' }} component={Paper}>
                            <Table stickyHeader aria-label="simple table" className={classesTable.table}>
                              <TableHead>
                                <TableRow>
                                  <TableCell />
                                  {listCol?.map((col, index) => (
                                    <React.Fragment key={index}>
                                      {['Tồn đầu', 'Nhập', 'Xuất', 'Tồn cuối'].includes(col) &&
                                      reportType !== 'TONG_HOP_TON_KHO_THANH_PHAM' ? (
                                        <TableCell colSpan={2} align="center" style={{ width: '10%' }}>
                                          {col}
                                          <TableRow>
                                            <TableCell align="center" className={classesTable.cellData}>
                                              &nbsp;&nbsp;&nbsp; SL A&nbsp;&nbsp;
                                            </TableCell>
                                            <TableCell align="center" className={classesTable.cellData}>
                                              SL hỏng
                                            </TableCell>
                                          </TableRow>
                                        </TableCell>
                                      ) : ['Tồn đầu kỳ', 'Tồn cuối kỳ'].includes(col) && reportType === 'TONG_HOP_TON_KHO_THANH_PHAM' ? (
                                        <TableCell colSpan={2} align="center" style={{ width: '10%' }}>
                                          {col}
                                          <TableRow>
                                            <TableCell align="center" className={classesTable.cellData}>
                                              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; SL&nbsp;&nbsp;
                                            </TableCell>
                                            <TableCell align="center" className={classesTable.cellData}>
                                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                                              &nbsp;&nbsp;&nbsp;Trị giá
                                            </TableCell>
                                          </TableRow>
                                        </TableCell>
                                      ) : (
                                        <TableCell align="left">{col}</TableCell>
                                      )}
                                    </React.Fragment>
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
                                    index={index}
                                    toDate={toDate}
                                  />
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Calendar
                            localizer={localizer}
                            events={listViewData}
                            startAccessor="start"
                            endAccessor="end"
                            // contentHeight="auto"
                            style={{ minHeight: 1000 }}
                            components={{ event: Event }}
                            step={30}
                            selectable={false}
                            views={{
                              month: true,
                              agenda: true,
                            }}
                            messages={messages}
                            defaultView="month"
                            defaultDate={new Date()}
                            culture="vi"
                            formats={formats}
                          />
                        )}
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
            <Grid style={{ display: 'flex' }}>
              {['KH_XUAT_NHAP'].includes(reportType) ? null : (
                <Grid item className={classes.gridItemInfoButtonWrap}>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleExportReportTemplate}>
                    Xuất File
                  </Button>
                </Grid>
              )}
              {['KH_GIAO_HANG_CHO_KHACH'].includes(reportType) ? (
                <Grid item className={classes.gridItemInfoButtonWrap} style={{ marginLeft: 10 }}>
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={() => setisCompact(true)}>
                    Xuất file rút gọn
                  </Button>
                </Grid>
              ) : undefined}
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
