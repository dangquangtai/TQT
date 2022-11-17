import React from 'react';
import { makeStyles, Typography, Divider, Grid, useMediaQuery, useTheme } from '@material-ui/core';
import { Modal, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { gridSpacing } from '../../store/constant';
import { CONFIRM_CHANGE } from '../../store/actions';
import useConfirmPopup from '../../hooks/useConfirmPopup';

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
  },
  noteLabel: {
    marginTop: '20px',
    fontWeight: 'bold',
  },
  input: {},
  buttonWrap: {
    marginTop: '25px',
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

export default function ConfirmPupup() {
  const { open, message, title, action, payload, setConfirmPopup, onSuccess } = useConfirmPopup();

  const closeConfirmPopup = () => setConfirmPopup({ type: CONFIRM_CHANGE, open: false });

  const doAction = async () => {
    await action(payload);
    onSuccess();
    setConfirmPopup({ type: CONFIRM_CHANGE, open: false });
  };

  return (
    <Modal
      open={open}
      onClose={closeConfirmPopup}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box style={style.box}>
        <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
          {title}
        </div>
        <div id="modal-modal-description" style={style.body}>
          <div style={style.formlabel}>{message}</div>
          <Grid container justifyContent="center" spacing={gridSpacing} style={style.buttonWrap}>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={closeConfirmPopup}>
                Đóng
              </Button>
            </Grid>
            <Grid item>
              {!!action &&(
                <Button variant="contained" color="primary" onClick={doAction}>
                Xác nhận
              </Button>
              )}
              
            </Grid>
          </Grid>
        </div>
      </Box>
    </Modal>
  );
}
