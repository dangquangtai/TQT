import React from 'react';
import { makeStyles, Card, CardContent, Grid, Typography, Button, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  revenuecard: {
    position: 'relative',
    color: '#fff',
  },
  img: {
    width: 'auto',
    height: '100px',
  },
  content: {
    marginTop: '30px',
  },
  abs: {
    position: 'absolute',
    top: '20px',
    right: 0,
    width: '50px',
    height: '15px',
    borderRadius: '5px 0 0 5px',
    boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
  },
}));

const AppCard = (props) => {
  const { title, description, image, color } = props;
  const classes = useStyles();

  return (
    <Card className={classes.revenuecard} style={{ backgroundColor: color }}>
      <CardContent>
        <Grid container justifyContent="center">
          <img className={classes.img} src={image} alt="app" />
        </Grid>
        <Grid container justifyContent="center" className={classes.content}>
          <Grid item>
            <Typography gutterBottom variant="h3" align="center">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              {description}
            </Typography>
          </Grid>
        </Grid>
        {/* <Grid container justifyContent="center">
          <Box mt={3}>
            <Button variant="contained" style={{ backgroundColor: color }}>
              <Link to="/dashboard/default" onClick={handleClick} style={{ textDecoration: 'none', color: 'white' }}>
                Vào ngay
              </Link>
            </Button>
          </Box>
        </Grid> */}
      </CardContent>
      {/* <div className={classes.abs} style={{ backgroundColor: color }}></div> */}
    </Card>
  );
};

export default AppCard;
