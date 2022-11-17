import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, useMediaQuery, useTheme, Divider, Drawer, Grid, Hidden, Button } from '@material-ui/core';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import MenuList from './MenuList';

import logo from './../../../assets/images/logo.svg';
import { drawerWidth } from './../../../store/constant';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  toolbar: theme.mixins.toolbar,
  logoContainer: {
    lineHeight: 0,
    background: theme.palette.primary.main,
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.common.black,
    color: theme.palette.text.primary,
  },
  drawerPaperLight: {
    width: drawerWidth,
    borderRight: 'none',
    boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
    top: '64px',
    [theme.breakpoints.down('sm')]: {
      top: 0,
    },
  },
  menuCaption: {
    ...theme.typography.menuCaption,
  },
  ScrollHeight: {
    height: 'calc(100vh - 65px)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  closeDrawer: {
    [theme.breakpoints.up('md')]: {
      '& > div': {
        width: '100px',
        transform: 'unset !important',
        visibility: 'unset !important',
      },
    },
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
}));

const MainLayout = (props) => {
  const { drawerOpen, drawerToggle, window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const drawer = (
    <React.Fragment>
      <Hidden mdUp>
        <Grid
          container
          direction="row"
          justifyContent="center"
          elevation={5}
          alignItems="center"
          spacing={0}
          className={[classes.toolbar, classes.logoContainer].join(' ')}
        >
          <Grid item>
            <img src={logo} alt="Logo" />
          </Grid>
        </Grid>
      </Hidden>
      <Divider />
      <PerfectScrollbar className={classes.ScrollHeight}>
        <MenuList drawerOpen={drawerOpen} drawerToggle={drawerToggle} />
        <Button onClick={drawerToggle}>
          {drawerOpen ? (
            <Grid container direction="row" alignItems="center" justifyContent="flex-end">
              <DoubleArrowIcon className={classes.rotate} />
              <span>Thu gọn</span>
            </Grid>
          ) : (
            <DoubleArrowIcon />
          )}
        </Button>
      </PerfectScrollbar>
    </React.Fragment>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        className={drawerOpen ? '' : classes.closeDrawer}
        classes={{ paper: classes.drawerPaperLight }}
        ModalProps={{ keepMounted: true }}
        style={{}}
      >
        {drawer}
      </Drawer>
    </nav>
  );
};

export default MainLayout;
