import * as React from 'react';
import {
  Slide,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  TextField,
  Tooltip,
  Grid
} from '@material-ui/core';
import { Delete, AddCircleOutline } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMaterialInventoryList, createMaterialRequisition } from '../../../services/api/Workorder';
import useStyles from '../Detail/classes';
import { FLOATING_MENU_CHANGE, ORDER_DETAIL_CHANGE, DOCUMENT_CHANGE, MATERIAL_CHANGE } from '../../../store/actions.js';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const { workorderDetail: orderRedux } = useSelector((state) => state.order);
  const [open, setOpen] = useState(true);
  const [detail, setDetail] = useState({});
  const [indexColor, setIndexColor] = useState(-1);
  const classes = useStyles();
  const [totalPart,setTotal] = useState({total: 0});
  const [supplierList, setSupplierList] = useState([

  ]);
  const dispatch = useDispatch();
  const [supplierListAll, setSupplierListAll] = useState([

  ]);
  const [supplierListDrop, setSupplierDropList] = useState([


  ]);
  const handleChangeRow = (row, index) => {
    let total = totalPart.total;
    if (!!row) {
      const newProductList = [...supplierList];
      const newProduct = {
        supplier_name: row.supplier_name,
        quantity_in_piece: detail.part_list[indexColor].Quantity_In_Piece,
        supplier_id: row.supplier_id,
        part_code: row.part_code,
        part_id: row.part_id,
        part_name: row.part_name,
        daily_work_order_detail_id: detail.id,
        work_order_id: detail.work_order_id,
        daily_work_order_id: detail.daily_work_order_id,
        quantity_in_wh: row.quantity_in_piece,
        is_enough: true,
        quantity: row.quantity_in_piece
      };
      newProductList[index] = { ...newProductList[index], ...newProduct };
      let totalCa = total - newProductList[index].quantity_in_wh;
      newProductList[index] = { ...newProductList[index], quantity: totalCa >= 0 ? totalCa : 0, is_enough: total < newProductList[index].quantity_in_wh ? true : false }
      total = totalCa >= 0 ? totalCa : 0;
      detail.part_list[indexColor].Quantity_In_Piece = total;
      setSupplierList([...newProductList]);
      setTotal({total: total})
    }
  };
  const handleChangeTotal = () =>{
    let total = orderRedux.workorderDetail.part_list[indexColor].Quantity_In_Piece;
        const newProductList = [...supplierList];
        newProductList.forEach((element,indexf) => {
        let totalCa=total- element.quantity_in_wh;
        newProductList[indexf]={...element, quantity: totalCa>=0?totalCa: 0, is_enough: total < element.quantity_in_wh? true : false }
        total=totalCa;
      });
      detail.part_list[indexColor].Quantity_In_Piece= total;
      setSupplierList([...newProductList]);
      setTotal({total:total})
  }
  
  const handleAddRow = () => {
    const newProduct = {
      part_id: '',
      quantity_in_piece: 0,
    };
    const newProductList = [...supplierList, newProduct];
    setSupplierList([...newProductList]);

  };
  const handleSubmit = async () => {
    let data = supplierList.filter((x) => x.part_id !== '')
    let data2 = supplierListAll.filter((x) => x.part_id !== '')
   
    await createMaterialRequisition({
      order_date: detail.order_date,
      daily_requisition_detail_list: [...data2, ...data],
      requisition_id: detail?.supplierList[0]?.requisition_id || '',
      daily_work_order_detail_id: detail.id,
      work_order_id: detail.work_order_id,
    })
    dispatch({
      type: MATERIAL_CHANGE, order: null, orderDetail: null,
      workorderDetail: { data: 1 }
    });
    window.opener = null;
    window.open("", "_self");
    window.close();
    setSupplierDropList([]);
    setSupplierListAll([]);
    setSupplierList([]);
  }
  const handleClose = () => {
    setSupplierList([]);
    setSupplierDropList([]);
    setOpen(false);
  };
  const fetchData = async (index) => {
    let data = await getMaterialInventoryList(detail.work_order_id, detail.part_list[index].Part_Code)
    let data2 = []
    data.forEach(element => {
      data2 = [...data2, {
        supplier_name: element.Supplier_Name,
        supplier_id: element.Supplier_ID,
        part_code: element.Part_Code,
        part_id: element.Part_ID,
        part_name: element.Part_Name,
        quantity_in_wh: element.Quantity_In_Piece,
        quantity_in_piece: element.Quantity_In_Piece,
      }]
    });
    setSupplierDropList(data2)
  }

  const handleGetsupllier = (index) => {
    setIndexColor(index)
    setTotal({total:orderRedux.workorderDetail.part_list[index].Quantity_In_Piece})
    let data = supplierListAll.filter((x) => x.part_code === orderRedux.workorderDetail.part_list[index].Part_Code)
    let data2 = supplierListAll.filter((x) => x.part_code !== orderRedux.workorderDetail.part_list[index].Part_Code)
    setSupplierListAll([...data2, ...supplierList])
    setSupplierList([...data])
    fetchData(index)
  };
  const handleCheck = (item) => {
    if (item.Quantity_In_Piece === 0 || item.Is_Enough)
      return <Typography style={{ backgroundColor: 'rgb(48, 188, 65)' }}>
        {item.Quantity_In_Piece 
        }</Typography>
    return <Typography style={{ backgroundColor: 'yellow' }}>
      {item.Quantity_In_Piece.toLocaleString()
      }</Typography>



  };
  const handleDeleteRow = (index) => {
    
    supplierList.splice(index, 1);
    handleChangeTotal()
    setSupplierList([...supplierList])
  }

  useEffect(() => {
    if (!orderRedux.workorderDetail) return;
    const detailData=[]
    orderRedux.workorderDetail.part_list.forEach(element=>{
      detailData.push({...element,check:0});
 
    })
    setSupplierList([])
    var newSupplierList = [];
   
      orderRedux.workorderDetail.supplierList.forEach((row)=>{
        if(row.is_enough){
          newSupplierList=[...newSupplierList,{...row,
            is_enough: true,
            quantity: 0
          }]
          let date2 =  orderRedux.workorderDetail.part_list.findIndex((x) => x.Part_Code === row.part_code)
            detailData[date2] = {...detailData[date2],...orderRedux.workorderDetail.part_list[date2],
              Quantity_In_Piece: orderRedux.workorderDetail.part_list[date2].Quantity_In_Piece
             }
        }
        else {
          newSupplierList=[...newSupplierList,{...row,
            is_enough: row.quantity_in_piece-row.quantity_in_wh>0?false:true,
            quantity: row.quantity_in_piece-row.quantity_in_wh>0?row.quantity_in_piece-row.quantity_in_wh:row.quantity_in_wh-row.quantity_in_piece
          }]
          let date2 =  orderRedux.workorderDetail.part_list.findIndex((x) => x.Part_Code === row.part_code)
            detailData[date2] = {...detailData[date2],...orderRedux.workorderDetail.part_list[date2],Quantity_In_Piece: orderRedux.workorderDetail.part_list[date2].Quantity_In_Piece-row.quantity_in_wh>0?orderRedux.workorderDetail.part_list[date2].Quantity_In_Piece-row.quantity_in_wh:0}
        }
       
         
      })
   
   
    setSupplierListAll([...newSupplierList])
    setDetail({...orderRedux.workorderDetail, part_list: [...detailData]});
  }, [orderRedux.workorderDetail])
  

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"

              aria-label="close"
            >

            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" style={{ color: 'white' }}>
              CHI TIẾT VẬT TƯ
            </Typography>

          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={2} style={{ marginTop: 70 }} >
              <Grid item lg={12} md={12} xs={12}>
                <span><b>Chi tiết vật tư</b></span>
                <TableContainer >
                  <Table size="small">
                    <TableHead >
                      <TableRow>
                        <TableCell>Mã TP</TableCell>
                        <TableCell>Mã TP của TQT</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Đơn vị</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell  >
                          {detail.product_customer_code}
                        </TableCell>
                        <TableCell  >
                          {detail.product_name}
                        </TableCell>
                        <TableCell >
                          {detail.quantity_in_box?.toLocaleString()}
                        </TableCell>
                        <TableCell >
                          {detail.unit_name}
                        </TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item lg={6} md={6} xs={6}>
                <span><b>Vật tư sản xuất</b></span></Grid>
              <Grid item lg={5} md={5} xs={5}>
                <span ><b>Tồn kho nhà cung cấp</b> </span></Grid>
              <Grid item lg={1} md={1} xs={1} >

              </Grid>


              <Grid item lg={6} md={6} xs={6}>
                <TableContainer style={{ maxHeight: 430 }}>
                  <Table size="small">
                    <TableHead >
                      <TableRow>
                        <TableCell>Mã </TableCell>
                        <TableCell>Tên </TableCell>
                        <TableCell>Nhóm </TableCell>
                        <TableCell>Số lượng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail?.part_list?.map((item, index) => (
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} style={{ backgroundColor: index === indexColor ? ' rgb(224, 224, 224)' : '' }} onClick={() => handleGetsupllier(index)} >
                          <TableCell component="th" scope="row" >
                            {item.Part_Code}
                          </TableCell>
                          <TableCell component="th" scope="row" style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>

                            <Tooltip title={item.Part_Name}>
                              <span>   {item.Part_Name}</span>
                            </Tooltip>

                          </TableCell>

                          <TableCell component="th" scope="row" >
                            {item.Category_Name}
                          </TableCell>

                          <TableCell component="th" scope="row" >
                            {handleCheck(item)}
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item lg={6} md={6} xs={6} >
                <TableContainer style={{ maxHeight: 430 }}  >
                  <Table size="small" stickyHeader aria-label="sticky table">
                    <TableHead >
                      <TableRow>
                        <TableCell>Nhà cung cấp</TableCell>
                        <TableCell>Tồn kho</TableCell>
                        <TableCell>SL sử dụng </TableCell>
                        <TableCell>SL thiếu</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell><IconButton
                          onClick={handleAddRow}
                        >
                          <AddCircleOutline />
                        </IconButton> </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {supplierList.map((item, index) => (
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row" style={{ minWidth: 250, maxWidth: 250 }}>
                            <Autocomplete
                              value={item}
                              size="small"
                              disableClearable
                              options={supplierListDrop}

                              fullWidth
                              onChange={(e, u) => handleChangeRow(u, index)}
                              getOptionLabel={(option) => option.supplier_name}
                              renderInput={(params) => <TextField {...params} variant="outlined" />}
                            />
                          </TableCell>
                          <TableCell >
                            {item.quantity_in_wh?.toLocaleString()}
                          </TableCell>
                          <TableCell  >
                            {item.quantity_in_piece?.toLocaleString()}
                          </TableCell>
                          <TableCell >
                            { (item.quantity?.toLocaleString() || 0)}
                          </TableCell>
                          <TableCell  >
                            <Typography style={{ backgroundColor: item.is_enough ? 'rgb(48, 188, 65)' : 'yellow' }}>
                              { item.is_enough ? 'Đủ' : 'Thiếu'}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <IconButton
                              onClick={() => handleDeleteRow(index)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </Grid>
            </Grid>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2} justifyContent="flex-end">
            <Button onClick={handleSubmit} variant="contained" style={{ background: 'rgb(97, 42, 255)', color: 'white', margin: 10 }}>
              {'Lưu'}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}