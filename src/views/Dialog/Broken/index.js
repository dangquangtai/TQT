import React from 'react';
import {
  Box,
  Button,
  Modal,
  MenuItem,
  Grid,
  FormControl,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';

const style = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
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
    marginBottom: '20px',
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

const StyledTableCell = withStyles((theme) => ({
  root: {
    '&:not(:first-child)': {
      padding: '10px 2px',
    },
    '&:first-child': {
      padding: '10px 2px 10px 20px',
    },
  },
}))(TableCell);

export default function BrokenModal(props) {
  const { isOpen, handleClose, handleSubmit, handleDeleteBroken, brokenList } = props;
  const { brokens } = useSelector((state) => state.metadata);
  const [brokenData, setBrokenData] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrokenData({ ...brokenData, [name]: value });
  };

  const handleAddBroken = () => {
    handleSubmit({
      ...brokenData,
      Broken_Type_Name: brokens.find((broken) => broken.id === brokenData.Broken_Type_Code).value,
    });
    setBrokenData({});
  };

  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <div>
      <Modal open={isOpen} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            Chi tiết hỏng
          </div>
          <div id="modal-modal-description" style={style.body}>
            <FormControl style={style.form}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div style={style.BrokenLabel}>Hỏng:</div>
                </Grid>
                <Grid item xs={6}>
                  <div style={style.BrokenLabel}>Số lượng:</div>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" select variant="outlined" name="Broken_Type_Code" onChange={handleChange}>
                    {brokens.map((broken) => (
                      <MenuItem key={broken.id} value={broken.id}>
                        {broken.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" variant="outlined" type="number" name="Quantity_In_Piece" onChange={handleChange} />
                </Grid>
              </Grid>
            </FormControl>
            <TableContainer style={style.table} component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Loại hỏng</StyledTableCell>
                    <StyledTableCell align="left">Số lượng</StyledTableCell>
                    <StyledTableCell align="left">Xóa</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brokenList?.map((broken, index) => (
                    <TableRow key={index}>
                      <StyledTableCell>{broken.Broken_Type_Name}</StyledTableCell>
                      <StyledTableCell align="left">{broken.Quantity_In_Piece}</StyledTableCell>
                      <StyledTableCell align="left">
                        <IconButton aria-label="delete" size="small" onClick={() => handleDeleteBroken(index)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={style.buttonWrap}>
              <Button type="button" variant="contained" style={style.closeButton} onClick={handleCloseModal}>
                Đóng
              </Button>
              <Button type="submit" variant="contained" style={style.submitButton} onClick={handleAddBroken}>
                Lưu
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
