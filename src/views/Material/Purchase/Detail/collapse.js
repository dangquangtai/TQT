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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { format } from 'date-fns';
import { ContractService } from './../../../../services/api/Material/Contract';
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});
const TableCollapse = (props) => {
  const { row, index, isDisabled, isDetail, classes, handleChangeContract, handleChangeMaterial, handleDeleteMaterial } = props;
  const [open, setOpen] = React.useState(false);
  const classesRow = useRowStyles();
  const [contracts, setContracts] = React.useState([]);

  const isCollapse = row?.received_detail?.length > 0;

  useEffect(() => {
    if (!row.part_id && isDetail) return;
    const fetch = async () => {
      const res = await ContractService.getBySupplierAndMaterial({ part_id: row.part_id, supplier_id: row.supplier_id });
      setContracts(res);
    };
    fetch();
  }, [isDetail, row.part_id, row.supplier_id]);

  return (
    <React.Fragment>
      <TableRow className={classesRow.root} key={index}>
        <TableCell style={{ width: '5%' }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" style={{ width: '5%' }}>
          {row?.order_code}
        </TableCell>
        <TableCell align="left" style={{ width: '12%' }}>
          <Tooltip title={row?.part_code}>
            <span>{row?.part_code}</span>
          </Tooltip>
        </TableCell>
        <TableCell align="left" className={classes.maxWidthCell} style={{ width: '15%' }}>
          <Tooltip title={row?.part_name}>
            <span>{row?.part_name}</span>
          </Tooltip>
        </TableCell>
        <TableCell align="left" style={{ width: '5%' }}>
          {row.quantity_in_piece}
        </TableCell>
        <TableCell align="left" style={{ width: '5%' }}>
          {row.unit_name}
        </TableCell>
        <TableCell align="left" className={classes.maxWidthCell} style={{ width: '13%' }}>
          {isDetail ? (
            <Tooltip title={`${row?.contract_title}(${row?.contract_code})`}>
              <span>{`${row?.contract_title}(${row?.contract_code})`}</span>
            </Tooltip>
          ) : (
            <Autocomplete
              options={contracts}
              getOptionLabel={(option) => option.title || ''}
              fullWidth
              size="small"
              value={contracts.find((item) => item.id === row.contract_id) || null}
              onChange={(event, newValue) => handleChangeContract(index, newValue)}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          )}
        </TableCell>
        <TableCell align="left" style={{ width: '5%' }}>
          {row.order_date ? format(new Date(row.order_date), 'dd/MM/yyyy') : ''}
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
            onChange={(e) => handleChangeMaterial(index, e)}
          />
        </TableCell>
        <TableCell align="left" style={{ width: '10%' }}>
          <TextField
            multiline
            minRows={1}
            fullWidth
            variant="outlined"
            name="notes2"
            type="text"
            size="small"
            value={row.notes2 || ''}
            onChange={(e) => handleChangeMaterial(index, e)}
          />
        </TableCell>
        <TableCell align="left" style={{ width: '5%' }}>
          {row.status_display}
        </TableCell>
        {!isDisabled && (
          <TableCell align="center" style={{ width: '5%' }}>
            <IconButton onClick={() => handleDeleteMaterial(index, row.id)}>
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
                      <TableCell>Mã phiếu nhập vật tư</TableCell>
                      <TableCell>Tên vật tư</TableCell>
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
                        <TableCell style={{ width: '25%' }}>{detail.part_name}</TableCell>
                        <TableCell style={{ width: '10%' }}>{detail.received_quantity_in_piece}</TableCell>
                        <TableCell style={{ width: '10%' }}>
                          {Number(detail.remain_quantity_in_piece) - Number(detail.received_quantity_in_piece)}
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
