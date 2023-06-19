import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Grid, FormControl, Link, Stepper, Step, StepLabel } from '@material-ui/core';
import useStyles from './../../../../utils/classes';
import { useDispatch, useSelector } from 'react-redux';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN } from './../../../../store/actions';
import { getTemplateMaterialPart, importMaterialPartsData } from '../../../../services/api/Material/MaterialPart';
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
  const [templateFileUrl, setTemplateFileUrl] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Thêm file dữ liệu', 'Import'];
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
    try {
      await importMaterialPartsData(exportData);
      handleOpenSnackbar('success', 'Import vật tư thành công!');
      dispatch({ type: FLOATING_MENU_CHANGE, importMaterialPartsDataDocument: false });
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };
  const handleDownloadTemplate = async () => {
    const url = await getTemplateMaterialPart();
    setTemplateFileUrl(url);
  };
  const handleCloseModal = () => {
    dispatch({ type: FLOATING_MENU_CHANGE, importMaterialPartsDataDocument: false });
    setActiveStep(0);
    setExportData({});
  };
  const handleBackSteps = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleNextSteps = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  useEffect(() => {
    if (!openDialog) return;
    handleDownloadTemplate();
  }, [openDialog]);
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
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      default:
        return '';
    }
  }
  const renderStep1 = () => {
    return (
      <div>
        <Grid container className={classes.gridItemInfo} spacing={2}>
          <Grid item lg={12} md={12} xs={12} container justifyContent="center">
            <FirebaseUpload
              open={dialogUpload.open || false}
              onSuccess={setURL}
              onClose={handleCloseDiaLogFireBase}
              folder="ImportMaterialPart"
              type="excel"
            />
            <div className={classes.tabItemNoBorder}>
              <div className={`${classes.tabItemBody} ${classes.tabItemMentorAvatarBody}`} style={{ textAlign: 'center' }}>
                <div>
                  <div>
                    <div style={{ marginTop: 10 }}>
                      <Link href={templateFileUrl} target="_blank">
                        Tải template mẫu
                      </Link>
                    </div>
                  </div>
                  {/* <Button onClick={() => handleOpenDiaLog()}>Chọn File </Button> */}
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
            <Button type="submit" variant="contained" style={style.submitButton} onClick={() => handleOpenDiaLog()}>
              Chọn File
            </Button>
            {/* {exportData.file_url ? (
              <Button type="submit" variant="contained" style={style.submitButton} onClick={handleNextSteps}>
                Tiếp
              </Button>
            ) : undefined} */}
          </div>
        </div>
      </div>
    );
  };
  const renderStep2 = () => {
    return (
      <div>
        <Grid container className={classes.gridItemInfo} spacing={2}>
          <Grid item lg={12} md={12} xs={12} container justifyContent="center">
            <FirebaseUpload
              open={dialogUpload.open || false}
              onSuccess={setURL}
              onClose={handleCloseDiaLogFireBase}
              folder="ImportMaterialPart"
              type="excel"
            />
            <div className={classes.tabItemNoBorder}>
              <div className={`${classes.tabItemBody} ${classes.tabItemMentorAvatarBody}`} style={{ textAlign: 'center' }}>
                <div>
                  <Link href={exportData.file_url} target="_blank">
                    {exportData.file_name ? exportData.file_name : 'Có lỗi xảy ra khi tải file lên'}
                  </Link>
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
            <Button type="button" variant="contained" style={style.closeButton} onClick={handleBackSteps}>
              Quay lại
            </Button>
            <Button type="submit" variant="contained" style={style.submitButton} onClick={() => handleSubmited()}>
              Import
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Modal open={openDialog} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            Import dữ liệu vật tư
          </div>
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
        </Box>
      </Modal>
    </div>
  );
}
