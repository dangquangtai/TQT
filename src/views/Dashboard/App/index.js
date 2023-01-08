import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import useProject from './../../../hooks/useProject';
import { SELECTED_APP_CHANGE } from './../../../store/actions';
import { gridSpacing } from './../../../store/constant';
import HoverCard from './HoverCard/index';
import useShare from '../../../hooks/useShare.js';
import AppCard from './Card/index';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.black,
    height: '100vh',
    minHeight: '100%',
  },
  backButton: {
    marginLeft: theme.spacing(2),
  },
  card: {
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%',
    },
    maxWidth: '475px',
    margin: '24px auto',
  },
  content: {
    padding: theme.spacing(5, 4, 3, 4),
  },
  forgot: {
    textDecoration: 'none',
    paddingLeft: '16px',
  },
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  logoSize: {
    width: '100%',
    height: '50px',
  },
  link: {
    textDecoration: 'none',
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { apps } = useSelector((state) => state.app);

  const { getApps } = useProject();

  const { getMetadata } = useShare();

  React.useEffect(() => {
    setTimeout(() => {
      getApps();
      getMetadata();
    }, 0);
  }, []);

  const handleAppClick = (app) => {
    dispatch({ type: SELECTED_APP_CHANGE, app });
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={12} md={12} lg={12}>
        {/* <Typography variant="h2" className={classes.margin}>
          TQT App Center
        </Typography> */}
        <Grid container spacing={gridSpacing} alignItems="center">
          {/* {apps?.map((app) => (
            <Grid key={app.app_code} item lg={4} sm={6} xs={12}>
              <RouterLink className={classes.link} to="/dashboard/default" onClick={() => handleAppClick(app)}>
                <HoverCard title={app.app_name} image={app.icon} color={app.color} />
              </RouterLink>
            </Grid>
          ))} */}
          {apps?.map((app) => (
            <Grid key={app.app_code} item lg={4} sm={6} xs={12}>
              <AppCard title={app.app_name} image={app.icon} color={app.color} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;
