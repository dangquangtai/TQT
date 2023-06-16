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
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});
const TableCollapse = (props) => {
  const { row, index, handleChangeMaterial, handleChangeMaterialCode, handleDeleteMaterial, isDisabled, classes } = props;
  const [open, setOpen] = React.useState(false);
  const { materials } = useSelector((state) => state.metadata);
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
        <TableCell align="left" style={{ width: '20%' }}>
          <Autocomplete
            options={materials}
            getOptionLabel={(option) => option.part_code || ''}
            fullWidth
            size="small"
            disabled={isDisabled}
            value={materials.find((item) => item.part_code === row.part_code) || null}
            onChange={(event, newValue) => handleChangeMaterialCode(index, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
          />
        </TableCell>
        <TableCell align="left" className={classes.maxWidthCell} style={{ width: '25%' }}>
          <Tooltip title={row?.part_name}>
            <Autocomplete
              options={materials}
              getOptionLabel={(option) => option.title || ''}
              fullWidth
              size="small"
              disabled={isDisabled}
              value={materials.find((item) => item.part_code === row.part_code) || null}
              onChange={(event, newValue) => handleChangeMaterialCode(index, newValue)}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </Tooltip>
        </TableCell>
        <TableCell align="left" style={{ width: '15%' }}>
          <TextField
            InputProps={{
              inputProps: { min: 0 },
            }}
            fullWidth
            variant="outlined"
            name="quantity_in_piece"
            type="number"
            size="small"
            disabled={isDisabled}
            value={row?.quantity_in_piece || ''}
            onChange={(e) => handleChangeMaterial(index, e)}
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
                        <TableCell style={{ width: '10%' }}>{detail.remain_quantity_in_piece}</TableCell>
                        <TableCell style={{ width: '10%' }}>
                          {row.received_order_date ? format(new Date(row.received_order_date), 'dd/MM/yyyy') : ''}
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
