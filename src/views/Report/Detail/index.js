import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
  Paper,
  Stepper,
  TableContainer,
  TableHead,
  Step,
  StepLabel,
  Typography,
  Table,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions';
import { SNACKBAR_OPEN } from './../../../store/actions';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DatePicker from './../../../component/DatePicker/index';
import { Autocomplete } from '@material-ui/lab';
import {
  createMaterialReportFile,
  getAllCustomerCode,
  getAllMaterialReportType,
  getAllProduct,
  getAllWorkOrder,
  getListCustomerOrderCode,
  getListPart,
} from '../../../services/api/Report/MaterialReport';
import moment from 'moment/moment.js';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { getAllSupplier } from '../../../services/api/Partner/Supplier';
import ViewReportDataModal from './ViewDataTable';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  file: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
}));

const iconxlsx =
  'https://firebasestorage.googleapis.com/v0/b/tqtapp-873d6.appspot.com/o/Icon%2Ficon-xlsx.svg?alt=media&token=0ed22727-1170-4c85-b1d0-3f69341cd7e2';

const MaterialReportModel = () => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState('');
  const dispatch = useDispatch();

  const { materialReportDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const [reportType, setReportType] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [listCol, setlistCol] = useState([]);
  const [rowData, setRowData] = useState(['11/02/2023', 'test']);
  const [listSupplier, setlistSupplier] = useState([]);
  const [listCustomerOderCode, setListCustomerOderCode] = useState([]);
  const [listSelectedCustomerOrderCodes, setListSelectedCustomerOrderCodes] = useState([]);
  const [listPart, setListPart] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [dataTableModal, setDataTableModal] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [reportID, setReportID] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [listProductID, setListProductID] = useState([]);
  const [listCustomerCode, setListCustomerCode] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [listColDetail, setListColDetail] = useState([]);
  const [selectedReport, setSelectedReport] = useState('');
  const [queryData, setQueryData] = useState({
    from_date: new Date(),
    to_date: new Date(),
    report_type: '',
    report_name: '',
    work_order_id: '',
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Chọn báo cáo', 'Điền thông tin'];
  const [downloadURL, setDownloadURL] = useState('');
  const handleNext = async () => {
    if (activeStep === 1) {
      await handleSubmited();
      await setDataTableModal(true);
      handleCloseDialog();
    } else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    // if (activeStep === 2) {
    //   setlistCol(['']);
    // }

    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, materialReportDocument: false });
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
  const handleClick = (event, row) => {
    setQueryData({ ...queryData, report_type: row.id });
    setSelectedReport(row.id);
    if (activeStep === 0) {
      switch (row.id) {
        case 'TONG_HOP_TON_KHO_VAT_TU':
          setlistCol([
            'Danh mục',
            'Nhà cung cấp',
            'Mã vật tư',
            'Tên vật tư',
            'Đơn vị',
            'SL A',
            'SL Hỏng',
            'SL A',
            'SL Hỏng',
            'SL A',
            'SL Hỏng',
            'SL A',
            'SL Hỏng',
          ]);
          setListColDetail([
            'Ngày tháng',
            'Danh mục',
            'Nhà cung cấp',
            'Mã vật tư',
            'Tên vật tư',
            'Đơn vị',
            'Diễn giải',
            'SL A',
            'SL Hỏng',
            'SL A',
            'SL Hỏng',
            'SL A',
            'SL Hỏng',
            'SL A',
            'SL Hỏng',
          ]);
          break;
        case 'TONG_HOP_TON_KHO_THANH_PHAM':
          setlistCol([
            'Mã thành phẩm KH',
            'Mã thành phẩm TQT',
            'Tên thành phẩm',
            'Đơn vị',
            'Mã đơn hàng',
            'Tồn đầu kỳ',
            'Nhập',
            'Xuất',
            'Tồn cuối kỳ',
          ]);
          setListColDetail([
            'Ngày tháng',
            'Mã thành phẩm KH',
            'Mã thành phẩm TQT',
            'Tên thành phẩm',
            'Đơn vị',
            'Diễn giải',
            'Mã đơn hàng',
            'Tồn đầu kỳ',
            'Nhập',
            'Xuất',
            'Tồn cuối kỳ',
          ]);
          break;
        case 'KH_SAN_XUAT':
          setlistCol([
            'Ngày',
            'Mã đơn hàng',
            'Mã thành phẩm tqt',
            'Mã thành phẩm khách hàng',
            'Đơn vị',
            'Số lượng',
            'Số người làm',
            'Số giờ làm',
            '% công suất',
            'vật tư',
            'Nhà cung cấp(danh mục vật tư khăn)',
          ]);
          break;
        case 'KH_GIAO_HANG_CHO_NHA_CUNG_CAP':
          setlistCol([
            'Ngày nhập kho dự kiến',
            'Nhà cung cấp',
            'Mã đơn mua hàng',
            'Mã vật tư',
            'Tên vật tư',
            'Đơn vị',
            'Số lượng đặt',
            'Ngày sản xuất',
            'Mã đơn khách hàng',
            'Trạng thái',
            'Số lượng nhập kho',
            'Ghi chú',
          ]);
          break;
        case 'KH_GIAO_HANG_CHO_KHACH':
          setlistCol(['Khách hàng', 'Mã đơn hàng', 'Cảng đến', 'Ngày giao hàng', 'Trạng thái']);
          setListColDetail(['Mã sản phẩm', 'Mã SP KH', 'Tên sản phẩm', 'Đơn vị', 'SL cần', 'SL đã SX', 'SL đã lập KH', 'Nhà cung cấp']);
          break;
        case 'BAO_CAO_THUC_TE_SAN_XUAT':
          setlistCol([
            'Ngày sản xuất',
            'Mã đơn hàng',
            'Mã TP KH',
            'Mã TP TQT',
            'Tên sản phẩm',
            'Đơn vị',
            'Số lượng kế hoạch',
            'Số lượng thực tế',
            'Trạng thái',
          ]);
          break;
        default:
          break;
      }
    }
    setSelected(row);
  };
  const handleChangeSupplier = async (event, value) => {
    setSelectedSuppliers(value.map((item) => item.id));
    await getListPart({ list_supplier_id: value.map((item) => item.id) })
      .then((PartCodes) => listPart.concat({ id: null, value: 'Chọn tất cả' }, PartCodes))
      .then(setListPart);
  };

  const setDocumentToDefault = async () => {
    setQueryData({
      ...queryData,
      report_type: '',
      report_name: '',
      work_order_id: '',
    });
    setSelected('');
    setDownloadURL('');
    setActiveStep(0);
  };
  useEffect(() => {
    const fetchData = async () => {
      let newListSupplier = [];
      let newListCustomerCode = [];
      let newListProductCode = [];
      let newListCustomerOrderCode = [];

      if (selectedReport === 'KH_GIAO_HANG_CHO_NHA_CUNG_CAP' || selectedReport === 'TONG_HOP_TON_KHO_VAT_TU') {
        newListSupplier = await getAllSupplier();
      }

      if (selectedReport === 'KH_GIAO_HANG_CHO_KHACH') {
        const customerCodes = await getAllCustomerCode();
        newListCustomerCode = [{ id: null, value: 'Chọn tất cả' }, ...customerCodes];
      }
      if (selectedReport === 'KH_SAN_XUAT' || 'BAO_CAO_THUC_TE_SAN_XUAT') {
        const listCustomerOrderCode = await getListCustomerOrderCode();
        newListCustomerOrderCode = [{ id: null, value: 'Chọn tất cả' }, ...listCustomerOrderCode];
      }
      if (selectedReport === 'TONG_HOP_TON_KHO_THANH_PHAM') {
        const getProduct = await getAllProduct();
        newListProductCode = [{ id: null, value: 'Chọn tất cả' }, ...getProduct];
      }
      setListCustomerOderCode((prevListSupplier) => [...newListCustomerOrderCode]);
      setlistSupplier((prevListSupplier) => [...newListSupplier]);
      setListCustomerCode((prevListCustomerCode) => [...newListCustomerCode]);
      setListProductID((prevListCustomerCode) => [...newListProductCode]);
    };

    fetchData();
  }, [selectedReport]);

  const handleSubmited = async () => {
    try {
      if (!queryData.work_order_id) {
        handleOpenSnackbar('error', 'Không được để trống kế hoạch sản xuất!');
        return;
      }
      if (!queryData.report_name) {
        handleOpenSnackbar('error', 'Không được để trống tên report!');
        return;
      }
      const getReportID = await createMaterialReportFile(queryData);
      setReportID(getReportID);
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'materialReport' });
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };
  const handleCloseViewReportDataModal = () => {
    setDataTableModal(false);
  };

  function handleCustomerChange(event, value) {
    if (value.some((item) => item.id === null)) {
      setSelectedCustomers(listCustomerCode.map((item) => item.id));
    } else {
      setSelectedCustomers(value.map((item) => item.id));
    }
  }
  function handleCustomerOrderChange(event, value) {
    if (value.some((item) => item.id === null)) {
      setListSelectedCustomerOrderCodes(listCustomerOderCode.map((item) => item.id));
    } else {
      setListSelectedCustomerOrderCodes(value.map((item) => item.id));
    }
  }
  function handleProductCodeChange(event, value) {
    if (value.some((item) => item.id === null)) {
      setSelectedProducts(listProductID.map((item) => item.id));
    } else {
      setSelectedProducts(value.map((item) => item.id));
    }
  }

  function handlePartChange(event, value) {
    if (value.some((item) => item.id === null)) {
      setSelectedParts(listPart.map((item) => item.id));
    } else {
      setSelectedParts(value.map((item) => item.id));
    }
  }

  const checkToDate = (date, type) => {
    let DateCP;
    let DateCP2;
    if (type === 'to_date') {
      DateCP = new Date(date);
      DateCP2 = new Date(queryData.from_date);
    } else {
      DateCP = new Date(queryData.to_date);
      DateCP2 = new Date(date);
    }

    if (DateCP < DateCP2) {
      handleOpenSnackbar('error', 'Ngày không hợp lệ!');
      return;
    }
    setQueryData({ ...queryData, from_date: DateCP2, to_date: DateCP });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setQueryData({ ...queryData, [name]: value });
  };

  const renderStep1 = () => {
    return (
      <Table>
        <TableBody>
          {reportType.map((row, index) => (
            <TableRow key={index} hover align={'center'} onClick={(event) => handleClick(event, row)} selected={row.id === selected?.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell component="th" scope="row" padding="none">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderStep2 = () => {
    return (
      <Grid container className={classes.gridItemInfo} spacing={2}>
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Chọn kế hoạch sản xuất:</span>
          <Autocomplete
            options={workOrders}
            getOptionLabel={(option) => option.value}
            value={workOrders?.find((item) => item.id === queryData.work_order_id) || null}
            fullWidth
            onChange={(e, value) => setQueryData({ ...queryData, work_order_id: value?.id, work_order_name: value?.value })}
            size="small"
            renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
          />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <span className={classes.tabItemLabelField}>Từ ngày:</span>
          <DatePicker date={queryData.from_date} onChange={(date) => checkToDate(date)} />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <span className={classes.tabItemLabelField}>Đến ngày:</span>
          <DatePicker date={queryData.to_date} onChange={(date) => checkToDate(date, 'to_date')} />
        </Grid>
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Đặt tên report:</span>
          <TextField fullWidth variant="outlined" name="report_name" size="small" type="text" onChange={handleChanges} />
        </Grid>
        {['KH_GIAO_HANG_CHO_NHA_CUNG_CAP', 'TONG_HOP_TON_KHO_VAT_TU'].includes(selectedReport) && (
          <>
            <Grid item xs={12}>
              <span className={classes.tabItemLabelField}>Nhà cung cấp:</span>
              <Autocomplete
                options={listSupplier}
                multiple={true}
                getOptionLabel={(option) => option.title}
                // defaultValue={['a', 'b']}
                // value={listSupplier?.find((item) => item === ['a', 'b']) || ['']}
                fullWidth
                onChange={(e, value) => handleChangeSupplier(e, value)}
                size="small"
                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12}>
              <span className={classes.tabItemLabelField}>Vật tư:</span>
              <Autocomplete
                options={listPart}
                multiple={true}
                getOptionLabel={(option) => option.value}
                // defaultValue={['a', 'b']}
                // value={listSupplier?.find((item) => item === ['a', 'b']) || ['']}
                fullWidth
                onChange={(e, value) => handlePartChange(e, value)}
                size="small"
                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
              />
            </Grid>
          </>
        )}
        {['KH_GIAO_HANG_CHO_KHACH'].includes(selectedReport) && (
          <>
            <Grid item xs={12}>
              <span className={classes.tabItemLabelField}>Mã khách hàng:</span>
              <Autocomplete
                options={listCustomerCode}
                multiple={true}
                getOptionLabel={(option) => option.value}
                // defaultValue={['a', 'b']}
                // value={listSupplier?.find((item) => item === ['a', 'b']) || ['']}
                fullWidth
                onChange={(e, value) => handleCustomerChange(e, value)}
                size="small"
                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
              />
            </Grid>
          </>
        )}
        {['KH_SAN_XUAT', 'BAO_CAO_THUC_TE_SAN_XUAT'].includes(selectedReport) && (
          <>
            <Grid item xs={12}>
              <span className={classes.tabItemLabelField}>Mã đơn khách hàng:</span>
              <Autocomplete
                options={listCustomerOderCode}
                multiple={true}
                getOptionLabel={(option) => option.value}
                // defaultValue={['a', 'b']}
                // value={listSupplier?.find((item) => item === ['a', 'b']) || ['']}
                fullWidth
                onChange={(e, value) => handleCustomerOrderChange(e, value)}
                size="small"
                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
              />
            </Grid>
          </>
        )}
        {['TONG_HOP_TON_KHO_THANH_PHAM'].includes(selectedReport) && (
          <>
            <Grid item xs={12}>
              <span className={classes.tabItemLabelField}>Mã thành phẩm:</span>
              <Autocomplete
                options={listProductID}
                multiple={true}
                getOptionLabel={(option) => option.value}
                // defaultValue={['a', 'b']}
                // value={listSupplier?.find((item) => item === ['a', 'b']) || ['']}
                fullWidth
                onChange={(e, value) => handleProductCodeChange(e, value)}
                size="small"
                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
              />
            </Grid>
          </>
        )}
      </Grid>
    );
  };
  const renderStep3 = () => {
    return (
      <Grid container className={classes.gridItemInfo} spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} xs={12}>
              <div className={classes.tabItem}>
                <div className={classes.tabItemTitle}>
                  <div className={classes.tabItemLabel}>
                    <span>Chi tiết xuất nhập</span>
                  </div>
                </div>
                <div className={classes.tabItemBody}>
                  <TableContainer style={{ maxHeight: '65vh' }} component={Paper}>
                    <Table stickyHeader aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          {listCol?.map((col, index) => (
                            <TableCell align="left">{col}</TableCell>
                          ))}
                          {/* <TableCell align="left">Ngày chứng từ</TableCell>
                          <TableCell align="left">Mã phiếu xuất/nhập kho</TableCell>
                          <TableCell align="left">Diễn giải</TableCell>
                          <TableCell align="left">SL nhập</TableCell>
                          <TableCell align="left">SL nhập hỏng</TableCell>
                          <TableCell align="left">SL xuất</TableCell>
                          <TableCell align="left">SL xuất hỏng</TableCell>
                          <TableCell align="left">SL tồn</TableCell>
                          <TableCell align="left">SL tồn hỏng</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rowData?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align="left">{row.order_date}</TableCell>
                            <TableCell align="left">{row.order_code}</TableCell>
                            <TableCell align="left">{row.detail}</TableCell>
                            <TableCell align="left">{row.received_quantity_in_piece}</TableCell>
                            <TableCell align="left">{row.broken_received_quantity_in_piece}</TableCell>
                            <TableCell align="left">{row.requisition_quantity_in_piece}</TableCell>
                            <TableCell align="left">{row.broken_requisition_quantity_in_piece}</TableCell>
                            <TableCell align="left">{row.inventory_quantity_in_piece}</TableCell>
                            <TableCell align="left">{row.broken_inventory_quantity_in_piece}</TableCell>
                            <TableCell align="left">
                              <AddCircleIcon onClick={handleNext}></AddCircleIcon>
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
        </Grid>
      </Grid>
    );
  };

  const renderStep4 = () => {
    return (
      <Grid container className={classes.gridItemInfo} spacing={2}>
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Loại report: {selected.value}</span>
        </Grid>
        {/* <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Tên report: {queryData.report_name}</span>
        </Grid> */}
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Kế hoạch sản xuất: {queryData.work_order_name}</span>
        </Grid>
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Từ ngày: {moment(queryData.from_date).format('DD/MM/YYYY')}</span>
        </Grid>
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Đến ngày: {moment(queryData.to_date).format('DD/MM/YYYY')}</span>
        </Grid>
        <Grid item xs={12} className={classes.file}>
          <Link href={downloadURL} target="_blank" rel="noopener">
            <img src={iconxlsx} alt="download" />
            <Typography variant="h6">Tải file</Typography>
          </Link>
        </Grid>
      </Grid>
    );
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return '';
      // return renderStep3();
      default:
        return '';
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const reporttype = await getAllMaterialReportType();
      setReportType(reporttype);
    };
    const fetchWorkOrderData = async () => {
      const workOrders = await getAllWorkOrder();
      setWorkOrders(workOrders);
    };
    fetchData();
    fetchWorkOrderData();
  }, []);

  return (
    <React.Fragment>
      <ViewReportDataModal
        isOpen={dataTableModal}
        listSupplier={selectedSuppliers}
        listPart={selectedParts}
        fromDate={queryData.from_date}
        toDate={queryData.to_date}
        reportID={reportID}
        listProductID={selectedProducts}
        listCustomerCode={selectedCustomers}
        listCol={listCol}
        reportType={selectedReport}
        listColDetail={listColDetail}
        listCustomerOrderCode={listSelectedCustomerOrderCodes}
        handleClose={handleCloseViewReportDataModal}
        // handleSubmit={handleSubmitBroken}
        // handleOpenSnackbar={handleOpenSnackbar}
        // list={inventoryData?.broken_list || []}
      />

      <Dialog fullWidth={true} maxWidth={'sm'} open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle disableTypography>
          <Typography variant="h3" align="center">
            Lập báo cáo
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className={classes.root}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div>{getStepContent(activeStep)}</div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.footer}>
          {activeStep === 0 ? (
            <Button onClick={handleCloseDialog} variant="outlined">
              Đóng
            </Button>
          ) : (
            <Button onClick={handleBack} variant="outlined">
              Quay lại
            </Button>
          )}
          {activeStep > 1 ? undefined : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Tiếp tục
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default MaterialReportModel;
