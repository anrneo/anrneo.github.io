import React from 'react';
import { makeStyles, Theme, CardContent, CardMedia, Grid, Card, Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    fontSize: 30,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 100,
    padding: '0 30px',
  },
  CardContent: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingTop: '150px',
  },
}));

export default function DisconnectPage() {
  const classes = useStyles();

  return (
    <Grid item className={classes.CardContent}>
      <Card>
        <CardMedia
          component="img"
          alt="green iguana"
          height="330"
          image="https://storage.servicehubcrm.net/dev/user_profile/userprofile_5577_SltTvGrWXy.jpeg"
        />
        <CardContent>
          <Button className={classes.button}>Call has been disconnected</Button>
        </CardContent>
      </Card>
    </Grid>
  );
}
