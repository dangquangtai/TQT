import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Tab,
  Tabs,
  Typography,
  TextField,
  MenuItem,
  Switch,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../../../store/constant';
import useView from '../../../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../../../store/actions';
import { DescriptionOutlined as DescriptionOutlinedIcon, History, ImageOutlined as ImageIcon } from '@material-ui/icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../../../services/firebase';
import useStyles from './../../../../../utils/classes';
import { SNACKBAR_OPEN } from './../../../../../store/actions';
import FirebaseUpload from '../../../../FloatingMenu/FirebaseUpload';
import { Editor } from '@tinymce/tinymce-react';
import { tinyMCESecretKey } from './../../../../../store/constant';
import { createDocumentTemplate, updateDocumentTemplate } from '../../../../../services/api/Setting/TemplateDocument';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
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

const TemplateDocumentModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.templateDocument.detail.save);
  const buttonImport = formButtons.find((button) => button.name === view.templateDocument.detail.import);
  const { excelTemplateDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [tabIndex, setTabIndex] = React.useState(0);
  const editorRef = React.useRef(null);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const listType = ['EXCEL', 'WORD', 'HTML'];
  const [excelDocumentTemplate, setExcelDocumentTemplate] = useState({});

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, excelTemplateDocument: false });
  };

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
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

  const setDocumentToDefault = async () => {
    setExcelDocumentTemplate({});
    setTabIndex(0);
    if (editorRef.current) editorRef.current.setContent('');
  };
  const setURL = (link) => {
    setExcelDocumentTemplate({ ...excelDocumentTemplate, file_url: link });
  };

  const handleOpenDiaLog = () => {
    setIsOpenUpload(true);
  };

  const handleCloseDiaLog = () => {
    setIsOpenUpload(false);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setExcelDocumentTemplate({ ...excelDocumentTemplate, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      let html_field =
        editorRef.current && editorRef.current.getContent() ? editorRef.current.getContent() : excelDocumentTemplate.html_field;
      console.log(excelDocumentTemplate.html_field);
      if (selectedDocument?.id) {
        await updateDocumentTemplate({
          ...excelDocumentTemplate,
          html_field: html_field,
        });
        handleOpenSnackbar('success', 'Cập nhật tài liệu thành công!');
      } else {
        await createDocumentTemplate({
          ...excelDocumentTemplate,
          html_field: html_field,
        });
        handleOpenSnackbar('success', 'Tạo mới tài liệu thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'templateDocument' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setExcelDocumentTemplate({
      ...selectedDocument,
    });
  }, [selectedDocument]);

  return (
    <React.Fragment>
      <FirebaseUpload
        open={isOpenUpload || false}
        onSuccess={setURL}
        onClose={handleCloseDiaLog}
        type="other"
        folder="File Import/Material Inventory"
      />
      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          className={classes.partnerdialog}
        >
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Quản lý tài liệu
            </Grid>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Tabs
                  value={tabIndex}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChangeTab}
                  aria-label="simple tabs example"
                  variant="scrollable"
                >
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <DescriptionOutlinedIcon className={`${tabIndex === 0 ? classes.tabActiveIcon : ''}`} />
                        Nội dung
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography className={classes.tabLabels} component="span" variant="subtitle1">
                        <History className={`${tabIndex === 1 ? classes.tabActiveIcon : ''}`} />
                        HTML Code
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Template</span>
                          </div>
                        </div>
                        <div className={`${classes.tabItemBody} ${classes.tabItemDownload}`}>
                          <Grid container spacing={1}>
                            <Grid item lg={12} md={12} xs={12}>
                              <div className={classes.tabItem}>
                                <div className={classes.tabItemTitle}>
                                  <div className={classes.tabItemLabel}>
                                    <ImageIcon />
                                    <span>Mẫu tài liệu</span>
                                  </div>
                                </div>
                                <div className={`${classes.tabItemBody} ${classes.tabItemMentorAvatarBody}`}>
                                  <img
                                    src="https://firebasestorage.googleapis.com/v0/b/tqtapp-873d6.appspot.com/o/Icon%2FattachFile.png?alt=media&token=302df534-166e-4d48-bfec-f36cb9d93f67"
                                    alt=""
                                  />
                                  <div>
                                    <div>
                                      {' '}
                                      <a href={excelDocumentTemplate.file_url} target="__blank">
                                        {excelDocumentTemplate.file_url ? 'Tải xuống' : undefined}
                                      </a>
                                    </div>
                                    <div>
                                      {' '}
                                      <Button onClick={() => handleOpenDiaLog()}>Chọn mẫu tài liệu </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Thông tin</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã tài liệu:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="template_code"
                                size="small"
                                type="text"
                                value={excelDocumentTemplate.template_code || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên tài liệu:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="title"
                                size="small"
                                type="text"
                                value={excelDocumentTemplate.title || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mô tả:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="description"
                                size="small"
                                type="text"
                                value={excelDocumentTemplate.description || ''}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Loại tài liệu:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="document_type"
                                value={excelDocumentTemplate.document_type || ''}
                                size="small"
                                onChange={handleChanges}
                              >
                                {listType.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Hoạt động:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Switch
                                checked={excelDocumentTemplate.is_active || false}
                                onChange={(e) => setExcelDocumentTemplate({ ...excelDocumentTemplate, is_active: e.target.checked })}
                                color="primary"
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Nội dung</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Editor
                                apiKey={tinyMCESecretKey}
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                initialValue={excelDocumentTemplate.html_field}
                                id="html_field"
                                init={{
                                  height: 500,
                                  menubar: false,
                                  plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount',
                                  ],
                                  toolbar:
                                    'undo redo | formatselect | ' +
                                    'image |' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | fullscreen preview | help',
                                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                  file_picker_types: 'image',
                                  image_title: false,
                                  image_description: false,
                                  automatic_uploads: true,
                                  images_upload_handler: async function (blobInfo, success, failure) {
                                    const newName = `${blobInfo.filename()}-${new Date().getTime()}`;
                                    const file = new File([blobInfo.blob()], newName, { type: blobInfo.blob().type });
                                    const storageRef = ref(storage, `News/Upload/${file.name}`);
                                    const uploadTask = uploadBytesResumable(storageRef, file);
                                    uploadTask.on(
                                      'state_changed',
                                      (snapshot) => {
                                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                        console.log('Upload is ' + progress + '% done');
                                      },
                                      (error) => {
                                        console.log(error);
                                        failure('');
                                      },
                                      () => {
                                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                          success(downloadURL);
                                        });
                                      }
                                    );
                                  },
                                }}
                              />
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
              <Grid item className={classes.gridItemInfoButtonWrap}>
                <Button variant="contained" style={{ background: 'rgb(70, 81, 105)' }} onClick={() => handleCloseDialog()}>
                  Đóng
                </Button>
              </Grid>
              <Grid item className={classes.gridItemInfoButtonWrap}>
                {selectedDocument?.id && buttonSave && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmit}>
                    {buttonSave.text}
                  </Button>
                )}
                {selectedDocument?.id && buttonImport && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleOpenDiaLog}>
                    {buttonImport.text}
                  </Button>
                )}
                {!selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleOpenDiaLog}>
                    Import
                  </Button>
                )}

                {!selectedDocument?.id && (
                  <Button variant="contained" style={{ background: 'rgb(97, 42, 255)' }} onClick={handleSubmit}>
                    Tạo mới
                  </Button>
                )}
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default TemplateDocumentModal;
