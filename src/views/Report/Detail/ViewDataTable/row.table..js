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
const usetableStyles = makeStyles({
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
    '& td': {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
      width: '15%',
    },
    '& th': {
      // border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
      fontWeight: 'bold',
      backgroundColor: '#f2f2f2',
      // width: '15%',
    },
    '& .center': {
      textAlign: 'center',
      '& td': {
        width: '50%',
      },
    },
  },
  '& td': {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    width: '15%',
    '&.sl-cell': {
      width: 'calc(10% / 2)',
    },
  },
  '& th': {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    width: '10%',
  },
});

const Row = (props) => {
  const [listSupplier, setListSupplier] = useState([]);
  const [listPart, setListPart] = useState([]);
  const dispatch = useDispatch();
  const { row, reportType, listColDetail, fromDate, toDate, reportID, index } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const classesTable = usetableStyles();
  const handleDownload = (url) => {
    if (!url) {
      handleOpenSnackbar('error', 'Không tìm thấy file!');
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
  const handleDownloadFile = async (part_id, supplier_id, product_id, customer_id, customer_order_id) => {
    console.log(part_id);
    const url = await addMaterialReportFileToReport({
      from_date: fromDate,
      to_date: toDate,
      report_id: reportID,
      supplier_id_list: [supplier_id],
      part_id_list: [part_id],
      product_code_list: [product_id],
      customer_code_list: [customer_id],
      customer_order_code_list: [customer_order_id],
      is_synthetic: false,
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
        order_date,
        received_quantity_in_piece,
        notes,
      } = row;
      return (
        <>
          <TableCell align="left">{order_date ? order_date : ''}</TableCell>
          <TableCell align="left">{supplier_name ? supplier_name : ''}</TableCell>
          <TableCell align="left">{order_code ? order_code : ''}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{quantity_in_piece ? quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{customer_order_code ? production_date : ''}</TableCell>
          <TableCell align="left">{customer_order_code ? customer_order_code : ''}</TableCell>
          <TableCell align="left">{status_display ? status_display : ''}</TableCell>
          <TableCell align="left">{delivery_date ? delivery_date : ''}</TableCell>
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
        unit_price,
        sum_price,
      } = row;
      return (
        <>
          <TableCell align="left">{category_name ? category_name : ''}</TableCell>
          <TableCell align="left">{supplier_name ? supplier_name : ''}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{beginning_quantity_in_piece ? beginning_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{broken_beginning_quantity_in_piece ? broken_beginning_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{received_quantity_in_piece ? received_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{broken_received_quantity_in_piece ? broken_received_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{requisition_quantity_in_piece ? requisition_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{broken_requisition_quantity_in_piece ? broken_requisition_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{inventory_quantity_in_piece ? inventory_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{broken_inventory_quantity_in_piece ? broken_inventory_quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{unit_price ? unit_price : ''}</TableCell>
          <TableCell align="left">{sum_price ? sum_price : ''}</TableCell>
        </>
      );
    }
    if (reportType === 'KH_SAN_XUAT') {
      const {
        order_date,
        customer_order_code,
        product_code,
        product_customer_code,
        unit_name,
        quantity_in_box,
        number_of_worker,
        number_of_working_hour,
        wattage,
        status_display,
        list_specific_supplier_string,
      } = row;
      return (
        <>
          <TableCell align="left">{order_date ? order_date : ''}</TableCell>
          <TableCell align="left">{customer_order_code ? customer_order_code : ''}</TableCell>
          <TableCell align="left">{product_code ? product_code : ''}</TableCell>
          <TableCell align="left">{product_customer_code ? product_customer_code : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{quantity_in_box ? quantity_in_box : 0}</TableCell>
          <TableCell align="left">{number_of_worker ? number_of_worker : 0}</TableCell>
          <TableCell align="left">{number_of_working_hour ? number_of_working_hour : 0}</TableCell>
          <TableCell align="left">{wattage ? wattage : 0}</TableCell>
          <TableCell align="left">{status_display ? status_display : ''}</TableCell>
          <TableCell align="left">{list_specific_supplier_string ? list_specific_supplier_string : ''}</TableCell>
        </>
      );
    }
    if (reportType === 'BAO_CAO_THUC_TE_SAN_XUAT') {
      const {
        production_date,
        order_code,
        product_customer_code,
        product_code,
        product_name,
        unit_name,
        plan_quantity_in_box,
        reality_quantity_in_box,
        status_display,
      } = row;
      return (
        <>
          <TableCell align="left">{production_date ? production_date : ''}</TableCell>
          <TableCell align="left">{order_code ? order_code : ''}</TableCell>
          <TableCell align="left">{product_customer_code ? product_customer_code : ''}</TableCell>
          <TableCell align="left">{product_code ? product_code : ''}</TableCell>
          <TableCell align="left">{product_name ? product_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{plan_quantity_in_box ? plan_quantity_in_box : 0}</TableCell>
          <TableCell align="left">{reality_quantity_in_box ? reality_quantity_in_box : 0}</TableCell>
          <TableCell align="left">{status_display ? status_display : ''}</TableCell>
        </>
      );
    }
    if (reportType === 'TONG_HOP_TON_KHO_THANH_PHAM') {
      const {
        product_customer_code,
        product_code,
        product_name,
        unit_name,
        order_code,
        initial_quantity_in_box,
        received_quantity_in_box,
        requisition_quantity_in_box,
        final_quantity_in_box,
      } = row;
      return (
        <>
          <TableCell align="left">{product_customer_code ? product_customer_code : ''}</TableCell>
          <TableCell align="left">{product_code ? product_code : ''}</TableCell>
          <TableCell align="left">{product_name ? product_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{order_code ? order_code : ''}</TableCell>
          <TableCell align="left">{initial_quantity_in_box ? initial_quantity_in_box : ''}</TableCell>
          <TableCell align="left">{received_quantity_in_box ? received_quantity_in_box : 0}</TableCell>
          <TableCell align="left">{requisition_quantity_in_box ? requisition_quantity_in_box : 0}</TableCell>
          <TableCell align="left">{final_quantity_in_box ? final_quantity_in_box : ''}</TableCell>
        </>
      );
    }
    if (reportType === 'BAO_CAO_SU_DUNG_VAT_TU_NHA_CUNG_CAP') {
      const { part_code, part_name, unit_name, used_quantity_in_piece, detail } = row;
      return (
        <>
          <TableCell align="left">{index + 1}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left">{detail.length && detail[0]?.supplier_name ? detail[0].supplier_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{used_quantity_in_piece ? used_quantity_in_piece : 0}</TableCell>
        </>
      );
    }
    if (reportType === 'BAO_CAO_SU_DUNG_VAT_TU_THEO_DON_HANG') {
      const { part_id, part_code, part_name } = row;
      return (
        <>
          <TableCell align="left">{index + 1}</TableCell>
          <TableCell align="left">{part_id ? part_id : ''}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left"></TableCell>
        </>
      );
    }
    if (reportType === 'BAO_CAO_THUA_THIEU_VAT_TU_NHA_CUNG_CAP') {
      const { difference_quantity_in_piece, part_code, part_name, unit_name } = row;
      return (
        <>
          <TableCell align="left">{index + 1}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{difference_quantity_in_piece ? difference_quantity_in_piece : 0}</TableCell>
          <TableCell align="left"></TableCell>
          <TableCell align="left"></TableCell>
        </>
      );
    }
    if (reportType === 'BAO_CAO_THEO_DOI_HOP_DONG' || 'BAO_CAO_THEO_DOI_HOP_DONG_THANH_PHAM') {
      const { contract_date, contract_code, part_code, part_name, unit_name, quantity_in_piece, remain_quantity_in_piece, unit_price } =
        row;
      return (
        <>
          <TableCell align="left">{contract_date ? contract_date : ''}</TableCell>
          <TableCell align="left">{contract_code ? contract_code : ''}</TableCell>
          <TableCell align="left">{part_code ? part_code : ''}</TableCell>
          <TableCell align="left">{part_name ? part_name : ''}</TableCell>
          <TableCell align="left">{unit_name ? unit_name : ''}</TableCell>
          <TableCell align="left">{quantity_in_piece ? quantity_in_piece : ''}</TableCell>
          <TableCell align="left">{unit_price ? unit_price : ''}</TableCell>
          <TableCell align="left">{quantity_in_piece ? quantity_in_piece - remain_quantity_in_piece : 0}</TableCell>
          <TableCell align="left">{remain_quantity_in_piece ? remain_quantity_in_piece : ''}</TableCell>
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
            {[
              'TONG_HOP_TON_KHO_VAT_TU',
              'TONG_HOP_TON_KHO_THANH_PHAM',
              'KH_GIAO_HANG_CHO_KHACH',
              'BAO_CAO_SU_DUNG_VAT_TU_NHA_CUNG_CAP',
              'BAO_CAO_THEO_DOI_HOP_DONG',
              'BAO_CAO_THEO_DOI_HOP_DONG_THANH_PHAM',
              'BAO_CAO_THUA_THIEU_VAT_TU_NHA_CUNG_CAP',
              'BAO_CAO_THUC_TE_SAN_XUAT',
            ].includes(reportType) && (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => handleDownloadFile(row.part_id, row.supplier_id, row.product_id, row.customer_id, row.customer_order_id)}
              >
                <GetAppIcon></GetAppIcon>
              </IconButton>
            )}
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
                        <React.Fragment key={index}>
                          {['Tồn đầu', 'Nhập', 'Xuất', 'Tồn cuối'].includes(Coldt) && reportType === 'TONG_HOP_TON_KHO_VAT_TU' ? (
                            <TableCell colSpan={2} align="center" style={{ width: '10%' }}>
                              {Coldt}
                              <TableRow>
                                <TableCell align="center">&nbsp;&nbsp;&nbsp; SL A&nbsp;&nbsp;</TableCell>
                                <TableCell align="center">SL hỏng</TableCell>
                              </TableRow>
                            </TableCell>
                          ) : (
                            <TableCell align="left">{Coldt}</TableCell>
                          )}
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.detail?.map((detailitm) => (
                      <TableRow>
                        {reportType === 'KH_GIAO_HANG_CHO_KHACH' && (
                          <>
                            <TableCell>{detailitm.product__code}</TableCell>
                            <TableCell>{detailitm.product__customer__code}</TableCell>
                            <TableCell>{detailitm.product__name}</TableCell>
                            <TableCell>{detailitm.unit__name}</TableCell>
                            <TableCell>{detailitm.quantity__in__box || 0}</TableCell>
                            <TableCell>{detailitm.production_quantity_in_box || 0}</TableCell>
                            <TableCell>{detailitm.order_quantity_in_box || 0}</TableCell>
                            <TableCell>{detailitm.specific_list_supplier_string}</TableCell>
                          </>
                        )}
                        {reportType === 'TONG_HOP_TON_KHO_VAT_TU' && (
                          <>
                            <TableCell>{detailitm.order_date}</TableCell>
                            <TableCell>{detailitm.category_name}</TableCell>
                            <TableCell>{detailitm.supplier_name}</TableCell>
                            <TableCell>{detailitm.part_code}</TableCell>
                            <TableCell>{detailitm.part_name || 0}</TableCell>
                            <TableCell>{detailitm.unit_name}</TableCell>
                            <TableCell>{detailitm.explain}</TableCell>
                            <TableCell>{detailitm.beginning_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.broken_beginning_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.received_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.broken_received_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.requisition_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.broken_requisition_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.inventory_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.broken_inventory_quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.unit_price}</TableCell>
                            <TableCell>{detailitm.sum_price}</TableCell>
                          </>
                        )}
                        {reportType === 'TONG_HOP_TON_KHO_THANH_PHAM' && (
                          <>
                            <TableCell>{detailitm.order_date}</TableCell>
                            <TableCell>{detailitm.product_customer_code}</TableCell>
                            <TableCell>{detailitm.product_code}</TableCell>
                            <TableCell>{detailitm.product_name}</TableCell>
                            <TableCell>{detailitm.unit_name}</TableCell>
                            <TableCell>{detailitm.explain}</TableCell>
                            <TableCell>{detailitm.order_code}</TableCell>
                            <TableCell>{detailitm.initial_quantity_in_box || 0}</TableCell>
                            <TableCell>{detailitm.received_quantity_in_box || 0}</TableCell>
                            <TableCell>{detailitm.requisition_quantity_in_box || 0}</TableCell>
                            <TableCell>{detailitm.final_quantity_in_box || 0}</TableCell>
                          </>
                        )}
                        {reportType === 'BAO_CAO_SU_DUNG_VAT_TU_NHA_CUNG_CAP' && (
                          <>
                            <TableCell>{detailitm.order_date}</TableCell>
                            <TableCell>{detailitm.part_code}</TableCell>
                            <TableCell>{detailitm.part_name}</TableCell>
                            <TableCell>{detailitm.unit_name}</TableCell>
                            <TableCell>{detailitm.explain}</TableCell>
                            <TableCell>{detailitm.customer_order_code}</TableCell>
                            <TableCell>{detailitm.product_customer_code}</TableCell>
                            <TableCell>{detailitm.product_code}</TableCell>
                            <TableCell>{detailitm.used_quantity_in_piece || 0}</TableCell>
                          </>
                        )}
                        {(reportType === 'BAO_CAO_THEO_DOI_HOP_DONG' || reportType === 'BAO_CAO_THEO_DOI_HOP_DONG_THANH_PHAM') && (
                          <>
                            <TableCell>{detailitm.supplier_code}</TableCell>
                            <TableCell>{detailitm.supplier_name}</TableCell>
                            <TableCell>{detailitm.contract_code}</TableCell>
                            <TableCell>{detailitm.part_code}</TableCell>
                            <TableCell>{detailitm.part_name}</TableCell>
                            <TableCell>{detailitm.quantity_in_piece}</TableCell>
                            <TableCell>{detailitm.unit_name}</TableCell>
                            <TableCell>{detailitm.unit_price}</TableCell>
                            <TableCell>{detailitm.received_date}</TableCell>
                            <TableCell>{detailitm.received_quantity_in_piece}</TableCell>
                          </>
                        )}
                        {reportType === 'BAO_CAO_SU_DUNG_VAT_TU_THEO_DON_HANG' && (
                          <>
                            <TableCell>{detailitm.part_code}</TableCell>
                            <TableCell>{detailitm.part_name}</TableCell>
                            <TableCell>{detailitm.supplier_name}</TableCell>
                            <TableCell>{detailitm.unit_name}</TableCell>
                            <TableCell>{detailitm.used_quantity_in_piece}</TableCell>
                          </>
                        )}
                        {reportType === 'BAO_CAO_THUA_THIEU_VAT_TU_NHA_CUNG_CAP' && (
                          <>
                            {detailitm.production_date ? <TableCell>{detailitm.production_date}</TableCell> : <TableCell></TableCell>}
                            {detailitm.explain ? <TableCell>{detailitm.explain}</TableCell> : <TableCell></TableCell>}
                            {detailitm.unit_name ? <TableCell>{detailitm.unit_name}</TableCell> : <TableCell></TableCell>}
                            {detailitm.difference_quantity_in_piece ? (
                              <TableCell>{detailitm.difference_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                          </>
                        )}
                        {reportType === 'BAO_CAO_THUC_TE_SAN_XUAT' && (
                          <>
                            {detailitm.part_code ? <TableCell>{detailitm.part_code}</TableCell> : <TableCell></TableCell>}
                            {detailitm.part_name ? <TableCell>{detailitm.part_name}</TableCell> : <TableCell></TableCell>}
                            {detailitm.supplier_name ? <TableCell>{detailitm.supplier_name}</TableCell> : <TableCell></TableCell>}
                            {detailitm.requisition_quantity_in_piece ? (
                              <TableCell>{detailitm.requisition_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.cosumed_quantity_in_piece ? (
                              <TableCell>{detailitm.cosumed_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.received_quantity_in_piece ? (
                              <TableCell>{detailitm.received_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.dirty_quantity_in_piece ? (
                              <TableCell>{detailitm.dirty_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.weaving_for_sale_quantity_in_piece ? (
                              <TableCell>{detailitm.weaving_for_sale_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.weaving_for_return_quantity_in_piece ? (
                              <TableCell>{detailitm.weaving_for_return_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.sewing_error_quantity_in_piece ? (
                              <TableCell>{detailitm.sewing_error_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.eraser_error_quantity_in_piece ? (
                              <TableCell>{detailitm.eraser_error_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.torn_quantity_in_piece ? (
                              <TableCell>{detailitm.torn_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.broken_quantity_in_piece ? (
                              <TableCell>{detailitm.broken_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.broken_quantity_in_piece_percent ? (
                              <TableCell>{detailitm.broken_quantity_in_piece_percent}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                            {detailitm.difference_quantity_in_piece ? (
                              <TableCell>{detailitm.difference_quantity_in_piece}</TableCell>
                            ) : (
                              <TableCell></TableCell>
                            )}
                          </>
                        )}
                      </TableRow>
                    ))}
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
