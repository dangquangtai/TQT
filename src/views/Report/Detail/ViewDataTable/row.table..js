import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const Row = (props) => {
  const { row, reportType, listColDetail } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

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
  };

  const isDetail = row.detail && row.detail.length > 0;

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          {isDetail && (
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        {renderHeading(row)}
      </TableRow>

      {isDetail && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                    {row?.detail?.map((detailitm) => (
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
