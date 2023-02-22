import React, { useEffect, useState } from 'react';
import { Button, Box, Modal, FormControl, MenuItem, TextField, Snackbar, Grid } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import useDepartment from './../../../hooks/useDepartment';
import useRole from './../../../hooks/useRole';

const style = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    boxShadow: 24,
    background: '#FFFFFF',
    borderRadius: '15px',
  },
  title: {
    padding: '16px 32px 20px',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  body: {
    padding: '0 32px',
  },
  form: {
    width: '100%',
    marginBottom: '20px',
  },
  marginTop: {
    marginTop: '20px',
  },
  buttonWrap: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 32px 16px',
  },
  button: {
    margin: '0 12px',
    background: '#FFC000',
  },
  closeButton: {
    margin: '0 12px',
    background: '#465169',
  },
  submitButton: {
    margin: '0 12px',
    background: '#612AFF',
  },
  error: {
    color: 'red',
  },
  formlabel: {
    fontWeight: 'bold',
  },
};

const RoleModal = ({ open, onSubmit, onClose }) => {
  const { getAllDepartment } = useDepartment();
  const { getRoletemplateByDept } = useRole();

  const [data, setData] = useState({
    department_code: '',
    role_template_code: '',
  });
  const [department, setDepartment] = useState([]);
  const [roleTemplate, setRoleTemplate] = useState([]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmmit = () => {
    onSubmit(data);
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllDepartment();
      setDepartment(result);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await getRoletemplateByDept(data.department_code);
  //     setRoleTemplate(result);
  //   };
  //   fetchData();
  // }, [data.department_code]);

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            Thêm mới
          </div>
          <div id="modal-modal-description" style={style.body}>
            <FormControl style={style.form}>
              <Autocomplete
                name="department_code"
                size="small"
                options={department}
                getOptionLabel={(option) => option.department_name}
                fullWidth
                onChange={(e, value) => {
                  setData({
                    ...data,
                    department_code: value.department_code,
                  });
                }}
                renderInput={(params) => <TextField {...params} label="Department" variant="outlined" />}
              />
              <TextField
                select
                label="Role Template"
                variant="outlined"
                size="small"
                name="role_template_code"
                onChange={handleChange}
                style={style.marginTop}
              >
                {roleTemplate?.map((item, i) => (
                  <MenuItem key={i} value={item.id}>
                    {item.value}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <div style={style.buttonWrap}>
              <Button type="button" variant="contained" style={style.closeButton} onClick={handleClose}>
                Đóng
              </Button>
              <Button type="submit" variant="contained" style={style.submitButton} onClick={handleSubmmit}>
                Lưu
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default RoleModal;
