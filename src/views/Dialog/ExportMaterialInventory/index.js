import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Grid, FormControl, TableCell, TextField, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './../../../utils/classes';
import { useDispatch, useSelector } from 'react-redux';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../store/actions';
import DatePicker from './../../../component/DatePicker/index';
import { getAllSupplier } from '../../../services/api/Partner/Supplier';
import { exportDetailedSummaryMaterialInventory } from '../../../services/api/Material/Warehouse';
import { downloadFile } from '../../../utils/helper';
import { Autocomplete } from '@material-ui/lab';

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

export default function ExportMaterialInventoryModal() {
  const { exportMaterialInventoryDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const dispatch = useDispatch();
  const { selectedDocument } = useSelector((state) => state.document);
  const classes = useStyles();
  const [supplierList, setSupplierList] = useState([]);
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
  const checkToDate = (date, type) => {
    let DateCP;
    let DateCP2;
    if (type === 'to_date') {
      DateCP = new Date(date);
      DateCP2 = new Date(exportData?.from_date);
    } else {
      DateCP = new Date(exportData?.to_date);
      DateCP2 = new Date(date);
    }

    if (DateCP < DateCP2) {
      handleOpenSnackbar('error', 'Ngày không hợp lệ!');
      return;
    }
    setExportData({ ...exportData, to_date: DateCP, from_date: DateCP2 });
  };
  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
  };
  const handleCloseModal = () => {
    dispatch({ type: FLOATING_MENU_CHANGE, exportMaterialInventoryDocument: false });
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
  useEffect(() => {
    const fetchData = async () => {
      const listSupplier = await getAllSupplier();
      setSupplierList(listSupplier);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Modal open={openDialog} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            Tùy chọn xuất
          </div>
          <Grid container className={classes.gridItemInfo} spacing={2}>
            <Grid item lg={4} md={4} xs={4}>
              <span className={classes.tabItemLabelField}>Từ ngày</span>
              <DatePicker date={exportData.from_date} onChange={(date) => checkToDate(date)} />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <span className={classes.tabItemLabelField}>Đến ngày</span>
              <DatePicker date={exportData.to_date} onChange={(date) => checkToDate(date, 'to_date')} />
            </Grid>
            <Grid item lg={4} md={4} xs={4}>
              <span className={classes.tabItemLabelField}>Nhà cung cấp</span>

              <Autocomplete
                // value={supplierList}
                options={supplierList}
                getOptionLabel={(option) => option.title}
                fullWidth
                onChange={(e, value) => setExportData({ ...exportData, supplier_id: value?.id })}
                size="small"
                renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
              />
            </Grid>
          </Grid>
          <div id="modal-modal-description" style={style.body}>
            <FormControl style={style.form}>
              <Grid container spacing={2} alignItems="center"></Grid>
            </FormControl>
            <div style={style.buttonWrap}>
              <Button type="button" variant="contained" style={style.closeButton} onClick={handleCloseModal}>
                Đóng
              </Button>
              <Button type="submit" variant="contained" style={style.submitButton} onClick={handleSubmited}>
                Xuất
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
