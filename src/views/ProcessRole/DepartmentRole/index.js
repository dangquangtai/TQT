import React, { useEffect, useState } from 'react';
import {

  Tooltip,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,


} from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import useView from '../../../hooks/useView';
import { useStyles } from './../../Table/style';
import useDepartment from '../../../hooks/useDepartment';

const ProcessRoleDeptModal = (props) => {
  const {
    process_role_code_selected,
    handleRemoveDept,
    buttonRemoveDeptRole,
    changeDeptReload
  } = props;
  const classes = useStyles();

  const [DeptList, setDeptList] = React.useState([]);
  const { getDeptListByProcessRole } = useDepartment();
  useEffect(() => {
    const fetchData = async () => {
      let data = await getDeptListByProcessRole(process_role_code_selected, 1, 50);
      setDeptList(data);
    }
    fetchData()
  }, [process_role_code_selected, changeDeptReload]);

  return (

    <React.Fragment>

      <TableContainer>
        <Table
          stickyHeader
          className={classes.table3}
          aria-labelledby="tableTitle"
          size={'medium'}
        // aria-label="enhanced table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Phòng ban</TableCell>
              <TableCell>Chức vụ</TableCell>
              <TableCell align="right" ><span style={{ minWidth: 100, maxWidth: 100 }}></span></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DeptList?.map((row, index) => {

              return (
                <TableRow
                  className={classes.tableRow}
                  hover

                  tabIndex={-1}
                  key={row.key}

                >


                  <TableCell align="left">
                    <div className={classes.tableItemID} >
                      <div>{row.value.split('-')[0]}</div>

                    </div>
                  </TableCell>


                  <TableCell align="left">
                    <>
                      <span
                        className={classes.tableItemID}
                      >
                        <div>{row.value.split('-')[1]}</div>
                      </span>
                    </>
                  </TableCell>
                  <TableCell>
                    {buttonRemoveDeptRole &&(
                      <Tooltip title={buttonRemoveDeptRole.text}>
                      <Button
                        className={`${classes.handleButton} ${classes.handleButtonNote}`}
                        onClick={()=>handleRemoveDept(row.id)}
                      >
                        <RemoveCircleOutlineIcon className={classes.noteButtonIcon} />
                      </Button>
                    </Tooltip>
                    )}
                    
                  </TableCell>
                </TableRow>

              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default ProcessRoleDeptModal;
