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
  Grid
} from '@material-ui/core';
import { Close } from '@mui/icons-material';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  open,
  setOpen,
  detail,
  ...props
}) {

  const handleClose = () => {
    setOpen(false);
  };
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
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            <Grid container alignItems="center" style={{ marginTop: 100 }}>
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
                        <TableCell component="th" scope="row" >
                          {detail.product_customer_code}
                        </TableCell>
                        <TableCell component="th" scope="row" >
                          {detail.product_name}
                        </TableCell>
                        <TableCell component="th" scope="row" >
                          {detail.quantity_in_box}
                        </TableCell>
                        <TableCell component="th" scope="row" >
                          {detail.unit_name}
                        </TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item lg={7} md={7} xs={7}>
               
                <TableContainer style={{ maxHeight: 430 }}>
                <span><b>Vật tư sản xuất</b></span>
                  <Table size="small">
                    <TableHead >
                      <TableRow>
                        <TableCell>Nhóm VT</TableCell>
                        <TableCell>Tên VT</TableCell>
                        <TableCell>Mã VT</TableCell>
                        <TableCell>Số lượng VT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail?.part_list?.map((item) => (
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row" >
                            {item.Category_Name}
                          </TableCell>
                          <TableCell component="th" scope="row" >
                            {item.Part_Name}
                          </TableCell>
                          <TableCell component="th" scope="row" >
                            {item.Part_Code}
                          </TableCell>
                          <TableCell component="th" scope="row" >
                            <Typography style={{ backgroundColor: item.Is_Enough ? 'rgb(48, 188, 65)' : 'yellow' }}>{item.Quantity_In_Warehouse
                            }</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
           
              <Grid item lg={5} md={5} xs={5} >
                
                <TableContainer style={{ maxHeight: 430, marginLeft:30  }}>
                <span ><b>Tồn kho nhà cung cấp</b> </span>
                  <Table size="small">
                    <TableHead >
                      <TableRow>
                        <TableCell>Nhà cung cấp</TableCell>
                        <TableCell>Tồn kho</TableCell>
                        <TableCell>Số lượng sử dụng </TableCell>
                        <TableCell>Số lượng thiếu</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail?.part_list?.map((item) => (
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row" >
                            {item.Category_Name}
                          </TableCell>
                          <TableCell component="th" scope="row" >
                            {item.Quantity_In_Warehouse}
                          </TableCell>
                          <TableCell component="th" scope="row" >
                            {item.Quantity_In_Warehouse}
                          </TableCell>
                          <TableCell component="th" scope="row" >
                            {item.Quantity_In_Warehouse}
                          </TableCell>
                          <TableCell component="th" scope="row" >
                            {'Có sẵn'}
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
      </Dialog>
    </div>
  );
}