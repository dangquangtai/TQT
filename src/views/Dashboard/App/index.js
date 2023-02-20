import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useProject from './../../../hooks/useProject';
import { gridSpacing } from './../../../store/constant';
import useShare from '../../../hooks/useShare.js';
import AppCard from './Card/index';

const App = () => {
  const { apps } = useSelector((state) => state.app);
  const { getApps } = useProject();
  const { getMetadata } = useShare();

  React.useEffect(() => {
    setTimeout(() => {
      getApps();
      getMetadata();
    }, 0);
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Grid container spacing={gridSpacing} alignItems="stretch">
          {apps?.map((app) => {
            if (app?.projects?.length > 0) {
              return (
                <Grid key={app.app_code} item lg={4} sm={6} xs={12}>
                  <AppCard app={app} />
                </Grid>
              );
            } else {
              return null;
            }
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;
