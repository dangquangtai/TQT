import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import GetAppIcon from '@material-ui/icons/GetApp';
import { addMaterialReportFileToReport } from '../../../../services/api/Report/MaterialReport';
import { FLOATING_MENU_CHANGE, SNACKBAR_OPEN, DOCUMENT_CHANGE, CONFIRM_CHANGE } from './../../../../store/actions';
import { downloadFile } from '../../../../utils/helper';
import { useDispatch } from 'react-redux';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const Row = (props) => {
  const [listSupplier, setListSupplier] = useState([]);
  const [listPart, setListPart] = useState([]);
  const dispatch = useDispatch();
  const { row, reportType, listColDetail, fromDate, toDate, reportID } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Khôn   g tìm thấy file!');
      return;
    }
    downloadFile(url);
    handleOpenSnackbar('success', 'Tải file thành công!');
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
  const handleDownloadFile = async (part_id, supplier_id) => {
    console.log(part_id);
    const url = await addMaterialReportFileToReport({
      from_date: fromDate,
      to_date: toDate,
      report_id: reportID,
      supplier_id_list: [supplier_id],
      part_id_list: [part_id],
      product_code_list: [],
      customer_code_list: [],
    });
    dispatch({ type: DOCUMENT_CHANGE, documentType: 'materialReport' });
    handleDownload(url);
  };
  const renderHeading = (row) => {
    if (reportType === 'KH_GIAO_HANG_CHO_NHA_CUNG_CAP') {
      const {
        delivery_date,
        supplier_name,
        order_code,
        part_code,
        part_name,
        unit_name,
        quantity_in_piece,
        production_date,
        customer_order_code,
        status_display,
        received_quantity_in_piece,
        notes,
      } = row;
      return (
        <>
          <TableCell align="left">{delivery_date ? delivery_date : ''}</TableCell>
          <TableCell align="left">{supplier_name ? supplier_name : ''}</TableCell>
          <TableCell align="left">{order_code ? order_code : ''}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{quantity_in_piece ? quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{production_date ? production_date : ''}</TableCell>
          <TableCell align="left">{customer_order_code ? customer_order_code : ''}</TableCell>
          <TableCell align="left">{status_display ? status_display : ''}</TableCell>
          <TableCell align="left">{received_quantity_in_piece ? received_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{notes ? notes : ''}</TableCell>
        </>
      );
    }
    if (reportType === 'KH_GIAO_HANG_CHO_KHACH') {
      const { customer__name, order__code, deliver__address, order__date, order__status__display } = row;
      return (
        <>
          <TableCell align="left">{customer__name ? customer__name : ''}</TableCell>
          <TableCell align="left">{order__code ? order__code : ''}</TableCell>
          <TableCell align="left">{deliver__address ? deliver__address : ''}</TableCell>
          <TableCell align="left">{order__date ? order__date : ''}</TableCell>
          <TableCell align="left">{order__status__display ? order__status__display : ''}</TableCell>
        </>
      );
    }
    if (reportType === 'TONG_HOP_TON_KHO_VAT_TU') {
      const {
        category_name,
        supplier_name,
        part_code,
        part_name,
        unit_name,
        beginning_quantity_in_piece,
        broken_beginning_quantity_in_piece,
        received_quantity_in_piece,
        broken_received_quantity_in_piece,
        requisition_quantity_in_piece,
        broken_requisition_quantity_in_piece,
        inventory_quantity_in_piece,
        broken_inventory_quantity_in_piece,
      } = row;
      return (
        <>
          <TableCell align="left">{category_name ? category_name : ''}</TableCell>
          <TableCell align="left">{supplier_name ? supplier_name : ''}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{beginning_quantity_in_piece ? beginning_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{broken_beginning_quantity_in_piece ? broken_beginning_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{received_quantity_in_piece ? received_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{broken_received_quantity_in_piece ? broken_received_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{requisition_quantity_in_piece ? requisition_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{broken_requisition_quantity_in_piece ? broken_requisition_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{inventory_quantity_in_piece ? inventory_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{broken_inventory_quantity_in_piece ? broken_inventory_quantity_in_piece : 0}</TableCell>
        </>
      );
    }
  };

  const isDetail = row.detail && row.detail.length > 0;

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <>
            {isDetail && (
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
            <IconButton aria-label="expand row" size="small" onClick={() => handleDownloadFile(row.part_id, row.supplier_id)}>
              <GetAppIcon></GetAppIcon>
            </IconButton>
          </>
        </TableCell>
        {renderHeading(row)}
      </TableRow>

      {isDetail && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={17}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {listColDetail?.map((Coldt, index) => (
                        <TableCell>{Coldt}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.detail?.map((detailitm) =>
                      reportType === 'KH_GIAO_HANG_CHO_KHACH' ? (
                        <TableRow>
                          {detailitm.product__code ? <TableCell>{detailitm.product__code}</TableCell> : <TableCell></TableCell>}
                          {detailitm.product__customer__code ? (
                            <TableCell>{detailitm.product__customer__code}</TableCell>
                          ) : (
                            <TableCell></TableCell>
                          )}
                          {detailitm.product__name ? <TableCell>{detailitm.product__name}</TableCell> : <TableCell></TableCell>}
                          {detailitm.unit__name ? <TableCell>{detailitm.unit__name}</TableCell> : <TableCell></TableCell>}
                          {detailitm.quantity__in__box ? <TableCell>{detailitm.quantity__in__box}</TableCell> : <TableCell>0</TableCell>}
                          {detailitm.production_quantity_in_box ? (
                            <TableCell>{detailitm.production_quantity_in_box}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.order_quantity_in_box ? (
                            <TableCell>{detailitm.order_quantity_in_box}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.specific_list_supplier_string ? (
                            <TableCell>{detailitm.specific_list_supplier_string}</TableCell>
                          ) : (
                            <TableCell></TableCell>
                          )}
                        </TableRow>
                      ) : reportType === 'TONG_HOP_TON_KHO_VAT_TU' ? (
                        <TableRow>
                          {detailitm.order_date ? <TableCell>{detailitm.order_date}</TableCell> : <TableCell></TableCell>}
                          {detailitm.category_name ? <TableCell>{detailitm.category_name}</TableCell> : <TableCell></TableCell>}
                          {detailitm.supplier_name ? <TableCell>{detailitm.supplier_name}</TableCell> : <TableCell></TableCell>}
                          {detailitm.part_code ? <TableCell>{detailitm.part_code}</TableCell> : <TableCell></TableCell>}
                          {detailitm.part_name ? <TableCell>{detailitm.part_name}</TableCell> : <TableCell>0</TableCell>}
                          {detailitm.unit_name ? <TableCell>{detailitm.unit_name}</TableCell> : <TableCell></TableCell>}
                          {detailitm.explain ? <TableCell>{detailitm.explain}</TableCell> : <TableCell></TableCell>}
                          {detailitm.beginning_quantity_in_piece ? (
                            <TableCell>{detailitm.beginning_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.broken_beginning_quantity_in_piece ? (
                            <TableCell>{detailitm.broken_beginning_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.received_quantity_in_piece ? (
                            <TableCell>{detailitm.received_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.broken_received_quantity_in_piece ? (
                            <TableCell>{detailitm.broken_received_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.requisition_quantity_in_piece ? (
                            <TableCell>{detailitm.requisition_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.broken_requisition_quantity_in_piece ? (
                            <TableCell>{detailitm.broken_requisition_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.inventory_quantity_in_piece ? (
                            <TableCell>{detailitm.inventory_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                          {detailitm.broken_inventory_quantity_in_piece ? (
                            <TableCell>{detailitm.broken_inventory_quantity_in_piece}</TableCell>
                          ) : (
                            <TableCell>0</TableCell>
                          )}
                        </TableRow>
                      ) : undefined
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default Row;
