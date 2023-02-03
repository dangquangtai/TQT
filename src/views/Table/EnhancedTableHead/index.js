import { Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
// import Breadcrumb from './../../component/Breadcrumb';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { headCells } from '../data';

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    displayOptions,
    documentType,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  if (documentType === 'mentor') {
    const index = headCells.findIndex((item) => item.id === 'fullname');
    if (index !== -1) headCells[index].label = 'Họ tên';
  }

  return (
    <TableHead>
      <TableRow>
        {documentType !== 'department' && documentType !== 'processrole' && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
              style={{ position: 'relative !important' }}
            />
          </TableCell>
        )}

        {headCells.map(
          (headCell) =>
            displayOptions[headCell.id] && (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
                style={{ maxWidth: headCell.maxWidth, position: 'relative' }}
              >
                {headCell.id === 'menuButtons' ? (
                  <></>
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                )}
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
