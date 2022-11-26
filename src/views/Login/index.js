import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography, makeStyles, Grid } from '@material-ui/core';
import JWTLogin from './JWTLogin';

import Logo from './../../assets/svgs/logo_green.png';

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
    height: '30px',
  },
}));

const Login = () => {
  const classes = useStyles();

  return (
    <Grid container justifyContent="center" alignItems="center" className={classes.root}>
      <Grid item xs={11} sm={7} md={6} lg={4}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Grid container direction="column" spacing={4} justifyContent="center">
              <Grid item xs={12}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography color="textPrimary" gutterBottom variant="h2">
                      Đăng nhập
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Đăng nhập vào hệ thống
                    </Typography>
                  </Grid>
                  <Grid item>
                    <RouterLink to="/" className={classes.icon}>
                      <img alt="Auth method" src={Logo} className={classes.logoSize} />
                    </RouterLink>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <JWTLogin />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
