import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    opacity: '0.5',
    background: 'gray',
    position: 'absolute',
    display: 'flex',
    top: '0',
    zIndex: '9999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    width: '80px !important',
    height: '80px !important',
  },
}));

const Loading = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} />
    </div>
  );
};

export default Loading;
