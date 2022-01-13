import React, { ChangeEvent, FormEvent } from 'react';
import {
  makeStyles,
  TextField,
  Grid,
  Button,
  Typography,
  Checkbox,
  Theme,
  Card,
  CardMedia,
  Link,
} from '@material-ui/core';
import { useAppState } from '../../../state';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  media: {
    width: 200,
    display: 'block',
    margin: 'auto',
  },
  CheckboxContainer: {
    display: 'flex',
  },
  checklabel: {
    display: 'flex',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '2.5em 0 1.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  decoded: any;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({
  name,
  roomName,
  decoded,
  setName,
  setRoomName,
  handleSubmit,
}: RoomNameScreenProps) {
  const [checked, setChecked] = React.useState(true);
  const classes = useStyles();
  const { user } = useAppState();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  const handleDisclosure = (event: any) => {
    event.preventDefault();
    window.open(`https://servicehubcrm.net/#/virtual-disclosure/${decoded.company_id}`);
  };

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      <Card style={{ marginTop: 0 }}>
        <CardMedia
          className={classes.media}
          component="img"
          height="200"
          image={'https://storage.servicehubcrm.net/dev/user_profile/' + decoded.urlLogo}
          alt="imagen crm company"
        />
        <Typography gutterBottom variant="subtitle2" component="div" align="center">
          Order {decoded.orderNo}
        </Typography>
      </Card>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <TextField
                id="input-user-name"
                variant="standard"
                fullWidth
                label="Your Name"
                helperText="We recommend this name, you can change it freely"
                size="small"
                value={name}
                onChange={handleNameChange}
              />
            </div>
          )}
          <div className={classes.textFieldContainer}>
            <TextField
              disabled
              autoCapitalize="false"
              id="input-room-name"
              variant="standard"
              label="Room Name"
              fullWidth
              size="small"
              value={roomName}
              onChange={handleRoomNameChange}
            />
          </div>
        </div>

        <Grid container>
          <Grid item={true} xs={8} className={classes.CheckboxContainer}>
            <Checkbox
              checked={checked}
              size="small"
              color="secondary"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography variant="caption" className={classes.checklabel}>
              <Link component="button" disabled={!decoded.company_id} onClick={handleDisclosure}>
                I agree to Disclosures
              </Link>
            </Typography>
          </Grid>
          <Grid item={true} xs={4}>
            <Button
              className={classes.continueButton}
              variant="contained"
              type="submit"
              color="primary"
              disabled={!name || !roomName || !checked}
            >
              Join a Room
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
