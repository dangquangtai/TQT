import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import React from 'react';
import useView from '../../hooks/useView';
import { FLOATING_MENU_CHANGE } from '../../store/actions';
import { view } from '../../store/constant';
import { useDispatch } from 'react-redux';
import { SpeedDialAction } from '@material-ui/lab';
import CustomIcon from '../../layout/MainLayout/Sidebar/MenuList/CustomIcon/index';

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'fixed',
    right: '15px',
    bottom: '15px',
  },
}));

export default function FloatingMenu() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { float_buttons: floatButtons } = useView();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonCreateUser = floatButtons.find((button) => button.name === view.floating.create);

  const handleClickCreateUser = async () => {
    dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: true });
    setOpen(false);
  };

  return (
    <React.Fragment>
      {floatButtons.length > 0 && (
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {buttonCreateUser && (
            <SpeedDialAction
              key="create"
              icon={<CustomIcon name={buttonCreateUser.icon || ''} />}
              tooltipTitle={buttonCreateUser.text}
              tooltipOpen
              onClick={handleClickCreateUser}
            />
          )}
        </SpeedDial>
      )}
    </React.Fragment>
  );
}
