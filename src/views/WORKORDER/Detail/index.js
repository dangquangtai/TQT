import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Tooltip,
  MenuItem,
  TextField,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
  Paper,
  IconButton,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import useStyles from './classes.js';
import {
  FLOATING_MENU_CHANGE,
  ORDER_DETAIL_CHANGE,
  DOCUMENT_CHANGE,
  MATERIAL_CHANGE,
  SNACKBAR_OPEN,
} from '../../../store/actions.js';
import { SkipNext, SkipPrevious } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { month, weekday } from './../data';
import { Delete } from '@material-ui/icons';
import { AddCircleOutline } from '@material-ui/icons';
import { downloadFile } from './../../../utils/helper';
import {
  getStatusList,
  createWorkorOrder,
  updateWorkorOrder,
  getMaterialDaily,
  getPartList,
  getDetail,
  getLink,
} from '../../../services/api/Workorder/index.js';

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
  const [tabIndex, setTabIndex] = useState(0);
  const { selectedDocument } = useSelector((state) => state.document);
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { order } = useSelector((state) => state.order);
  const { order: orderRedux } = useSelector((state) => state.order);
  const [productList, setProductList] = useState([]);
  const [productionDailyRequestList, setProductionDailyRequest] = useState([]);
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [indexDate, setIndexDate] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [currentWeek, setCurrentWeek] = useState(0);
  let dataMaterial = [];
  let partList = [];
  const [workorderRequest, setWorkorderRequest] = useState({
    status_code: '',
    title: '',
    to_date: '',
    from_date: '',
  });
  const [open, setOpen] = useState(false);
  const [productionStatus, setProductionStatus] = useState([
    {
      id: '',
      value: '',
    },
  ]);

  const virtuoso = useRef(null);
  const [dropdownData, setDopDownData] = useState([]);
  const handleViewDetailMaterial = (product, index) => {
    handleUpdateWorkOrder(product, index);
  };
  const calculateQuantity = (product, index) => {
    const color = product.is_enough ? 'rgb(48, 188, 65)' : 'yellow';

    return (
      <>
        <Typography style={{ backgroundColor: color }}>{product.is_enough ? 'Đủ' : 'Thiếu'}</Typography>
        <u>
          <label onClick={() => handleViewDetailMaterial(product, index)}>Chi tiết</label>
        </u>
      </>
    );
  };

  const handleChangeRow = (row, index) => {
    if (!!row) {
      const newProductList = [...productList];
      const newProduct = {
        unit_name: row?.unit_name || 'Thùng',
        unit_id: row?.unit_id,
        quantity_produced: row?.quantity_produced,
        quantity_in_box: 1,
        maxValue: row?.quantity_in_box,
        product_customer_code: row?.product_customer_code,
        product_name: row?.product_name,
        product_code: row?.product_code,
        id: '',
        order_id: row?.order_id,
        customer_order_code: order?.order_code,
        product_id: row?.id,
        no_piece_per_box: row?.no_piece_per_box,
        productivity_per_worker: row?.productivity_per_worker,
        part_list: [],
        is_enough: false,
        customer_order_id: row.order_id,
      };
      newProductList[index] = { ...newProductList[index], ...newProduct };
      let data = newProductList.find((x) => x.product_id === '');
      if (!data) {
        setProductList([
          ...newProductList,
          {
            unit_name: 'Thùng',
            unit_id: '',
            quantity_produced: 0,
            quantity_in_box: 0,
            product_customer_code: '',
            product_name: '',
            product_code: '',
            id: '',
            no_piece_per_box: 0,
            order_id: '',
            product_id: '',
            productivity_per_worker: 0,
            part_list: [],
            is_enough: false,
          },
        ]);
        try {
          virtuoso.current.scrollIntoView({ block: 'end' });
        } catch {}
      } else {
        setProductList([...newProductList]);
      }
      updateDataDailyRequest(newProductList);
    }
  };
  const handleAddRow = () => {
    setProductList([
      ...productList,
      {
        unit_name: 'Thùng',
        unit_id: '',
        quantity_produced: 0,
        quantity_in_box: 0,
        product_customer_code: '',
        product_name: '',
        product_code: '',
        id: '',
        status: null,
        order_id: '',
        product_id: '',
        part_list: [],
        is_enough: false,
      },
    ]);
    try {
      virtuoso.current.scrollIntoView({ block: 'end' });
    } catch {}
  };
  const handleDeleteRow = (index) => {
    try {
      if (productList[index].id != '') {
        let orderDetail = order?.orderDetail;
        orderDetail.find((x) => x.id === productList[index].id).quantity_produced -= productList[index].quantity_in_box;
        dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: orderDetail });
      }
    } catch {}

    productList.splice(index, 1);
    setProductList([...productList]);
    updateDataDailyRequest(productList);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'workorder' });
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false, documentType: 'workorder' });
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

  const handleCreateWorkOrder = async () => {
    try {
      if (productionDailyRequestList.length < 2) {
        handleOpenSnackbar('error', 'Số ngày kế hoạch không thể nhỏ hơn 2 !');
      } else {
        let work_id = {};
        if (!selectedDocument) {
          work_id = await createWorkorOrder({
            workshop_id: '4bcc7f81-785d-11ed-b861-005056a3c175',
            to_date: workorderRequest.to_date,
            index_request: indexDate,
            from_date: workorderRequest.from_date,
            title: workorderRequest.title,
            order_code: workorderRequest.order_code,
            status_code: workorderRequest.status_code,
            daily_request_list: [...productionDailyRequestList],
          });
          handleOpenSnackbar('success', 'Tạo kế hoạch thành công!');
          let data = await getDetail(work_id.work_order_request_id);
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: data, documentType: 'workorder' });
        } else {
          work_id = await updateWorkorOrder({
            workshop_id: '4bcc7f81-785d-11ed-b861-005056a3c175',
            index_request: indexDate,
            id: selectedDocument.id,
            to_date: workorderRequest.to_date,
            from_date: workorderRequest.from_date,
            title: workorderRequest.title,
            order_code: workorderRequest.order_code,
            status_code: workorderRequest.status_code,
            daily_request_list: [...productionDailyRequestList],
          });
          handleOpenSnackbar('success', 'Cập nhật kế hoạch thành công!');
        }
        setWorkorderRequest({ ...workorderRequest, id: work_id.work_order_request_id });
        productionDailyRequestList[indexDate].id = work_id.work_order_daily_request_id;
      }
    } catch {}
  };
  const handleGetlink = async () => {
    handleOpenSnackbar('info', 'Vui lòng chờ trong giây lát. Báo cáo đang được tải xuống');
    const link = await getLink(productionDailyRequestList[indexDate].id);
    if (link !== '') {
      downloadFile(link);
      handleOpenSnackbar('success', 'Tải xuống báo cáo thành công');
    } else {
      handleOpenSnackbar('error', 'Tải xuống báo cáo thất bại');
    }
    ///
  };
  const handleUpdateWorkOrder = async (product, index) => {
    try {
      if (productionDailyRequestList.length < 2) {
        handleOpenSnackbar('error', 'Số ngày kế hoạch không thể nhỏ hơn 2 !');
      } else {
        let work_id = {};
        if (!selectedDocument) {
          work_id = await createWorkorOrder({
            workshop_id: '4bcc7f81-785d-11ed-b861-005056a3c175',
            to_date: workorderRequest.to_date,
            index_request: indexDate,
            from_date: workorderRequest.from_date,
            title: workorderRequest.title,
            order_code: workorderRequest.order_code,
            status_code: workorderRequest.status_code,
            daily_request_list: [...productionDailyRequestList],
          });
          let data = await getDetail(work_id.work_order_request_id);
          dispatch({ type: DOCUMENT_CHANGE, selectedDocument: data, documentType: 'workorder' });
        } else {
          work_id = await updateWorkorOrder({
            workshop_id: '4bcc7f81-785d-11ed-b861-005056a3c175',
            index_request: indexDate,
            id: selectedDocument.id,
            to_date: workorderRequest.to_date,
            from_date: workorderRequest.from_date,
            title: workorderRequest.title,
            order_code: workorderRequest.order_code,
            status_code: workorderRequest.status_code,
            daily_request_list: [...productionDailyRequestList],
          });
        }
        setWorkorderRequest({ ...workorderRequest, id: work_id.work_order_request_id });
        productionDailyRequestList[indexDate].id = work_id.work_order_daily_request_id;
        productList[index].id = work_id.id_list[index];
        dataMaterial = await getMaterialDaily(work_id.id_list[index]);
        partList = await getPartList(work_id.id_list[index]);
        dispatch({
          type: MATERIAL_CHANGE,
          order: null,
          orderDetail: null,
          workorderDetail: {
            ...productList[index],
            part_list: [...partList],
            work_order_id: selectedDocument.id,
            order_date: productionDailyRequestList[indexDate].work_order_date,
            daily_work_order_id: productionDailyRequestList[indexDate].id,
            supplierList: [...dataMaterial],
          },
        });
        popupWindow(`/dashboard/workorder/material`, `Vật tư`, 400);

        // let dataPartListWorkorder = await checkMaterial({ work_order_id: work_id.work_order_request_id, daily_work_order_id: work_id.work_order_daily_request_id});
        // dataPartListWorkorder.forEach((dataPartList,index)=>{
        //   dataPartList.Daily_Detail_List.forEach((element) => {
        //     productionDailyRequestList[index].product_list.find((x) => (x.product_code === element.Product_Code)).is_enough = element.Is_Enough;
        //     productionDailyRequestList[index].product_list.find((x) => (x.product_code === element.Product_Code)).part_list = [...element.Part_List];
        //   });

        // })
      }
    } catch {}
  };
  const handleChangeStatus = (e) => {
    const value = e.target.value;
    setWorkorderRequest({
      ...workorderRequest,
      status_code: value,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    let from_date = workorderRequest.from_date;
    let to_date = workorderRequest.to_date;
    setWorkorderRequest({
      ...workorderRequest,
      [e.target.name]: value,
    });
    updateDataDailyRequest(productList);
    if (e.target.name === 'to_date') {
      if (workorderRequest.from_date < value) {
        handleSetDate(workorderRequest.from_date, e.target.value);
      } else {
        setWorkorderRequest({
          ...workorderRequest,
          to_date: to_date,
          from_date: from_date,
        });
      }
    } else if (e.target.name === 'from_date') {
      if (value < workorderRequest.to_date) {
        handleSetDate(e.target.value, workorderRequest.to_date);
      } else {
        setWorkorderRequest({
          ...workorderRequest,
          to_date: to_date,
          from_date: from_date,
        });
      }
    }
  };
  const handleChangeHours = (e) => {
    const value = e.target.value;
    if (e.target.name == 'number_of_worker') {
      productionDailyRequestList[indexDate].number_of_worker = value;
    } else {
      productionDailyRequestList[indexDate].number_of_working_hour = value;
    }
    setProductionDailyRequest([...productionDailyRequestList]);
  };
  const handleChangeNumber = (e, index) => {
    const value = e.target.value;
    try {
      let orderDetail = order?.orderDetail;
      orderDetail.find((x) => x.id === productList[index].id).quantity_produced +=
        value - productList[index].quantity_in_box;
      dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: orderDetail });
    } catch {}

    productList[index].quantity_in_box = value;
    setProductList([...productList]);
    updateDataDailyRequest(productList);
  };

  const calculatePercent = (number_of_worker, number_of_working_hour, piece, sl, productivity_per_worker) => {
    return parseFloat(
      (((sl * piece) / (number_of_worker * (number_of_working_hour / 8) * productivity_per_worker)) * 100).toFixed(2)
    );
  };
  const [dateListNull, setDateListNull] = useState([]);
  const handleNextWeek = () => {
    if ((currentWeek + 1) * 7 < productionDailyRequestList.length) {
      setCurrentWeek(currentWeek + 1);
      setDateListNull([]);
      if (productionDailyRequestList.length < end + 7) {
        let datenull = [];
        for (var d = 0; d < end + 7 - productionDailyRequestList.length; d++) {
          datenull = [...datenull, { check: true }];
        }
        setDateListNull(datenull);
      }
      setStart(start + 7);
      setEnd(end + 7);
    }
  };
  const handlePreWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
      setDateListNull([]);
      setStart(start - 7);
      setEnd(end - 7);
    }
  };

  const handleChangeDate = (date, index) => {
    updateDataDailyRequest(productList);
    setCurrentDate(date);
    setIndexDate(index);
    setProductList(productionDailyRequestList[index].product_list);
    // handleCheckMaterial();
  };

  const updateDataDailyRequest = (product_List) => {
    productionDailyRequestList[indexDate].product_list = [...product_List];
    productionDailyRequestList[indexDate].percent = calculateTotalPercent();
    setProductionDailyRequest(productionDailyRequestList);
  };
  const setDocumentToDefault = async () => {
    setIndexDate(0);
    setCurrentWeek(0);
    setWorkorderRequest({ title: '', status: '', order_id: '', to_date: '', from_date: '' });
    setProductList([]);
    setProductionDailyRequest([]);
    setTabIndex(0);
  };

  const popupWindow = (url, title) => {
    var width = window.outerWidth ? window.outerWidth : document.documentElement.clientWidth;
    var height = window.outerHeight ? window.outerHeight : document.documentElement.clientHeight;
    var w = width * 0.9;
    var h = height * 0.7;
    var left = width / 2 - w / 2;
    var top = height / 2 - h / 2;
    var newWindow = window.open(
      url,
      title,
      'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left
    );
    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  };

  const calculateTotalPercent = () => {
    let total = 0;
    productList.forEach((element) => {
      total += calculatePercent(
        productionDailyRequestList[indexDate].number_of_worker,
        productionDailyRequestList[indexDate].number_of_working_hour,
        element.no_piece_per_box,
        element.quantity_in_box,
        element.productivity_per_worker
      );
    });
    return total;
  };
  const calculateTotalPercentList = (product_List, number_of_worker, number_of_working_hour) => {
    let total = 0;
    product_List.forEach((element) => {
      total += calculatePercent(
        number_of_worker,
        number_of_working_hour,
        element.no_piece_per_box,
        element.quantity_in_box,
        element.productivity_per_worker
      );
    });
    return total;
  };
  const fetchStatus = async () => {
    let data = await getStatusList();
    setProductionStatus(data);
  };

  const handleSetProduct = async () => {
    let to_date = '';
    let from_date = '';
    let title = '';
    let status_code = '';
    let order_code = '';
    if (!selectedDocument) {
      let date = new Date();
      if (date.getDate() < 10) {
        from_date = date.getFullYear() + '-' + month[date.getMonth()] + '-0' + date.getDate();
      } else {
        from_date = date.getFullYear() + '-' + month[date.getMonth()] + '-' + date.getDate();
      }
      date.setDate(date.getDate() + 7);
      if (date.getDate() < 10) {
        to_date = date.getFullYear() + '-' + month[date.getMonth()] + '-0' + date.getDate();
      } else {
        to_date = date.getFullYear() + '-' + month[date.getMonth()] + '-' + date.getDate();
      }
      status_code = productionStatus[0].id;
    } else {
      to_date = selectedDocument.to_date;
      from_date = selectedDocument.from_date;
      title = selectedDocument.order_title;
      status_code = selectedDocument.status;
      order_code = selectedDocument.order_code;
    }
    setWorkorderRequest({
      ...workorderRequest,
      to_date: to_date,
      from_date: from_date,
      title: title,
      status_code: status_code,
      order_code: order_code,
    });
    var date = [];
    if (to_date !== '' && from_date !== '') {
      let index = 0;
      for (var d = new Date(from_date); d <= new Date(to_date); d.setDate(d.getDate() + 1)) {
        const day = d.getFullYear() + '-' + month[d.getMonth()] + '-' + d.getDate();
        if (!selectedDocument) {
          date = [
            ...date,
            {
              id: '',
              work_order_date: day,
              product_list: [
                {
                  unit_name: 'Thùng',
                  unit_id: '',
                  quantity_produced: 0,
                  quantity_in_box: 0,
                  product_customer_code: '',
                  product_name: '',
                  product_code: '',
                  id: '',
                  status: null,
                  order_id: '',
                  product_id: '',
                  part_list: [],
                  is_enough: false,
                },
              ],
              number_of_working_hours: 1,
              number_of_worker: 1,
            },
          ];
        } else {
          date = [
            ...date,
            {
              number_of_worker: selectedDocument.production_daily_request[index].number_of_worker,
              number_of_working_hour: selectedDocument.production_daily_request[index].number_of_working_hour,
              work_order_date: day,
              product_list: [...selectedDocument.production_daily_request[index].product_list],
              id: selectedDocument.production_daily_request[index].id,
              order_id: selectedDocument.production_daily_request[index].order_id,
              no_piece_per_box: selectedDocument.production_daily_request[index].no_piece_per_box,
              productivity_per_worker: selectedDocument.production_daily_request[index].productivity_per_worker,
              part_list: [],
              is_enough: false,
            },
          ];
          index++;
        }
      }
      if (indexDate === 0) {
        setProductList([...date[0].product_list]);
        setProductionDailyRequest(date);

        if (date.length > 7) {
          setEnd(7);
          setStart(0);
          setCurrentDate(date[0].work_order_date);
        } else if (date.length > 0) {
          setEnd(date.length);
          setStart(0);
          setCurrentDate(date[0].work_order_date);
        }
        setIndexDate(0);
        setCurrentWeek(0);
        setDateListNull([]);
        if (date.length < 7) {
          let datenull = [];
          for (var d = 0; d < 7 - date.length; d++) {
            datenull = [...datenull, { check: true }];
          }
          setDateListNull(datenull);
        }
      } else {
        setProductList([...date[indexDate].product_list]);
        setProductionDailyRequest(date);
      }
    }
  };

  const handleSetDate = (from_date, to_date) => {
    let date = [];
    if (to_date !== '' && from_date !== '') {
      for (var d = new Date(from_date); d <= new Date(to_date); d.setDate(d.getDate() + 1)) {
        const day = d.getFullYear() + '-' + month[d.getMonth()] + '-' + d.getDate();
        let data = productionDailyRequestList.find((x) => x.work_order_date === day);
        if (!data) {
          date = [
            ...date,
            {
              work_order_date: day,
              product_list: [
                {
                  unit_name: 'Thùng',
                  unit_id: '',
                  quantity_produced: 0,
                  quantity_in_box: 0,
                  product_customer_code: '',
                  product_name: '',
                  product_code: '',
                  id: '',
                  status: null,
                  order_id: '',
                  product_id: '',
                  part_list: [],
                  is_enough: false,
                },
              ],
              number_of_working_hours: 1,
              number_of_worker: 1,
              id: '',
              order_id: '',
            },
          ];
        } else {
          date = [
            ...date,
            {
              number_of_worker: data.number_of_worker,
              number_of_working_hour: data.number_of_working_hour,
              work_order_date: day,
              product_list: [...data.product_list],
              id: data.id,
              order_id: data.order_id,
              no_piece_per_box: data.no_piece_per_box,
              productivity_per_worker: data.productivity_per_worker,
              part_list: [],
              is_enough: false,
            },
          ];
        }
      }

      if (date.length > 7) {
        setProductList([...date[0].product_list]);
        setProductionDailyRequest([...date]);
        setEnd(7);
        setStart(0);
        setCurrentDate(date[0].work_order_date);
      } else if (date.length > 0) {
        setProductList([...date[0].product_list]);
        setProductionDailyRequest([...date]);
        setEnd(date.length);
        setStart(0);
        setCurrentDate(date[0].work_order_date);
      }
      setIndexDate(0);
      setCurrentWeek(0);
      setDateListNull([]);
      if (date.length < 7) {
        let datenull = [];
        for (var d = 0; d < 7 - date.length; d++) {
          datenull = [...datenull, { check: true }];
        }
        setDateListNull(datenull);
      }
    }
  };
  const handleRenderTableRow = (item, index) => {
    return (
      <>
        {' '}
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover>
          <TableCell align="left">{index + 1}</TableCell>
          <TableCell align="left" style={{ maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Tooltip title={item.customer_order_code}>
              <span> {item.customer_order_code}</span>
            </Tooltip>
          </TableCell>
          <TableCell align="left" style={{ minWidth: 150, maxWidth: 150 }}>
            <Autocomplete
              value={item}
              size="small"
              disableClearable
              options={dropdownData}
              fullWidth
              onChange={(e, u) => handleChangeRow(u, index)}
              getOptionLabel={(option) => option.product_code}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </TableCell>

          <TableCell align="left">{item.product_customer_code}</TableCell>

          <TableCell align="left" style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Tooltip title={item.product_name}>
              <span> {item.product_name}</span>
            </Tooltip>
          </TableCell>
          <TableCell align="left">
            <TextField
              fullWidth
              type="number"
              style={{ minWidth: 80, maxWidth: 80 }}
              variant="outlined"
              InputProps={{ inputProps: { min: 1, max: item.maxValue } }}
              value={item.quantity_in_box}
              size="small"
              onChange={(e) => handleChangeNumber(e, index)}
            />
          </TableCell>
          <TableCell align="left">{item.unit_name}</TableCell>
          <TableCell align="center">
            <span>
              {' '}
              {calculatePercent(
                productionDailyRequestList[indexDate].number_of_worker,
                productionDailyRequestList[indexDate].number_of_working_hour,
                item.no_piece_per_box,
                item.quantity_in_box,
                item.productivity_per_worker
              )?.toLocaleString() + '%'}
            </span>
          </TableCell>
          <TableCell align="center"> {calculateQuantity(item, index)}</TableCell>
          <TableCell align="right">
            <IconButton onClick={() => handleDeleteRow(index)}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      </>
    );
  };
  useEffect(() => {
    setDopDownData(orderRedux.orderDetail || []);
  }, [orderRedux.orderDetail]);

  useEffect(() => {
    fetchStatus();
  }, []);
  useEffect(() => {
    console.log('check', orderRedux.workorderDetail);
    if (orderRedux?.workorderDetail?.data === 1) {
      const fetch = async () => {
        let data = await getDetail(selectedDocument.id);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: data, documentType: 'workorder' });
      };
      fetch();
    }
  }, [orderRedux.workorderDetail]);

  useEffect(() => {
    handleSetProduct();
  }, [selectedDocument]);

  return (
    <React.Fragment>
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
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center">
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Mã hoạch sản xuất: </span>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    size="small"
                                    name="order_code"
                                    value={workorderRequest.order_code}
                                    onChange={handleChange}
                                  />
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}></Grid>
                                <Grid item lg={8} md={8} xs={8}>
                                  <span className={classes.tabItemLabelField}>Tên kế hoạch sản xuất: </span>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    size="small"
                                    name="title"
                                    value={workorderRequest.title}
                                    onChange={handleChange}
                                  />
                                </Grid>
                              </Grid>

                              <Grid container className={classes.gridItemInfo}>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Trạng thái: </span>
                                  <TextField
                                    select
                                    fullWidth
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    value={workorderRequest.status_code}
                                    onChange={(event) => handleChangeStatus(event)}
                                  >
                                    {productionStatus &&
                                      productionStatus.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                          {item.value}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </Grid>
                                <Grid item lg={1} md={1} xs={1}>
                                  {' '}
                                </Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Thời gian lập kế hoạch:</span>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    name="from_date"
                                    value={workorderRequest.from_date}
                                    size="small"
                                    onChange={handleChange}
                                  />
                                </Grid>

                                <Grid item lg={2} md={2} xs={2}>
                                  {' '}
                                </Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Thời gian kết thúc:</span>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    name="to_date"
                                    value={workorderRequest.to_date}
                                    size="small"
                                    onChange={handleChange}
                                  />
                                </Grid>

                                {/* <Grid item lg={3} md={3} xs={3}>
                                   <span className={classes.tabItemLabelField}>Xưởng:</span>
                                  <TextField
                                    fullWidth
                                    disabled
                                    variant="outlined"
                                    name="to_date"
                                    value={'Xưởng Minh Khai'}
                                    className={classes.inputField}
                                    onChange={handleChange}
                                  /> 
                                </Grid> */}
                              </Grid>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} style={{ background: 'rgba(224, 224, 224, 1)' }}>
                              <Grid
                                container
                                className={classes.gridItemInfo}
                                alignItems="center"
                                style={{ marginTop: '20px' }}
                              >
                                <Grid item lg={3} md={3} xs={3} alignItems="center">
                                  <IconButton onClick={handlePreWeek}>
                                    <SkipPrevious />
                                  </IconButton>
                                  <span>
                                    {'Tuần ' +
                                      (currentWeek + 1) +
                                      '/' +
                                      Math.ceil(productionDailyRequestList.length / 7)}
                                  </span>
                                  <IconButton onClick={handleNextWeek}>
                                    <SkipNext />
                                  </IconButton>
                                </Grid>
                                <Grid item lg={9} md={9} xs={9}>
                                  <TableContainer component={Paper}>
                                    <Table size="small" classes={{ root: classes.customTable }}>
                                      <TableHead>
                                        <TableRow>
                                          {productionDailyRequestList?.slice(start, end).map((item, index) => (
                                            <TableCell
                                              align="center"
                                              style={
                                                currentDate === item.work_order_date
                                                  ? { background: 'rgb(97, 42, 255)', color: 'white' }
                                                  : {}
                                              }
                                              onClick={() =>
                                                handleChangeDate(item.work_order_date, index + currentWeek * 7)
                                              }
                                            >
                                              <span>
                                                {weekday[new Date(item.work_order_date).getDay()]}
                                                <br />
                                                {new Date(item.work_order_date).getDate() +
                                                  '/' +
                                                  month[new Date(item.work_order_date).getMonth()]}
                                              </span>
                                            </TableCell>
                                          ))}
                                          {dateListNull.map((item) => (
                                            <TableCell align="center">{''}</TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                          {productionDailyRequestList?.slice(start, end).map((item) => (
                                            <TableCell component="th" scope="row" align="center">
                                              <Typography
                                                style={
                                                  (!item.percent
                                                    ? calculateTotalPercentList(
                                                        item.product_list,
                                                        item.number_of_worker,
                                                        item.number_of_working_hour
                                                      )
                                                    : item.percent) >= 100
                                                    ? { backgroundColor: 'rgb(48, 188, 65)' }
                                                    : { backgroundColor: 'yellow' }
                                                }
                                              >
                                                {(!item.percent
                                                  ? calculateTotalPercentList(
                                                      item.product_list,
                                                      item.number_of_worker,
                                                      item.number_of_working_hour
                                                    )
                                                  : item.percent) + '%'}
                                              </Typography>
                                            </TableCell>
                                          ))}
                                          {dateListNull.map((item) => (
                                            <TableCell align="center">{''}</TableCell>
                                          ))}
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid
                              container
                              className={classes.gridItemInfo}
                              alignItems="center"
                              justifyContent="flex-end"
                              style={{ marginTop: '20px' }}
                            >
                              <Grid item lg={1} md={1} xs={1}>
                                <span className={classes.tabItemLabelField} style={{ marginLeft: '-70px' }}>
                                  Chi tiết sản xuất:
                                </span>
                              </Grid>
                              <Grid item lg={1} md={1} xs={1}></Grid>
                              <Grid item lg={1} md={1} xs={1}></Grid>
                              <Grid item lg={1} md={1} xs={1}></Grid>
                              <Grid item lg={7} md={7} xs={7}>
                                <Grid container alignItems="center">
                                  <Grid item lg={12} md={12} xs={12}>
                                    <Grid container alignItems="center">
                                      <Grid item lg={1.5} md={1.5} xs={1.5}>
                                        <span className={classes.tabItemLabelField}>{'Số người làm: '}</span>
                                      </Grid>
                                      <Grid item lg={1} md={1} xs={1}>
                                        <TextField
                                          style={{ marginLeft: '10px' }}
                                          type="number"
                                          variant="outlined"
                                          name="number_of_worker"
                                          InputProps={{ inputProps: { min: 1 } }}
                                          value={productionDailyRequestList[indexDate]?.number_of_worker}
                                          size="small"
                                          onChange={handleChangeHours}
                                        />
                                      </Grid>
                                      <Grid item lg={0.5} md={0.5} xs={0.5}>
                                        {' '}
                                      </Grid>
                                      <Grid item lg={1.5} md={1.5} xs={1.5} style={{ marginLeft: '30px' }}>
                                        <span className={classes.tabItemLabelField}>{'Số giờ làm: '}</span>
                                      </Grid>
                                      <Grid item lg={1} md={1} xs={1}>
                                        <TextField
                                          type="number"
                                          variant="outlined"
                                          name="number_of_working_hour"
                                          InputProps={{ inputProps: { min: 1 } }}
                                          value={productionDailyRequestList[indexDate]?.number_of_working_hour}
                                          size="small"
                                          style={{ marginLeft: '10px' }}
                                          onChange={handleChangeHours}
                                        />
                                      </Grid>
                                      <Grid item lg={1.5} md={1.5} xs={1.5} style={{ marginLeft: '30px' }}>
                                        <span className={classes.tabItemLabelField}>{'Công suất hiện tại: '}</span>
                                      </Grid>
                                      <Grid item lg={2} md={2} xs={2}>
                                        <TextField
                                          type="text"
                                          variant="outlined"
                                          disabled
                                          style={{ marginLeft: '10px' }}
                                          value={calculateTotalPercent() + '%'}
                                          size="small"
                                          onChange={handleChange}
                                        />
                                      </Grid>
                                      <Grid item lg={1.5} md={1.5} xs={1.5} style={{ marginLeft: '30px' }}>
                                        <span className={classes.tabItemLabelField}>{'Công suất tổng: '}</span>
                                      </Grid>
                                      <Grid item lg={1} md={1} xs={1}>
                                        <TextField
                                          type="text"
                                          variant="outlined"
                                          disabled
                                          style={{ marginLeft: '10px' }}
                                          value={100}
                                          size="small"
                                          onChange={handleChange}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <IconButton onClick={handleAddRow}>
                                  <AddCircleOutline />
                                </IconButton>
                              </Grid>
                            </Grid>
                            <Grid container className={classes.gridItem} alignItems="center">
                              <Grid item lg={12} md={12} xs={12}>
                                <TableContainer style={{ maxHeight: 400 }}>
                                  {/* <TableScrollbar height="350px"> */}
                                  <Table size="small" stickyHeader aria-label="sticky table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell align="left">Mã ĐH</TableCell>
                                        <TableCell align="left">Mã TP của TQT</TableCell>
                                        <TableCell align="left">Mã TP của KH</TableCell>
                                        <TableCell align="left">Tên TP</TableCell>
                                        <TableCell align="left">SL</TableCell>
                                        <TableCell align="left">Đơn vị</TableCell>
                                        <TableCell align="left">% công suất</TableCell>
                                        <TableCell align="left">Vật tư</TableCell>
                                        <TableCell align="left">
                                          {/* <Button variant="contained"
                                          style={{ background: 'rgb(97, 42, 255)' }}
                                          onClick={() => handleCheckMaterial()

                                          }>Kiểm tra</Button> */}
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {productList?.map((item, index) => handleRenderTableRow(item, index))}
                                      <div ref={virtuoso} />
                                    </TableBody>
                                  </Table>
                                  {/* </TableScrollbar> */}
                                </TableContainer>
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
                      onClick={() => popupWindow(`/dashboard/workorder/order-list`, `Mục tiêu sản xuất`)}
                    >
                      Mục tiêu sản xuất
                    </Button>
                    {/* </Link> */}
                  </Grid>
                  {!selectedDocument && (
                    <Grid item>
                      <Button
                        variant="contained"
                        style={{ background: 'rgb(97, 42, 255)' }}
                        onClick={() => handleCreateWorkOrder()}
                      >
                        {'Tạo mới'}
                      </Button>
                    </Grid>
                  )}
                  {!!selectedDocument && (
                    <>
                      <Grid item>
                        <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleGetlink}>
                          In lệnh sản xuất
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          style={{ background: 'rgb(97, 42, 255)' }}
                          onClick={() => handleCreateWorkOrder()}
                        >
                          Lưu
                        </Button>
                      </Grid>
                    </>
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
