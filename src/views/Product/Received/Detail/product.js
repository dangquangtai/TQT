import { IconButton, TableCell, TableRow, TextField, Tooltip } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ProductReceivedService } from '../../../../services/api/Product/Received.js';
import { FormattedNumber } from 'react-intl';
import NumberFormatCustom from '../../../../component/NumberFormatCustom/index.js';

const Product = ({ index, row, classes, isCompleted, handleChangeOrder, handleChangeProduct, handleDeleteProduct }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isCompleted) return;
    if (!row.product_id) return;
    const fetch = async () => {
      const res = await ProductReceivedService.getOrderByProduct(row.product_id);
      setOrders(res || []);
    };
    fetch();
  }, [isCompleted, row.product_id]);

  return (
    <TableRow>
      <TableCell align="left" style={{ width: '10%' }}>
        {row.product_code}
      </TableCell>
      <TableCell align="left" className={classes.maxWidthCell} style={{ width: '20%' }}>
        <Tooltip title={row?.product_name}>
          <span>{row?.product_name}</span>
        </Tooltip>
      </TableCell>
      <TableCell align="left" style={{ width: '5%' }}>
        {row.contract_code}
      </TableCell>
      <TableCell align="left" style={{ width: '5%' }}>
        <FormattedNumber value={row.unit_price || 0} />
      </TableCell>
      <TableCell align="left" style={{ width: '5%' }}>
        <FormattedNumber value={row.quantity_in_box || 0} />
      </TableCell>
      <TableCell align="left" style={{ width: '5%' }}>
        <FormattedNumber value={row.entered_quantity_in_box || 0} />
      </TableCell>
      <TableCell align="left" style={{ width: '5%' }}>
        <FormattedNumber value={row.remain_quantity_in_box || 0} />
      </TableCell>
      <TableCell align="left" style={{ width: '10%' }}>
        <TextField
          InputProps={{
            inputProps: { min: 0 },
            inputComponent: NumberFormatCustom,
          }}
          fullWidth
          variant="outlined"
          name="received_quantity_in_box"
          size="small"
          value={row?.received_quantity_in_box || ''}
          disabled={isCompleted}
          onChange={(e) => handleChangeProduct(index, e)}
        />
      </TableCell>
      <TableCell align="left" style={{ width: '5%' }}>
        {row.unit_name}
      </TableCell>
      <TableCell align="left" className={classes.maxWidthCell} style={{ width: '15%' }}>
        {isCompleted ? (
          <Tooltip title={row?.customer_order_code}>
            <span>{row?.customer_order_code}</span>
          </Tooltip>
        ) : (
          <Autocomplete
            options={orders}
            getOptionLabel={(option) => option.title || ''}
            fullWidth
            size="small"
            value={orders?.find((item) => item.id === row.customer_order_id) || null}
            onChange={(event, newValue) => handleChangeOrder(index, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
          />
        )}
      </TableCell>
      <TableCell align="left" style={{ width: '15%' }}>
        <TextField
          multiline
          minRows={1}
          fullWidth
          variant="outlined"
          name="notes"
          type="text"
          size="small"
          value={row.notes || ''}
          onChange={(e) => handleChangeProduct(index, e)}
        />
      </TableCell>
      {!isCompleted && (
        <TableCell align="center" style={{ width: '5%' }}>
          <IconButton onClick={() => handleDeleteProduct(index, row.id)}>
            <Delete />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

export default Product;
