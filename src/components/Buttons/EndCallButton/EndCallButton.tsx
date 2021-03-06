import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAppSelector } from '../../../redux/hooks';
import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import FirebaseApp from '../../../state/useFirebaseAuth/FirebaseApp';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const urlParams: any = useAppSelector(state => state.collection.params);
  const collection: any = useAppSelector(state => state.collection.list);

  const handleClose = () => {
    room!.disconnect();
    let url = '';
    if (urlParams.data.Crm === '0') {
      FirebaseApp().update(urlParams.data.URLRoomName, { closed: true });
      url = `${collection.tokenData.decode.urlBase}`;
    } else url = `/disconnect?logo=${collection.tokenData.decode.urlLogo}`;
    window.localStorage.setItem('hostCrm', url);
  };

  return (
    <Button onClick={() => handleClose()} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Disconnect
    </Button>
  );
}
