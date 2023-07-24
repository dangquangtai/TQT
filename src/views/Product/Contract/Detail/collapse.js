import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import { Delete } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { format } from 'date-fns';
import NumberFormatCustom from '../../../../component/NumberFormatCustom/index.js';
import { FormattedNumber } from 'react-intl';
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});
const TableCollapse = (props) => {
  const { row, index, handleChangeProduct, handleChangeProductCode, handleDeleteProduct, isDisabled, isDetail, classes } = props;
  const [open, setOpen] = React.useState(false);
  const { products } = useSelector((state) => state.metadata);
  const classesRow = useRowStyles();

  const isCollapse = row?.received_detail?.length > 0;

  return (
    <React.Fragment>
      <TableRow className={classesRow.root}>
        <TableCell style={{ width: '5%' }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" style={{ width: '15%' }}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.product_code || ''}
            fullWidth
            size="small"
            disabled={isDisabled}
            value={products.find((item) => item.product_code === row.product_code) || null}
            onChange={(event, newValue) => handleChangeProductCode(index, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
          />
        </TableCell>
        <TableCell align="left" className={classes.maxWidthCell} style={{ width: '20%' }}>
          <Tooltip title={row?.product_name}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.title || ''}
              fullWidth
              size="small"
              disabled={isDisabled}
              value={products.find((item) => item.product_code === row.product_code) || null}
              onChange={(event, newValue) => handleChangeProductCode(index, newValue)}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </Tooltip>
        </TableCell>
        <TableCell align="left">
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.product_customer_code || ''}
            fullWidth
            size="small"
            disabled={isDisabled}
            value={products.find((item) => item.product_code === row.product_code) || null}
            onChange={(event, newValue) => handleChangeProductCode(index, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
          />
        </TableCell>
        <TableCell align="left" style={{ width: '13%' }}>
          <TextField
            InputProps={{
              inputProps: { min: 0 },
              inputComponent: NumberFormatCustom,
            }}
            fullWidth
            variant="outlined"
            name="quantity_in_box"
            size="small"
            disabled={isDisabled}
            value={row?.quantity_in_box || ''}
            onChange={(e) => handleChangeProduct(index, e)}
          />
        </TableCell>
        {isDetail && (
          <>
            <TableCell align="left" style={{ width: '5%' }}>
              <FormattedNumber value={row.received_quantity_in_box} />
            </TableCell>
            <TableCell align="left" style={{ width: '5%' }}>
              <FormattedNumber value={row.remain_quantity_in_box} />
            </TableCell>
          </>
        )}
        <TableCell align="left" style={{ width: '12%' }}>
          <TextField
            InputProps={{
              inputProps: { min: 0 },
              inputComponent: NumberFormatCustom,
            }}
            fullWidth
            variant="outlined"
            name="unit_price"
            size="small"
            disabled={isDisabled}
            value={row?.unit_price || ''}
            onChange={(e) => handleChangeProduct(index, e)}
          />
        </TableCell>
        <TableCell align="left" style={{ width: '5%' }}>
          {row.unit_name}
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
        {!isDisabled && (
          <TableCell align="center" style={{ width: '5%' }}>
            <IconButton size="small" onClick={() => handleDeleteProduct(index, row.id)}>
              <Delete />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      {isCollapse && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small" aria-label="received detail">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Mã phiếu nhập thành phẩm</TableCell>
                      <TableCell>Tên thành phẩm</TableCell>
                      <TableCell>SL nhập</TableCell>
                      <TableCell>Ngày nhập</TableCell>
                      <TableCell>Ghi chú</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.received_detail?.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell style={{ width: '5%' }} />
                        <TableCell style={{ width: '20%' }}>{detail.received_order_code}</TableCell>{' '}
                        <TableCell style={{ width: '25%' }}>{detail.product_name}</TableCell>
                        <TableCell style={{ width: '10%' }}>{detail.received_quantity_in_box}</TableCell>
                        <TableCell style={{ width: '10%' }}>
                          {detail.received_order_date ? format(new Date(detail.received_order_date), 'dd/MM/yyyy') : ''}
                        </TableCell>
                        <TableCell>{detail.notes}</TableCell>
                        <TableCell />
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

export default TableCollapse;
