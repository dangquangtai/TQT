import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Modal,
  Slide,
  Tabs,
  Typography,
  TextField,
  FormControl,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { view } from '../../../store/constant';
import useView from '../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../services/firebase';
import { SNACKBAR_OPEN } from './../../../store/actions';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import useStyles from './../../../utils/classes';
import { tinyMCESecretKey } from './../../../store/constant';
import clsx from 'clsx';
import { lighten } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import DatePicker from './../../../component/DatePicker/index';
import { Autocomplete } from '@material-ui/lab';
import {
  createMaterialReport,
  createMaterialReportFile,
  getAllMaterialReportType,
  getAllWorkOrder,
} from '../../../services/api/Report/MaterialReport';
import { downloadFile } from '../../../utils/helper';

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
    marginTop: '137px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '17px 0px',
  },
  button: {
    margin: '0 12px',
    background: '#FFC000',
  },
  closeButton: {
    margin: '0 55px',
    background: '#465169',
  },
  submitButton: {
    margin: '0 55px',
    background: '#612AFF',
  },
  downloadButton: {
    margin: '0 55px',
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            /> */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

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

const MaterialReportModel = () => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const dispatch = useDispatch();

  const { materialReportDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [tabIndex, setTabIndex] = React.useState(0);
  const editorRef = React.useRef(null);
  const [excelDocumentTemplate, setExcelDocumentTemplate] = useState({});
  const [stepForm, setStepForm] = useState(1);
  const [createReportName, setCreateReportName] = useState({});
  const [reportType, setReportType] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [queryData, setQueryData] = useState({
    from_date: new Date(),
    to_date: new Date(),
    report_type: '',
    work_order_id: '',
  });
  const handleCloseDialog = () => {
    setDocumentToDefault();
    setStepForm(1);
    dispatch({ type: FLOATING_MENU_CHANGE, materialReportDocument: false });
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
  const handleClick = (event, row) => {
    setQueryData({ ...queryData, report_type: row.id });
    setSelected(row);
  };
  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const setDocumentToDefault = async () => {
    setExcelDocumentTemplate({});
    setTabIndex(0);
    if (editorRef.current) editorRef.current.setContent('');
  };
  const setURL = (fileData) => {
    setExcelDocumentTemplate({ ...excelDocumentTemplate, file_url: fileData?.url || '' });
  };

  const handleSubmited = async () => {
    try {
      if (!queryData.work_order_id) {
        handleOpenSnackbar('error', 'Không được để trống kế hoạch sản xuất!');
        return;
      }
      const getURL = await createMaterialReportFile(queryData);
      setCreateReportName({ ...createReportName, file_url: getURL, file_name: getURL });
      // handleDownload(getURL);
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };
  const handleCreateReportName = async () => {
    if (!createReportName.report_name) {
      handleOpenSnackbar('error', 'Không được để trống tên report!');
      return;
    }
    await createMaterialReport(createReportName);
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'materialReportDocument' });
    handleCloseDialog();

    // handleDownload(getURL);
  };
  // const handleCloseDiaLog = () => {
  //   setIsOpenUpload(false);
  // };
  const checkToDate = (date, type) => {
    let DateCP;
    let DateCP2;
    if (type === 'to_date') {
      DateCP = new Date(date);
      DateCP2 = new Date(queryData.from_date);
    } else {
      DateCP = new Date(queryData.to_date);
      DateCP2 = new Date(date);
    }

    if (DateCP < DateCP2) {
      handleOpenSnackbar('error', 'Ngày không hợp lệ!');
      return;
    }
    setQueryData({ ...queryData, from_date: DateCP2, to_date: DateCP });

    // setExportData({ ...exportData, to_date: DateCP, from_date: DateCP2 });
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setCreateReportName({ ...createReportName, [name]: value });
  };
  const handleNext = (e) => {
    if (stepForm === 2) {
      handleSubmited();
    }
    const addStep = stepForm + 1;
    setStepForm(addStep);
  };
  const handlePrevious = (e) => {
    const subStep = stepForm - 1;
    setStepForm(subStep);
  };

  // const handleSubmit = async () => {
  //   try {
  //     let html_field =
  //       editorRef.current && editorRef.current.getContent() ? editorRef.current.getContent() : excelDocumentTemplate.html_field;
  //     console.log(excelDocumentTemplate.html_field);
  //     if (selectedDocument?.id) {
  //       await updateDocumentTemplate({
  //         ...excelDocumentTemplate,
  //         html_field: html_field,
  //       });
  //       handleOpenSnackbar('success', 'Cập nhật tài liệu thành công!');
  //     } else {
  //       await createDocumentTemplate({
  //         ...excelDocumentTemplate,
  //         html_field: html_field,
  //       });
  //       handleOpenSnackbar('success', 'Tạo mới tài liệu thành công!');
  //     }
  //     dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'templateDocument' });
  //     handleCloseDialog();
  //   } catch (error) {
  //     handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
  //   }
  // };

  useEffect(() => {
    if (!selectedDocument) return;
    setExcelDocumentTemplate({
      ...selectedDocument,
    });
  }, [selectedDocument]);
  useEffect(() => {
    const fetchData = async () => {
      const reporttype = await getAllMaterialReportType();
      setReportType(reporttype);
    };
    const fetchWorkOrderData = async () => {
      const workOrders = await getAllWorkOrder();
      setWorkOrders(workOrders);
    };
    fetchData();
    fetchWorkOrderData();
  }, []);

  return (
    <React.Fragment>
      {/* <FirebaseUpload
        open={isOpenUpload || false}
        onSuccess={setURL}
        onClose={handleCloseDiaLog}
        type="other"
        folder="File Import/Document Template"
      /> */}
      <Modal open={openDialog} onClose={handleCloseDialog} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box style={style.box}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Tabs
                value={tabIndex}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTab}
                aria-label="simple tabs example"
                variant="scrollable"
              ></Tabs>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={tabIndex} index={0}>
                <Grid container spacing={1}>
                  <Grid item lg={12} md={12} xs={12}>
                    <div className={classes.tabItem}>
                      {/* <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Lập báo cáo</span>
                          </div>
                        </div> */}
                      <div className={classes.tabItemBody}>
                        <div>
                          {/* <Modal open={openDialog} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"> */}
                          <Box style={style.box}>
                            <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
                              Lập báo cáo
                            </div>
                            {stepForm === 1 ? (
                              <TableBody>
                                {reportType.map((row, index) => (
                                  <TableRow
                                    key={index}
                                    hover
                                    align={'center'}
                                    // alignItems={'center'}
                                    onClick={(event) => handleClick(event, row)}
                                    selected={row.id === selected?.id}
                                  >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell component="th" scope="row" padding="none">
                                      {row.value}
                                    </TableCell>
                                    {/* <TableCell align="right">{row.calories}</TableCell>
                                          <TableCell align="right">{row.fat}</TableCell>
                                          <TableCell align="right">{row.carbs}</TableCell>
                                          <TableCell align="right">{row.protein}</TableCell> */}
                                  </TableRow>
                                ))}

                                {emptyRows > 0 && (
                                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                  </TableRow>
                                )}
                              </TableBody>
                            ) : stepForm === 2 ? (
                              <div>
                                <Grid container className={classes.gridItemInfo} spacing={2}>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <span className={classes.tabItemLabelField}>Chọn kế hoạch sản xuất:</span>
                                    <Autocomplete
                                      // value={supplierList}
                                      options={workOrders}
                                      getOptionLabel={(option) => option.value}
                                      value={workOrders?.find((item) => item.id === queryData.work_order_id) || null}
                                      fullWidth
                                      onChange={(e, value) => setQueryData({ ...queryData, work_order_id: value?.id })}
                                      size="small"
                                      renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                                    />
                                  </Grid>
                                  <Grid item lg={6} md={6} xs={6}>
                                    <span className={classes.tabItemLabelField}>Từ ngày:</span>
                                    <DatePicker date={queryData.from_date} onChange={(date) => checkToDate(date)} />
                                  </Grid>
                                  <Grid item lg={6} md={6} xs={6}>
                                    <span className={classes.tabItemLabelField}>Đến ngày:</span>
                                    <DatePicker date={queryData.to_date} onChange={(date) => checkToDate(date, 'to_date')} />
                                  </Grid>
                                </Grid>

                                <div id="modal-modal-description" style={style.body}>
                                  <FormControl style={style.form}>
                                    <Grid container spacing={2} alignItems="center"></Grid>
                                  </FormControl>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <Grid container className={classes.gridItemInfo} spacing={2}>
                                  <Grid item lg={12} md={12} xs={12}>
                                    <span className={classes.tabItemLabelField}>Đặt tên file:</span>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="report_name"
                                      size="small"
                                      type="text"
                                      // value={excelDocumentTemplate.template_code || ''}
                                      onChange={handleChanges}
                                    />
                                  </Grid>
                                </Grid>

                                <div id="modal-modal-description" style={({ marginTop: '103px' }, style.body)}>
                                  <FormControl style={style.form}>
                                    <Grid container spacing={2} alignItems="center"></Grid>
                                  </FormControl>
                                </div>
                                <div style={style.buttonWrap}></div>
                              </div>
                            )}
                            <div id="modal-modal-description" style={style.body}>
                              <FormControl style={style.form}>
                                <Grid container spacing={2} alignItems="center"></Grid>
                              </FormControl>
                              <div style={style.buttonWrap}>
                                {stepForm === 1 ? (
                                  <Button variant="contained" style={style.closeButton} onClick={() => handleCloseDialog()}>
                                    Đóng
                                  </Button>
                                ) : stepForm === 2 ? (
                                  <Button variant="contained" style={style.closeButton} onClick={handlePrevious}>
                                    Quay lại
                                  </Button>
                                ) : (
                                  <a target="_blank" href={createReportName?.file_url} style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" style={style.closeButton}>
                                      Tải xuống
                                    </Button>
                                  </a>
                                )}
                                {stepForm === 3 ? (
                                  <Button variant="contained" style={style.submitButton} onClick={handleCreateReportName}>
                                    Hoàn tất
                                  </Button>
                                ) : (
                                  <Button variant="contained" style={style.submitButton} onClick={handleNext}>
                                    Tiếp tục
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Box>

                          {/* </Modal> */}
                        </div>
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
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default MaterialReportModel;
