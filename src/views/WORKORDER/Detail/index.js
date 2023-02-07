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
  Snackbar,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
  Paper,
  IconButton,
} from '@material-ui/core';
import Alert from '../../../component/Alert/index.js';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import useStyles from './classes.js';
import { FLOATING_MENU_CHANGE, ORDER_DETAIL_CHANGE, DOCUMENT_CHANGE, MATERIAL_CHANGE, ORDER_CHANGE } from '../../../store/actions.js';
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
  getWorkOrderRequest,
  deleteWorkOrderDetail,
  deleteWorkOrderRequest,
  createWorkOrderDetailList,
  createWorkOrderRequest,
  getWorkShopList,
  getMaterialWHSList,
  getProductWHSList
} from '../../../services/api/Workorder/index.js';
import DatePicker from '../../../component/DatePicker/index.js';
import { delay, set } from 'lodash';
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



const WorkorderModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [disableComponent, setDisable] = useState(false);
  const { selectedDocument } = useSelector((state) => state.document);
  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { order } = useSelector((state) => state.order);
  const { order: orderRedux } = useSelector((state) => state.order);
  const [checkChangeData, setCheckChangeData] = useState({
    changeWorkOrder: false,
    changeWorkOrderRequest: false,
    changeWorkOrderDaily: false,
  })
  const [dayCurrent, setDateCurrent] = useState('');
  const [productionDailyRequestList, setProductionDailyRequest] = useState([]);
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [indexDate, setIndexDate] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [currentWeek, setCurrentWeek] = useState(0);
  let dataMaterial = [];
  let partList = [];
  const { workorderDetail: orderReduxWork } = useSelector((state) => state.order);
  const [productList, setProductList] = useState([]);
  const [workorderRequest, setWorkorderRequest] = useState({
    id: '',
    work_order_date: '',
    number_of_worker: 20,
    number_of_working_hour: 8,
  });
  const [workorder, setWorkorder] = useState({
    status_code: '',
    id: '',
    title: '',
    to_date: '',
    from_date: '',
    workshop_id: '4bcc7f81-785d-11ed-b861-005056a3c175',
    materialwh_id: '207b6a56-73e1-11ed-b860-005056a3c175',
    productwh_id: 'a45934f4-73bb-11ed-b860-005056a3c175',
  });

  const [productionStatus, setProductionStatus] = useState([
    {
      id: '',
      value: '',
    },
  ]);
  const [workshopList, setWorkShopList] = useState([
    
  ]);
  const [productWHSList, setProductWHSList] = useState([
    
  ]);
  const [materialWHSList, setMaterialWHSList] = useState([
   
  ]);

  const virtuoso = useRef(null);
  const [dropdownData, setDopDownData] = useState([]);
  const handleViewDetailMaterial = (product, index) => {
    handleUpdateWorkOrder(product, index)
  };
  const calculateQuantity = (product, index) => {
    const color = product.color_check;

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
      setCheckChangeData({ ...checkChangeData, changeWorkOrderDaily: true })
      const newProductList = [...productList];
      const newProduct = {
        unit_name: row?.unit_name || 'Thùng',
        unit_id: row?.unit_id,
        quantity_produced: row?.quantity_produced,
        quantity_in_box: 0,
        maxValue: row?.quantity_in_box,
        product_customer_code: row?.product_customer_code,
        product_name: row?.product_name,
        product_code: row?.product_code,
        id: newProductList[index].id,
        order_id: row?.order_id,
        customer_order_code: order?.order_code,
        product_id: row?.product_id,
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
        } catch { }
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
    } catch { }
  };
  const handleDeleteRow = (index, id) => {
    try {

      if (productList[index].id != '') {
        let orderDetail = order?.orderDetail;
        orderDetail.find((x) => x.product_id === productList[index].product_id).quantity_in_workorder -=productList[index].quantity_in_box;
        dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: orderDetail });
        deleteWorkOrderDetail(id);
        
      }
    } catch { }

    productList.splice(index, 1);
    setProductList([...productList]);
    updateDataDailyRequest(productList);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: ORDER_CHANGE, order: null, orderDetail: null });
    dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: null});
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'workorder' });
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false, documentType: 'workorder' });
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
  const handleCreateWorkOrder = async (popup, getdate, button) => {
    try {
      if (productionDailyRequestList.length < 2) {
        handleOpenSnackbar(true, 'fail', 'Số ngày kế hoạch không ther < 2 !');
      } else {
        let WorkOrderID = workorder.id;
        if ((workorder.id === '')) {
          WorkOrderID = await createWorkorOrder({
            workshop_id: workorder.workshop_id,
            id: '',
            to_date: workorder.to_date,
            from_date: workorder.from_date,
            title: workorder.title,
            order_code: workorder.order_code,
            status_code: workorder.status_code,
            productwh_id: workorder.productwh_id,
            materialwh_id: workorder.materialwh_id,
          });
          setWorkorder({ ...workorder, id: WorkOrderID })

        }
        else if (checkChangeData.changeWorkOrder) {

          updateWorkorOrder({
            workshop_id: workorder.workshop_id,
            id: WorkOrderID,
            to_date: workorder.to_date,
            from_date: workorder.from_date,
            title: workorder.title,
            order_code: workorder.order_code,
            status_code: workorder.status_code,
            productwh_id: workorder.productwh_id,
            materialwh_id: workorder.materialwh_id,
          });

        }
        if (popup || button) {
          if ((workorder.id === '')) {
            handleOpenSnackbar(true, 'success', 'Tạo mới thành công!');
          }
          else {
            handleOpenSnackbar(true, 'success', 'Cập nhật thành công!');
          }

        }

        let IdWorkorderRequest = workorderRequest.id;
     
          if (checkChangeData.changeWorkOrderRequest || workorder.id === '' || (IdWorkorderRequest === '' && productList.length > 0)) {
            IdWorkorderRequest = await createWorkOrderRequest({
              number_of_worker: workorderRequest?.number_of_worker||20,
              number_of_working_hour: workorderRequest?.number_of_working_hour||8,
              status: workorder.status_code,
              work_order_id: WorkOrderID,
              order_code: workorder.order_code,
              order_title: workorder.title,
              work_order_date: currentDate,
              id: workorderRequest.id,
            })
            productionDailyRequestList[indexDate].id = IdWorkorderRequest
          }
          if (checkChangeData.changeWorkOrderDaily) {
            let productListFilter = productList.filter(x => x.product_id != '')
            if (productListFilter.length > 0)
              await createWorkOrderDetailList({
                product_list: productListFilter,
                status_code: workorder.status_code,
                work_order_id: WorkOrderID,
                daily_work_order_id: IdWorkorderRequest,
              });
          }
        
       


        setCheckChangeData({ changeWorkOrder: false, changeWorkOrderDaily: false, changeWorkOrderRequest: false })

        if (getdate)
          return handleGetWorkOrderRequest(IdWorkorderRequest,-1)

      }


    } catch { }
  };
  const handleGetlink = async () => {
    setSnackbarStatus({
      isOpen: true,
      type: 'info',
      text: 'Vui lòng chờ trong giây lát. Báo cáo đang được tải xuống',
    });
    const link = await getLink(productionDailyRequestList[indexDate].id);
    if (link !== '') {
      downloadFile(link);
      setSnackbarStatus({
        isOpen: true,
        type: 'success',
        text: 'Tải xuống báo cáo thành công',
      });
    } else {
      setSnackbarStatus({
        isOpen: true,
        type: 'error',
        text: 'Tải xuống báo cáo thất bại',
      });
    }
    ///
  };
  const handleUpdateWorkOrder = async (product, index) => {
    try {
      if (workorder.id==='')  {
        dispatch({ type: ORDER_CHANGE, order: null, orderDetail: null });
       dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: null});
      }
      let product_list = await handleCreateWorkOrder(false, true);
      dataMaterial = await getMaterialDaily(product_list[index].id);
      dispatch({
        type: MATERIAL_CHANGE,
        workorderDetail: {
          ...product_list[index],
          part_list: [...product_list[index].part_list],
          work_order_id: workorder.id,
          order_date: productionDailyRequestList[indexDate].work_order_date,
          daily_work_order_id: productionDailyRequestList[indexDate].id,
          supplierList: [...dataMaterial],
        },
      });
      popupWindowFull(`/dashboard/workorder/material`, `Vật tư`, 400);

    } catch { }
  };
  const handleChangeStatus = (e) => {
    setCheckChangeData({...checkChangeData, changeWorkOrder: true})
    const value = e.target.value;
    setWorkorder({
      ...workorder,
      status_code: value,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    let from_date = workorder.from_date;
    let to_date = workorder.to_date;
    if (e.target.name === 'to_date') {
      if (workorder.from_date < value) {
        setCheckChangeData({ ...checkChangeData, changeWorkOrder: true })
        setWorkorder({
          ...workorder,
          to_date: value,
          from_date: from_date,
        });
      }
    } else if (e.target.name === 'from_date') {
      if (value < workorder.to_date) {
        setCheckChangeData({ ...checkChangeData, changeWorkOrder: true })
        setWorkorder({
          ...workorder,
          to_date: to_date,
          from_date: value,
        });
      }
    } else {
      setCheckChangeData({ ...checkChangeData, changeWorkOrder: true })
      setWorkorder(pre => ({
        ...pre,
        [e.target.name]: value,
      }));
    }
    updateDataDailyRequest(productList);

  };
  const handleChangeHours = (e) => {

    const value = e.target.value;
    setCheckChangeData({ ...checkChangeData, changeWorkOrderRequest: true })
    if (e.target.name == 'number_of_worker') {
      workorderRequest.number_of_worker = value;
    } else {
      workorderRequest.number_of_working_hour = value;
    }

  };
  const handleChangeNumber = (e, index) => {
    const value = e.target.value;
    let orderDetail = order?.orderDetail;
    let product =orderDetail.find((x) => x.product_id === productList[index].product_id)
    if ((parseInt(product.quantity_in_workorder) + parseInt(value) - parseInt(productList[index].quantity_in_box) )<= parseInt(product.quantity_in_box)){
      setCheckChangeData({ ...checkChangeData, changeWorkOrderDaily: true })
      try {
        orderDetail.find((x) => x.product_id === productList[index].product_id).quantity_in_workorder += value - productList[index].quantity_in_box;
        dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: orderDetail });
      } catch { }

      productList[index].quantity_in_box = value;
      setProductList([...productList]);
      updateDataDailyRequest(productList);
    } else {
      setSnackbarStatus({isOpen: true,
        type: 'error',
        text: 'Số lượng đạt yêu cầu!',})
 
    }
    
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

  const handleGetWorkOrderRequest = async (id,index) => {
    let productListApi = id;
    if (id === '') {
      setProductList([]);
      setWorkorderRequest({
        ...workorderRequest,
        id: ''
      });
      setCheckChangeData({ ...checkChangeData, changeWorkOrderRequest: true })
      setDisable(false);
    } else {
      productListApi = await getWorkOrderRequest(id);
      if (index>=0){
        productionDailyRequestList[index].color_check=productListApi.work_order_request.color_check
        productionDailyRequestList[index].is_enough=productListApi.work_order_request.is_enough
      } else {
        productionDailyRequestList[indexDate].color_check=productListApi.work_order_request.color_check
        productionDailyRequestList[indexDate].is_enough=productListApi.work_order_request.is_enough
      }
      setDisable(productListApi.work_order_request.is_disable)
      setProductList(productListApi.work_order_detail);
      setWorkorderRequest({ ...productListApi.work_order_request });
      if (productListApi.work_order_detail[0]?.customer_order_id != '')
        if (productListApi.work_order_detail.length > 0)
          dispatch({
            type: ORDER_CHANGE,
            order: { id: productListApi.work_order_detail[0]?.customer_order_id, change: true, work_order_id: workorder.id, workorderDetail: orderRedux.workorderDetail, }
          });


    }
    return productListApi.work_order_detail
  }

  const handleChangeDate = async (date, index) => {
    handleCreateWorkOrder(false, false)
    productionDailyRequestList[indexDate].percent = calculateTotalPercentList(productList, workorderRequest.number_of_worker, workorderRequest.number_of_working_hour)
    setCurrentDate(date);
    setIndexDate(index);
    handleGetWorkOrderRequest(productionDailyRequestList[index].id,index)
  };

  const updateDataDailyRequest = (product_List) => {
    productionDailyRequestList[indexDate].percent = calculateTotalPercent();
    setProductionDailyRequest(productionDailyRequestList);
  };
  const setDocumentToDefault = async () => {
    setIndexDate(0);
    setCurrentWeek(0);
    setCheckChangeData({changeWorkOrder:false, changeWorkOrderDaily: false, changeWorkOrderRequest: false})
    setWorkorder({ title: '', status: '', order_id: '', to_date: '', from_date: '', 
    workshop_id: '4bcc7f81-785d-11ed-b861-005056a3c175',
    materialwh_id: '207b6a56-73e1-11ed-b860-005056a3c175',
    productwh_id: 'a45934f4-73bb-11ed-b860-005056a3c175', });
    setWorkorderRequest({})
    setProductList([]);
    setProductionDailyRequest([]);
    setTabIndex(0);
  };

  const popupWindow = (url, title) => {
    if (workorder.id===''){
      dispatch({ type: ORDER_CHANGE, order: null, orderDetail: null });
      dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: null});
    }
    var width = window.outerWidth ? window.outerWidth : document.documentElement.clientWidth;
    var height = window.outerHeight ? window.outerHeight : document.documentElement.clientHeight;
    var w = width * 1;
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

  const popupWindowFull = (url, title) => {
    if (workorder.id===''){
      dispatch({ type: ORDER_CHANGE, order: null, orderDetail: null });
      dispatch({ type: ORDER_DETAIL_CHANGE, orderDetail: null});
    }
    var width = window.outerWidth ? window.outerWidth : document.documentElement.clientWidth;
    var height = window.outerHeight ? window.outerHeight : document.documentElement.clientHeight;
    var w = width * 1;
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
    try {
      productList.forEach((element) => {
        total += calculatePercent(
          workorderRequest.number_of_worker,
          workorderRequest.number_of_working_hour,
          element.no_piece_per_box,
          element.quantity_in_box,
          element.productivity_per_worker
        );
      });
    } catch { }

    return total.toFixed(2);
  };
  const calculateTotalPercentList = (product_List, number_of_worker, number_of_working_hour) => {
    let total = 0;
    if (!product_List) return 0
    product_List.forEach((element) => {
      total += calculatePercent(
        number_of_worker,
        number_of_working_hour,
        element.no_piece_per_box,
        element.quantity_in_box,
        element.productivity_per_worker
      );
    });
    return total.toFixed(2);
  };
  const fetchStatus = async () => {
    let data = await getStatusList();
    setProductionStatus(data);
     data = await getWorkShopList();
    setWorkShopList([...data])
    data = await getMaterialWHSList();
    setMaterialWHSList([...data])
    data = await getProductWHSList();
    setProductWHSList([...data])
  };
  function toJSONLocal(date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }
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
      status_code = productionStatus[0]?.id || '';
    } else {
      to_date = selectedDocument.to_date;
      from_date = selectedDocument.from_date;
      title = selectedDocument.order_title;
      status_code = selectedDocument.status;
      order_code = selectedDocument.order_code;
    }
    
   
    workorder.id =selectedDocument?.id || ''
    setWorkorder({
      ...workorder,
      to_date: to_date,
      from_date: from_date,
      title: title,
      status_code: status_code,
      order_code: order_code,
      id: selectedDocument?.id || ''
    });
    var date = [];
    if (to_date !== '' && from_date !== '') {
    
      for (var d = new Date(from_date); d <= new Date(to_date); d.setDate(d.getDate() + 1)) {
        const day = d.getFullYear() + '-' + month[d.getMonth()] + '-' + d.getDate();
        if (!selectedDocument) {
          date = [
            ...date,
            {
              id: '',
              work_order_date: day,
              percent: 0/1,
              is_enough: false,
              color_check: 'yellow'
            },
          ];
        } else {
          let percent = (0/1).toFixed(2);
          let index = selectedDocument.production_daily_request.findIndex(obj => toJSONLocal(new Date(obj.work_order_date)) === toJSONLocal(new Date(day)))
          try {
            percent = calculateTotalPercentList(
              selectedDocument.production_daily_request[index].product_list,
              selectedDocument.production_daily_request[index].number_of_worker,
              selectedDocument.production_daily_request[index].number_of_working_hour
            )
          } catch {

          }
          if (index > -1) {
            date = [
              ...date,
              {
                work_order_date: day,
                id: selectedDocument.production_daily_request[index]?.id || "",
                percent: percent,
                is_enough: selectedDocument.production_daily_request[index]?.is_enough,
                color_check: selectedDocument.production_daily_request[index]?.color_check
              },
            ];
          }
          else {
            date = [
              ...date,
              {
                work_order_date: day,
                id: "",
                percent: percent,
                is_enough: false,
                color_check: 'yellow'
              },
            ];
          }
        }

      }
      let daycurrent = new Date();
      setDateCurrent(daycurrent.getFullYear() + '-' + month[daycurrent.getMonth()] + '-' + daycurrent.getDate())
      let indexCurrentDate= date.findIndex((x) => x.work_order_date ===daycurrent.getFullYear() + '-' + month[daycurrent.getMonth()] + '-' + daycurrent.getDate())
      if (indexCurrentDate===-1) indexCurrentDate=0
      let week =0;
      if(Math.ceil(indexCurrentDate/7)-1>0) {
       week=Math.ceil(indexCurrentDate/7)-1
      }
      setProductionDailyRequest(date);
      setStart((week)*7);
      setCurrentDate(date[indexCurrentDate].work_order_date);
      if (date.length > 7) {
        setEnd((week)*7+7);
      } else if (date.length > 0) {
        setEnd(date.length);
      }
      setIndexDate(pre => indexCurrentDate);
     
      setCurrentWeek(week);
    
      
      setDateListNull([]);
      if (date.length < 7) {
        let datenull = [];
        for (var d = 0; d < 7 - date.length; d++) {
          datenull = [...datenull, { check: true }];
        }
        setDateListNull(datenull);
      }
      handleGetWorkOrderRequest(date[indexCurrentDate].id,-1)


    }
  };

  const handleSetDate = async (from_date, to_date) => {
    handleCreateWorkOrder(true, true)
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
              id: '',
              percent: 0/1,
              color_check:'yellow'
            },
          ];
        } else {
          date = [
            ...date,
            {
              work_order_date: day,
              id: data.id,
              percent: data.percent,
              color_check: data.color_check
            },
          ];
        }
      }

      let yFilter = date.map(itemY => { return itemY.work_order_date; });

      // Use filter and "not" includes to filter the full dataset by the filter dataset's val.
      let itemRemove = productionDailyRequestList.filter(itemX => !yFilter.includes(itemX.work_order_date));

      itemRemove.forEach((element) => {
        if (!!element.id) {
          deleteWorkOrderRequest(element.id)
        }

      })
      setStart(0);
      setCurrentDate(date[0].work_order_date);
      setProductionDailyRequest([...date]);
      setWorkorderRequest({ ...workorderRequest, work_order_date: date[0].work_order_date })
      if (date.length > 7) {
        setEnd(7);
      } else if (date.length > 0) {
        setEnd(date.length);
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
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover style={{minWidth: 10, maxWidth:10}}>
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
              disabled={disableComponent}
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
              disabled={disableComponent}
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
                workorderRequest.number_of_worker,
                workorderRequest.number_of_working_hour,
                item.no_piece_per_box,
                item.quantity_in_box,
                item.productivity_per_worker
              )?.toLocaleString() + '%'}
            </span>
          </TableCell>
          <TableCell align="center"> {calculateQuantity(item, index)}</TableCell>
          <TableCell align="right">
            <IconButton onClick={() => handleDeleteRow(index, item.id)}  disabled={disableComponent}>
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

    if (orderReduxWork?.workorderDetail?.data === 1) {
      handleGetWorkOrderRequest(productionDailyRequestList[indexDate].id,-1)
    }
  }, [orderReduxWork.workorderDetail]);

  useEffect(() => {
    handleSetProduct();
    if (!selectedDocument) return
    popupWindow(`/dashboard/workorder/order-list`, `Mục tiêu sản xuất`)
  }, [selectedDocument]);

  useEffect(() => {
    if (checkChangeData.changeWorkOrder)
      handleSetDate(workorder.from_date, workorder.to_date);
  }, [workorder.from_date, workorder.to_date]);
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
                          <Grid container spacing={1} rowSpacing={1}>
                            <Grid item lg={6} md={6} xs={12}>
                              <Grid container className={classes.gridItemInfo} alignItems="center" spacing={1} >
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Mã hoạch sản xuất: </span>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    size="small"
                                    name="order_code"
                                    value={workorder.order_code}
                                    onChange={handleChange}
                                  />
                                </Grid>
                               
                                <Grid item lg={6} md={6} xs={6}>
                                  <span className={classes.tabItemLabelField}>Tên kế hoạch sản xuất: </span>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    size="small"
                                    name="title"
                                    value={workorder.title}
                                    onChange={handleChange}
                                  />
                                </Grid>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Trạng thái: </span>
                                  <TextField
                                    select
                                    fullWidth
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    value={workorder.status_code}
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
                              </Grid>

                             <Grid container className={classes.gridItemInfo} alignItems="center" spacing={1}>
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Thời gian bắt đầu:</span>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    name="from_date"
                                    value={workorder.from_date}
                                    size="small"
                                    onChange={handleChange}
                                  />
                                  {/* <DatePicker
                                    // date={orderData.expected_deliver_date}
                                    // onChange={(date) => setOrderData({ ...orderData, expected_deliver_date: date })}
                                  /> */}
                                </Grid>

                              
                                <Grid item lg={3} md={3} xs={3}>
                                  <span className={classes.tabItemLabelField}>Thời gian kết thúc:</span>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    name="to_date"
                                    value={workorder.to_date}
                                    size="small"
                                    onChange={handleChange}
                                  />
                                  {/* <DatePicker
                                    // date={orderData.expected_deliver_date}
                                    // onChange={(date) => setOrderData({ ...orderData, expected_deliver_date: date })}
                                  /> */}
                                </Grid>
                                <Grid item lg={2} md={2} xs={2}>
                                  <span className={classes.tabItemLabelField}>Xưởng: </span>
                                  <TextField
                                    select
                                    fullWidth
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    value={workorder?.workshop_id}
                                    onChange={(event) => setWorkorder({...workorder, workshop_id: event.target.value})}
                                  >
                                    {workshopList &&
                                      workshopList.map((item) => (
                                        <MenuItem key={item.Key} value={item.Key}>
                                          {item.Value}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </Grid>
                              
                                <Grid item lg={2} md={2} xs={2}>
                                  <span className={classes.tabItemLabelField}>Kho vật tư:</span>
                                   <TextField
                                    select
                                    fullWidth
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    value={workorder?.materialwh_id}
                                    onChange={(event) => setWorkorder({...workorder, materialwh_id: event.target.value})}
                                  >
                                    {materialWHSList &&
                                      materialWHSList.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                          {item.value}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </Grid>

                      
                                <Grid item lg={2} md={2} xs={2}>
                                  <span className={classes.tabItemLabelField}>Kho thành phẩm:</span>
                                  <TextField
                                    select
                                    fullWidth
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    value={workorder?.productwh_id}
                                    onChange={(event) => setWorkorder({...workorder, productwh_id: event.target.value})}
                                  >
                                    {productWHSList &&
                                      productWHSList.map((item) => (
                                        <MenuItem key={item.Key} value={item.Key}>
                                          {item.Value}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </Grid>
                                
                              </Grid> 
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}alignItems="center" justifyContent="center">
                              <Grid
                                container
                                className={classes.gridItemInfo}
                                alignItems="center"
                                style={{ margin: '0 auto',background: 'rgba(224, 224, 224, 1)'}}
                                justifyContent="center"
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
                                    <Table size="small" stickyHeader aria-label="sticky table" classes={{ root: classes.customTable }}>
                                      <TableHead>
                                        <TableRow>
                                          {productionDailyRequestList?.slice(start, end).map((item, index) => (
                                            <TableCell
                                              align="center"
                                              style={
                                               
                                                ( currentDate === item.work_order_date
                                                  ? { background: 'rgb(97, 42, 255)', color: 'white' } :  
                                                  item.work_order_date === dayCurrent ? {background: 'rgb(30 144 255)', color: 'white'} :{}) 
                                               
                                                  
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
                                                  item.percent >= 100
                                                    ? { backgroundColor: 'rgb(48, 188, 65)' }
                                                    : { backgroundColor: 'yellow' }
                                                }
                                              >
                                                {item.percent.toLocaleString()
                                                  + '%'}
                                                 
                                              </Typography>
                                              <Typography
                                                style={{backgroundColor: item.color_check} 
                                                }
                                              >
                                                 {item.is_enough?'Đủ':'Thiếu'}
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
                                          disabled={disableComponent}
                                          variant="outlined"
                                          name="number_of_worker"
                                          InputProps={{ inputProps: { min: 1 } }}
                                          value={workorderRequest?.number_of_worker}
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
                                          disabled={disableComponent}
                                          name="number_of_working_hour"
                                          InputProps={{ inputProps: { min: 1 } }}
                                          value={workorderRequest?.number_of_working_hour}
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
                                <TableContainer style={{ maxHeight: 380 }}>
                                  {/* <TableScrollbar height="350px"> */}
                                  <Table size="small" stickyHeader aria-label="sticky table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell align="left" style={{minWidth: 10, maxWidth:10}}>STT</TableCell>
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
                    {/* <Link to={`/dashboard/workorder/${workorder.id}`} target="_blank" rel="noopener noreferrer"> */}
                    <Button
                      variant="contained"
                      style={{ background: 'rgb(97, 42, 255)' }}
                      onClick={() => popupWindow(`/dashboard/workorder/order-list`, `Mục tiêu sản xuất`)}
                    >
                      Mục tiêu sản xuất
                    </Button>
                    {/* </Link> */}
                  </Grid>
                  {!workorder.id && (
                    <Grid item>
                      <Button
                        variant="contained"
                        style={{ background: 'rgb(97, 42, 255)' }}
                        onClick={() => handleCreateWorkOrder(true, true, true)}
                      >
                        {'Tạo mới'}
                      </Button>
                    </Grid>
                  )}
                  {!!workorder.id && (
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
                          onClick={() => handleCreateWorkOrder(true, true, true)}
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
