import React from 'react';

import {
  makeStyles,
  Fade,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@material-ui/icons/MeetingRoomTwoTone';
import PersonTwoToneIcon from '@material-ui/icons/PersonTwoTone';
import useAuth from '../../../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '350px',
    minWidth: '250px',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 0,
    borderRadius: '10px',
  },
  subHeader: {
    backgroundColor: theme.palette.grey.A400,
    color: theme.palette.common.white,
    padding: '5px 15px',
  },
  username: {
    color: theme.palette.common.black,
  },
  menuIcon: {
    fontSize: '1.5rem',
  },
  menuButton: {
    [theme.breakpoints.down('sm')]: {
      minWidth: '50px',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '35px',
    },
  },
}));

const ProfileSection = () => {
  const classes = useStyles();

  const [selectedIndex] = React.useState(1);
  const { logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const user = JSON.parse(window.localStorage.getItem('user'));
  const account = user?.account;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <React.Fragment>
      {/* <span
                className={classes.username}
            >
                { user ? user.fullname : '' }
            </span> */}
      <Button
        className={classes.menuButton}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      >
        <AccountCircleTwoToneIcon className={classes.menuIcon} />
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: {
            offset: {
              enable: true,
              offset: '0px, 10px',
            },
            preventOverflow: {
              padding: 0,
            },
          },
        }}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List component="nav" className={classes.root}>
                  <ListItem button>
                    <ListItemIcon>
                      <PersonTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary={account ? account.fullname : ''} />
                  </ListItem>
                  <ListItem button selected={selectedIndex === 4} onClick={handleLogout}>
                    <ListItemIcon>
                      <MeetingRoomTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default ProfileSection;
