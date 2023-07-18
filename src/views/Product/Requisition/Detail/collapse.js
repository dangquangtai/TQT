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
import React, { useEffect } from 'react';
import { Delete } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { format } from 'date-fns';
import { ProductContractService } from './../../../../services/api/Product/Contract';
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
  const {
    row,
    index,
    handleChangeProduct,
    handleChangeProductCode,
    handleDeleteProduct,
    isDisabled,
    isDetail,
    classes,
    handleChangeContract,
  } = props;
  const [open, setOpen] = React.useState(false);
  const { products } = useSelector((state) => state.metadata);
  const classesRow = useRowStyles();
  const [contracts, setContracts] = React.useState([]);

  const isCollapse = row?.received_detail?.length > 0;

  useEffect(() => {
    if (isDisabled) return;
    if (!row.product_id) return;
    const fetch = async () => {
      const res = await ProductContractService.getBySupplierAndProduct({ product_id: row.product_id, supplier_id: row.supplier_id });
      setContracts(res);
    };
    fetch();
  }, [isDisabled, row.product_id, row.supplier_id]);

  return (
    <React.Fragment>
      <TableRow className={classesRow.root}>
        <TableCell style={{ width: '5%' }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: 200 }}>
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
        <TableCell style={{ width: 300 }}>
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
        <TableCell style={{ width: 150 }}>
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
        <TableCell>{row.unit_name}</TableCell>
        <TableCell>
          <Tooltip title={row?.contract_code}>
            {isDetail ? (
              <span>{row?.contract_code}</span>
            ) : (
              <Autocomplete
                options={contracts}
                getOptionLabel={(option) => option.contract_code || ''}
                fullWidth
                size="small"
                value={contracts.find((item) => item.contract_id === row.contract_id) || null}
                onChange={(event, newValue) => handleChangeContract(index, newValue)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
              />
            )}
          </Tooltip>
        </TableCell>
        {!isDetail && (
          <TableCell>
            <FormattedNumber value={row.remain_quantity_in_box || 0} />
          </TableCell>
        )}
        <TableCell>
          <FormattedNumber value={row.unit_price || 0} />
        </TableCell>
        <TableCell style={{ width: 200 }}>
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
        {isDetail && <TableCell>{row.status_display}</TableCell>}
        {!isDisabled && (
          <TableCell align="center">
            <IconButton onClick={() => handleDeleteProduct(index, row.id)}>
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
                      <TableCell>SL còn lại</TableCell>
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
                          {Number(detail.remain_quantity_in_box) - Number(detail.received_quantity_in_box)}
                        </TableCell>
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
