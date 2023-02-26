import React from 'react';
import { Box, Grid, makeStyles, Hidden } from '@material-ui/core';

import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import CompanySelectionSection from './CompanySelectionSection';
import { drawerWidth, gridSpacing } from './../../../store/constant';
import logo from '../../../assets/svgs/logo.png';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FOLDER_CHANGE, PROJECT_CHANGE, SELECTED_APP_CHANGE } from './../../../store/actions';
import ProfileModal from './ProfileSection/profile';
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1.25),
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuIcon: {
    fontSize: '1.5rem',
  },
  logoSize: {
    width: '100%',
    height: '30px',
    objectFit: 'contain',
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLogoClick = () => {
    dispatch({
      type: SELECTED_APP_CHANGE,
      app: {},
    });
    dispatch({
      type: PROJECT_CHANGE,
      projects: [],
    });
    dispatch({
      type: FOLDER_CHANGE,
      folder: [],
    });
  };

  return (
    <React.Fragment>
      <Box width={200}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container alignItems="center" spacing={gridSpacing}>
              <Hidden smDown>
                <Grid item>
                  <Box mt={0.5}>
                    <RouterLink to="/dashboard/app" onClick={handleLogoClick}>
                      <img src={logo} alt="Logo" className={classes.logoSize} />
                    </RouterLink>
                  </Box>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
          <Grid item>
            {/* <IconButton
              edge="start"
              className={classes.menuButton}
              aria-label="open drawer"
              color="inherit"
              onClick={drawerToggle}
            >
              <MenuTwoToneIcon className={classes.menuIcon} />
            </IconButton> */}
          </Grid>
        </Grid>
      </Box>
      <ProfileModal />
      <CompanySelectionSection />
      <div className={classes.grow} />
      <NotificationSection />
      <ProfileSection />
    </React.Fragment>
  );
};

export default Header;
