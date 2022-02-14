import React from 'react';
import { makeStyles, Theme, CardContent, CardMedia, Grid, Card, Paper, Button } from '@material-ui/core';

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
    display: 'flex',
  },
  CardMedia: {
    [theme.breakpoints.down('sm')]: {
      maxWeight: '50%',
    },
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  return (
    <Grid container component="main" style={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        sm={4}
        md={7}
        style={{
          backgroundImage: 'url(/img/disconnect-background.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid className={classes.CardContent} item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Grid item xs={11}>
          <Card>
            <CardMedia
              className={classes.CardMedia}
              component="img"
              alt="green iguana"
              height="300"
              image="/img/logo-big-black.png"
            />
            <CardContent>
              <Button className={classes.button}>Call has been disconnected</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
