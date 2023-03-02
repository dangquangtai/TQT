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
  Tooltip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const style = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
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

const StyledTableCell = withStyles((theme) => ({
  root: {
    '&:not(:first-child)': {
      padding: '10px 5px',
    },
    '&:first-child': {
      padding: '10px 5px 10px 20px',
    },
  },
}))(TableCell);

export default function BrokenModal(props) {
  const { isOpen, isDisabled, handleClose, handleSubmit, handleOpenSnackbar, list } = props;
  const { brokens } = useSelector((state) => state.metadata);
  const [brokenList, setBrokenList] = React.useState([]);
  const [totalBroken, setTotalBroken] = React.useState(0);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...brokenList];
    if (name === 'Broken_Type_Code') {
      const check = brokenList.some((item, i) => item.Broken_Type_Code === value && i !== index);
      if (check) {
        handleOpenSnackbar('error', 'Loại hỏng đã tồn tại');
        brokenList[index].Broken_Type_Code = '';
        brokenList[index].Quantity_In_Piece = 0;
        return;
      }
      const broken = brokens?.find((item) => item.id === value);
      list[index].Broken_Type_Name = broken?.value;
      console.log(broken, list);
    }
    list[index][name] = value;
    setTotalBroken(list.reduce((a, b) => a + Number(b.Quantity_In_Piece), 0));
    setBrokenList(list);
  };

  const handleSubmited = () => {
    handleSubmit(
      brokenList.filter((item) => item.Broken_Type_Code !== '' && item.Quantity_In_Piece !== 0),
      totalBroken
    );
  };

  const handleAddBroken = () => {
    setBrokenList([
      ...brokenList,
      {
        Broken_Type_Code: '',
        Broken_Type_Name: '',
        Quantity_In_Piece: '',
      },
    ]);
  };

  const handleDelete = (index) => {
    const list = [...brokenList];
    list.splice(index, 1);
    setBrokenList(list);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  React.useEffect(() => {
    if (list) {
      setBrokenList(list);
      setTotalBroken(list.reduce((a, b) => a + Number(b.Quantity_In_Piece), 0));
    }
  }, [list]);

  return (
    <div>
      <Modal open={isOpen} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            Chi tiết hỏng
          </div>
          <div id="modal-modal-description" style={style.body}>
            <FormControl style={style.form}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <div style={style.BrokenLabel}>Tổng số hỏng: {totalBroken}</div>
                </Grid>
                <Grid item xs={6}>
                  {!isDisabled && (
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Thêm loại hỏng">
                        <IconButton onClick={handleAddBroken}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
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
                      <StyledTableCell style={{ width: '55%' }}>
                        <TextField
                          fullWidth
                          size="small"
                          select
                          variant="outlined"
                          name="Broken_Type_Code"
                          value={broken.Broken_Type_Code || ''}
                          onChange={(e) => handleChange(e, index)}
                        >
                          {brokens.map((broken) => (
                            <MenuItem key={broken.id} value={broken.id}>
                              {broken.value}
                            </MenuItem>
                          ))}
                        </TextField>
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{ width: '35%' }}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          type="number"
                          name="Quantity_In_Piece"
                          value={broken.Quantity_In_Piece}
                          onChange={(e) => handleChange(e, index)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{ width: '10%' }}>
                        <IconButton aria-label="delete" size="small" onClick={() => handleDelete(index)}>
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
              <Button type="submit" variant="contained" style={style.submitButton} onClick={handleSubmited}>
                Lưu
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
