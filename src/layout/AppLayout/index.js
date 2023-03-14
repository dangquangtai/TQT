import React from 'react';
import { makeStyles, AppBar, CssBaseline, Toolbar } from '@material-ui/core';
import { drawerWidth } from './../../store/constant';
import Header from './../MainLayout/Header/index';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    width: '100%',
    minHeight: '100vh',
    flexGrow: 1,
    /*padding: theme.spacing(3),*/
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  main: {
    padding: '20px 40px',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  header: {
    zIndex: 1201,
  },
}));

const AppLayout = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.header}>
          <Toolbar>
            <Header />
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.main}>{children}</div>
        </main>
      </div>
      <div style={{}}>
        <center style={{ color: 'black', fontFamily: `'Roboto', sans-serif` }}>(C) 2023, Bản quyền công ty TNHH TQT</center>
      </div>
    </>
  );
};

export default AppLayout;
