import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import moment from 'moment';
import FirebaseApp from '../../state/useFirebaseAuth/FirebaseApp';

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
  const [host, setHost] = useState<string>('');
  const [decoded, setDecoded] = useState<object>({});
  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
      FirebaseApp()
        .tokenDataCrm(URLRoomName)
        .then((tokenData: any) => {
          if (tokenData) {
            const hour = (tokenData.decode.expTokenVideo - moment.utc().valueOf() / 1000) / 3600;
            if (
              window.location.host !== 'localhost:3000' &&
              (hour < 0 || tokenData.data.expTokenVideo != tokenData.decode.expTokenVideo)
            ) {
              window.location.assign(`https://servicehubcrm.net/#/payment-expire/${tokenData.decode.company_id}`);
              return;
            }
            Crm === '1' ? setName(tokenData.decode.costumerName) : setName(tokenData.decode.userName);
            setDecoded(tokenData.decode);
            setHost(tokenData.data.host);
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
      return;
    }
  }, [user, URLRoomName, Crm]);

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
      window.history.replaceState(
        null,
        '',
        window.encodeURI(`/room/${roomName}/${Crm}${window.location.search || ''}`)
      );
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
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} host={host} />
      )}
    </IntroContainer>
  );
}
