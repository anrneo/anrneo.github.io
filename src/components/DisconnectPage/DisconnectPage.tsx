import React from 'react';
import { makeStyles, Theme, CardMedia, Grid, Card, Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    fontSize: 30,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 100,
    padding: '50px 30px',
  },
  CardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '150px',
  },
  CardMedia: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: 350,
      maxHeight: 200,
      display: 'block',
      margin: 'auto',
    },
  },
}));

export default function DisconnectPage() {
  const classes = useStyles();
  const logo = window.location.search.split('=')[1];

  return (
    <Grid container className={classes.CardContent}>
      <Grid item xs="auto">
        <Card>
          <CardMedia
            className={classes.CardMedia}
            component="img"
            alt="green iguana"
            height="330"
            image={`https://storage.servicehubcrm.net/dev/user_profile/${logo}`}
          />
        </Card>
      </Grid>
      <Grid container item xs={12} className={classes.CardContent}>
        <Button className={classes.button}>Call has been disconnected</Button>
      </Grid>
    </Grid>
  );
}
