import React, { useState, useEffect, FormEvent } from 'react';

import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Button, Snackbar } from '@material-ui/core';
import moment from 'moment';
import firebase from 'firebase';
// Required for side-effects
require('firebase/firestore');
// TODO: Replace the following with your app's Firebase project configuration
firebase.initializeApp({
  apiKey: 'AIzaSyCaPei14v0aK2d2eHI52edQprnESNYTg6c',
  authDomain: 'servicehub-crm-web.firebaseapp.com',
  databaseURL: 'https://servicehub-crm-web.firebaseio.com',
  projectId: 'servicehub-crm-web',
  storageBucket: 'servicehub-crm-web.appspot.com',
  messagingSenderId: '638969901476',
  appId: '1:638969901476:web:df906c852aa9138434d131',
  measurementId: 'G-4ZV0C6QKFV',
});
var db = firebase.firestore();
var servicehubcrmvideocallFb = db.collection('servicehubcrmvideocallFb');
var jwt = require('jsonwebtoken');

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { URLRoomName, Crm } = useParams();
  const [step, setStep] = useState(Steps.roomNameStep);
  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [decoded, setDecoded] = useState<object>({});
  const [mediaError, setMediaError] = useState<Error>();
  const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
      var docRef = servicehubcrmvideocallFb.doc(URLRoomName);
      docRef
        .get()
        .then((doc: any) => {
          if (doc.exists) {
            var decoded = jwt.decode(doc.data().token);
            const hour = (decoded.expTokenVideo - moment.utc().valueOf() / 1000) / 3600;
            /* if (hour < 0 || doc.data().expTokenVideo != decoded.expTokenVideo) {
              window.location.assign(`https://servicehubcrm.net/#/payment-expire/${decoded.company_id}`);
              return;
            } */
            Crm === '1' ? setName(decoded.costumerName) : setName(decoded.userName);
            setDecoded(decoded);
          } else {
            window.alert('You do not have permission to make video call');
          }
        })
        .catch(error => {
          console.log(error);
        });

      if (user?.displayName) {
        setStep(Steps.deviceSelectionStep);
      }
    }
  }, [user, URLRoomName]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setStep(Steps.deviceSelectionStep);
  };

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      {step === Steps.roomNameStep && (
        <RoomNameScreen
          name={name}
          roomName={roomName}
          decoded={decoded}
          setName={setName}
          setRoomName={setRoomName}
          handleSubmit={handleSubmit}
        />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
