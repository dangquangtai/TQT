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
import { Close } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMaterialInventoryList, createMaterialRequisition, getMaterialDaily } from '../../../services/api/Workorder';
import useStyles from '../Detail/classes';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const { order: orderRedux } = useSelector((state) => state.order);
  const [open, setOpen] = useState(true);
  const [detail, setDetail] = useState({});
  const [indexColor, setIndexColor] = useState();
  const classes = useStyles();
  const [supplierList, setSupplierList] = useState([

  ]);
  const [supplierListAll, setSupplierListAll] = useState([

  ]);
  const [supplierListDrop, setSupplierDropList] = useState([


  ]);
  const handleChangeRow = (row, index) => {
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
        is_enough: row.quantity_in_piece - detail.part_list[indexColor].Quantity_In_Piece >= 0 ? true : false,
        quantity: row.quantity_in_piece - detail.part_list[indexColor].Quantity_In_Piece
      };
      newProductList[index] = { ...newProductList[index], ...newProduct };
      setSupplierList([...newProductList]);
    }
  };
  const handleAddRow = () => {
    const newProductList = [...supplierList];
    const newProduct = {
    };
    setSupplierList([...newProductList, newProduct]);

  };
  const handleSubmit = async () => {
    await createMaterialRequisition({
      order_date: detail.order_date,
      daily_requisition_detail_list: [...supplierListAll,...supplierList],
      requisition_id: detail?.supplierList[0]?.requisition_id|'',
      daily_work_order_detail_id: detail.id,
      work_order_id: detail.work_order_id,
    })
    window.opener = null;
    window.open("", "_self");
    window.close();
  }
  const handleClose = () => {
    setOpen(false);
  };
  const fetchData = async (index) => {
    let data = await getMaterialInventoryList(detail.work_order_id, detail.part_list[index].Part_Code)
    let data2 =[]
    data.forEach(element => {
      data2=[...data2,{
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
    let data = supplierListAll.filter((x) => x.part_code === orderRedux.workorderDetail.part_list[index].Part_Code)
    let data2 = supplierListAll.filter((x) => x.part_code !== orderRedux.workorderDetail.part_list[index].Part_Code)
    console.log(orderRedux.workorderDetail.part_list[index].Part_Code)
    setSupplierListAll([...data2,...supplierList])
    setSupplierList([...data])
    fetchData(index)
  };
  const handleDeleteRow = (index) => {
    supplierList.splice(index, 1);
    setSupplierList([...supplierList])
  }

  useEffect(() => {
    if (!orderRedux.workorderDetail) return;
    setDetail(orderRedux.workorderDetail);
    setSupplierList([])
    setSupplierListAll([...orderRedux.workorderDetail.supplierList])
  
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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
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
                          {detail.quantity_in_box}
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
                            <Typography style={{ backgroundColor: item.Is_Enough ? 'rgb(48, 188, 65)' : 'yellow' }}>{item.Quantity_In_Piece
                            }</Typography>
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
                        <TableCell>Sl sử dụng </TableCell>
                        <TableCell>Sl thiếu</TableCell>
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
                              disablePortal
                              options={supplierListDrop}
                              disableClearable
                              fullWidth
                              onChange={(e, u) => handleChangeRow(u, index)}
                              getOptionLabel={(option) => option.supplier_name}
                              renderInput={(params) => <TextField {...params} variant="outlined" />}
                            />
                          </TableCell>
                          <TableCell >
                            {item.quantity_in_wh}
                          </TableCell>
                          <TableCell  >
                            {item.quantity_in_piece}
                          </TableCell>
                          <TableCell >
                         
                              {item.is_enough ? 0 : item.quantity}
                          

                          </TableCell>
                          <TableCell  >
                            <Typography style={{ backgroundColor: item.is_enough ? 'rgb(48, 188, 65)' : 'yellow' }}>
                              {item.is_enough ? 'Đủ' : 'Thiếu'}
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
            <Button onClick={handleSubmit} variant="contained" style={{ background: 'rgb(97, 42, 255)', color: 'white' }}>
              {'Lưu'}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}