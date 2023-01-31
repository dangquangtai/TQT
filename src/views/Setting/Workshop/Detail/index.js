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
import { view } from '../../../../store/constant';
import useView from '../../../../hooks/useView';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../../store/actions';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@material-ui/icons';
import useStyles from './../../../../utils/classes';
import { SNACKBAR_OPEN } from './../../../../store/actions';
import { createWorkshop, updateWorkshop } from './../../../../services/api/Setting/Workshop';

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

const WorkshopModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { form_buttons: formButtons } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.workshop.detail.save);
  const { workshopDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [tabIndex, setTabIndex] = React.useState(0);

  const [workshopData, setWorkshopData] = useState({});
  const { provinces } = useSelector((state) => state.metadata);

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, materialWorkshopDocument: false });
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
    setWorkshopData({});
    setTabIndex(0);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setWorkshopData({ ...workshopData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (selectedDocument) {
        await updateWorkshop(workshopData);
        handleOpenSnackbar('success', 'Cập nhật xưởng sản xuất thành công!');
      } else {
        await createWorkshop(workshopData);
        handleOpenSnackbar('success', 'Tạo mới xưởng sản xuất thành công!');
      }
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'Workshop' });
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar('error', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  useEffect(() => {
    if (!selectedDocument) return;
    setWorkshopData({
      ...workshopData,
      ...selectedDocument,
    });
  }, [selectedDocument]);

  return (
    <React.Fragment>
      <Grid container>
        <Dialog open={openDialog || false} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog} className={classes.partnerdialog}>
          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Xưởng sản xuất
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
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Thông tin</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã xưởng:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="workshop_code"
                                size="small"
                                type="text"
                                value={workshopData.workshop_code}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tên xưởng:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="workshop_name"
                                size="small"
                                type="text"
                                value={workshopData.workshop_name}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Số người làm:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="default_no_worker"
                                size="small"
                                type="number"
                                value={workshopData.default_no_worker}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>

                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Số giờ làm:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="default_no_working_hour"
                                size="small"
                                type="number"
                                value={workshopData.default_no_working_hour}
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Địa chỉ:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                variant="outlined"
                                name="address"
                                value={workshopData.address}
                                size="small"
                                type="text"
                                onChange={handleChanges}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItem} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Tỉnh thành:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                select
                                fullWidth
                                variant="outlined"
                                name="province_id"
                                value={workshopData?.province_id || ''}
                                size="small"
                                onChange={handleChanges}
                              >
                                {provinces.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.value}
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
                                checked={workshopData.is_active || true}
                                onChange={(e) => setWorkshopData({ ...workshopData, is_active: e.target.checked })}
                                color="primary"
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
              <Grid item>
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
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default WorkshopModal;
