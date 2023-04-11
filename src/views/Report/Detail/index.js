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
  Stepper,
  Step,
  StepLabel,
  Typography,
  Table,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { FLOATING_MENU_CHANGE } from '../../../store/actions';
import { SNACKBAR_OPEN } from './../../../store/actions';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DatePicker from './../../../component/DatePicker/index';
import { Autocomplete } from '@material-ui/lab';
import { createMaterialReportFile, getAllMaterialReportType, getAllWorkOrder } from '../../../services/api/Report/MaterialReport';
import moment from 'moment/moment.js';

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
  const [queryData, setQueryData] = useState({
    from_date: new Date(),
    to_date: new Date(),
    report_type: '',
    report_name: '',
    work_order_id: '',
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Chọn báo cáo', 'Điền thông tin', 'Truy xuất'];
  const [downloadURL, setDownloadURL] = useState('');
  const handleNext = () => {
    if (activeStep === 1) {
      handleSubmited();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
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
    setSelected(row);
  };

  const setDocumentToDefault = async () => {
    setQueryData({
      from_date: new Date(),
      to_date: new Date(),
      report_type: '',
      report_name: '',
      work_order_id: '',
    });
    setSelected('');
    setDownloadURL('');
    setActiveStep(0);
  };

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
      const getURL = await createMaterialReportFile(queryData);
      setDownloadURL(getURL);
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

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
      </Grid>
    );
  };

  const renderStep3 = () => {
    return (
      <Grid container className={classes.gridItemInfo} spacing={2}>
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Loại report: {selected.value}</span>
        </Grid>
        <Grid item xs={12}>
          <span className={classes.tabItemLabelField}>Tên report: {queryData.report_name}</span>
        </Grid>
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
        return renderStep3();
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
          {activeStep === steps.length - 1 ? (
            <>
              <Button component={Link} target="_blank" href={downloadURL} variant="contained" color="primary" onClick={handleCloseDialog}>
                Tải xuống
              </Button>
              <Button variant="contained" color="primary" onClick={handleCloseDialog}>
                Hoàn thành
              </Button>
            </>
          ) : (
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
