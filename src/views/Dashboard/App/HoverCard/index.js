import React from 'react';

import { makeStyles, Card, CardContent, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  socialhovercard: {
    position: 'relative',
    padding: '15px 0',
    color: '#fff',
    '&:hover img': {
      opacity: '1',
      transform: 'scale(1.2)',
    },
  },
  socialhovericon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    '&> img': {
      height: '50px',
      opacity: '0.5',
      transition: 'all .3s ease-in-out',
    },
  },
}));

const HoverCard = (props) => {
  const { primary, title, image, color } = props;
  const classes = useStyles();

  const Image = image ? <img className={classes.img} src={image} alt="app" /> : null;

  return (
    <Card className={classes.socialhovercard}>
      <CardContent>
        <Typography variant="body2" className={classes.socialhovericon}>
          {Image}
        </Typography>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="h3" color="#000">
              {title}
            </Typography>
          </Grid>
          {/* <Grid item xs={12}>
                        <Typography variant="subtitle2" color="inherit">
                            {primary}
                        </Typography>
                    </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HoverCard;
