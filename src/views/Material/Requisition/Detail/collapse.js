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
import { ContractService } from './../../../../services/api/Material/Contract';
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
    handleChangeMaterial,
    handleChangeMaterialCode,
    handleDeleteMaterial,
    isDisabled,
    isDetail,
    classes,
    handleChangeContract,
    contractList,
  } = props;
  const [open, setOpen] = React.useState(false);
  const { materials: metaMaterials } = useSelector((state) => state.metadata);
  const classesRow = useRowStyles();
  const [contracts, setContracts] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);

  const isCollapse = row?.received_detail?.length > 0;

  useEffect(() => {
    if (!row.part_id || row.contract_id) return;
    const fetch = async () => {
      const res = await ContractService.getBySupplierAndMaterial({ part_id: row.part_id, supplier_id: row.supplier_id });
      setContracts(res || []);
    };
    fetch();
  }, [row.part_id, row.supplier_id, row.contract_id]);

  useEffect(() => {
    if (!row.contract_id || row.part_id) return;
    const fetch = async () => {
      const res = await ContractService.getContractDetail(row.contract_id);
      setMaterials(res || []);
    };
    fetch();
  }, [row.part_id, row.contract_id]);

  useEffect(() => {
    if (!row.part_id) setContracts(contractList);
    if (!row.contract_id) setMaterials(metaMaterials);
  }, [contractList, metaMaterials, row.contract_id, row.part_id]);

  useEffect(() => {
    setMaterials(metaMaterials);
    setContracts(contractList);
  }, []);

  return (
    <React.Fragment>
      <TableRow className={classesRow.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: 180 }}>
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
        <TableCell style={{ width: 250 }}>
          <Tooltip title={row?.part_name || ''}>
            <Autocomplete
              options={materials}
              getOptionLabel={(option) => option.title || option.part_name || ''}
              fullWidth
              size="small"
              disabled={isDisabled}
              value={materials.find((item) => item.part_code === row.part_code) || null}
              onChange={(event, newValue) => handleChangeMaterialCode(index, newValue)}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </Tooltip>
        </TableCell>
        <TableCell style={{ width: 150 }}>
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
        <TableCell>{row.unit_name}</TableCell>
        <TableCell>
          <Tooltip title={row?.contract_code}>
            {isDisabled ? (
              <span>{row?.contract_code}</span>
            ) : (
              <Autocomplete
                options={contracts}
                getOptionLabel={(option) => option.contract_code || ''}
                fullWidth
                size="small"
                value={contracts.find((item) => item.contract_id || item.id === row.contract_id) || null}
                onChange={(event, newValue) => handleChangeContract(index, newValue)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
              />
            )}
          </Tooltip>
        </TableCell>
        {!isDetail && (
          <TableCell>
            <FormattedNumber value={row.remain_quantity_in_piece || 0} />
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
            onChange={(e) => handleChangeMaterial(index, e)}
          />
        </TableCell>
        <TableCell style={{ width: 150 }}>
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
        {isDetail && <TableCell>{row.status_display}</TableCell>}
        {!isDisabled && (
          <TableCell align="center">
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
                        <TableCell style={{ width: '10%' }}>
                          <FormattedNumber value={detail.received_quantity_in_piece || 0} />
                        </TableCell>
                        <TableCell style={{ width: '10%' }}>
                          <FormattedNumber
                            value={Number(detail.remain_quantity_in_piece) - Number(detail.received_quantity_in_piece) || 0}
                          />
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
