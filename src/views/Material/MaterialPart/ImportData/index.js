import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Grid, FormControl, TableCell, TextField, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useStyles from './../../../../utils/classes';
import { useDispatch, useSelector } from 'react-redux';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import { Autocomplete } from '@material-ui/lab';
import { getTemplateMaterialPart, importMaterialPartsData } from '../../../../services/api/Material/MaterialPart';
import * as XLSX from 'xlsx';
import FirebaseUpload from '../../../FloatingMenu/FirebaseUpload';
import { downloadFile } from '../../../../utils/helper';

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

export default function ImportMatetialPartsDataModal() {
  const { importMaterialPartsDataDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const dispatch = useDispatch();
  const { selectedDocument } = useSelector((state) => state.document);
  const classes = useStyles();
  const [dialogUpload, setDialogUpload] = useState({
    open: false,
    type: '',
  });
  const [exportData, setExportData] = useState({
    file_url: null,
    file_name: null,
  });
  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
  };
  const handleSubmited = async () => {
    if (!exportData.file_url) {
      handleOpenSnackbar('error', 'Vui lòng chọn tệp!');
      return;
    }
    await importMaterialPartsData(exportData);
  };
  const handleDownloadTemplate = async () => {
    const url = await getTemplateMaterialPart();
    handleDownload(url);
  };
  const handleCloseModal = () => {
    dispatch({ type: FLOATING_MENU_CHANGE, importMaterialPartsDataDocument: false });
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

  const setURL = (file) => {
    setExportData({
      ...exportData,
      file_url: file.url,
      file_name: file.file_name,
    });
    console.log(file);
  };
  const handleOpenDiaLog = () => {
    setDialogUpload({ open: true });
  };
  const handleCloseDiaLogFireBase = () => {
    setDialogUpload({ open: false });
  };
  const handleCloseDiaLog = () => {
    setExportData({
      ...exportData,
      file_url: '',
      file_name: '',
    });
    setDialogUpload({ open: false });
    dispatch({ type: FLOATING_MENU_CHANGE, importMaterialPartsDataDocument: false });
  };

  return (
    <div>
      <Modal open={openDialog} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            Import dữ liệu vật tư
          </div>
          <Grid container className={classes.gridItemInfo} spacing={2}>
            <Grid item lg={12} md={12} xs={12} container justifyContent="center">
              <FirebaseUpload
                open={dialogUpload.open || false}
                onSuccess={setURL}
                onClose={handleCloseDiaLogFireBase}
                folder="AvatarAccount"
                type="excel"
              />
              <div className={classes.tabItemNoBorder}>
                <div className={`${classes.tabItemBody} ${classes.tabItemMentorAvatarBody}`} style={{ textAlign: 'center' }}>
                  <div>
                    <div>{exportData.file_name ? exportData.file_name : 'Upload/Change File'}</div>
                    <Button onClick={() => handleOpenDiaLog()}>Chọn File </Button>
                  </div>
                </div>
              </div>
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
              <Button type="submit" variant="contained" style={style.submitButton} onClick={handleDownloadTemplate}>
                Tải template
              </Button>
              <Button type="submit" variant="contained" style={style.submitButton} onClick={handleSubmited}>
                Import
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
