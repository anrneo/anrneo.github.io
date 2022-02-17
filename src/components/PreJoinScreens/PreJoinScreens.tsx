import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import moment from 'moment';

import { useAppSelector } from '../../redux/hooks';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [step, setStep] = useState(Steps.roomNameStep);
  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [decoded, setDecoded] = useState<object>({});
  const [mediaError, setMediaError] = useState<Error>();
  const urlParams = useAppSelector<any>(state => state.collection.params);
  const collection = useAppSelector<any>(state => state.collection.list);

  useEffect(() => {
    if (urlParams.data && collection.tokenData) {
      setRoomName(urlParams.data.URLRoomName);

      const hour = (collection.tokenData.decode.expTokenVideo - moment.utc().valueOf() / 1000) / 3600;

      if (
        process.env.NODE_ENV === 'production' &&
        (hour < 0 || collection.tokenData.data.expTokenVideo !== collection.tokenData.decode.expTokenVideo)
      ) {
        window.location.assign(`https://servicehubcrm.net/#/payment-expire/${collection.tokenData.decode.company_id}`);
        return;
      }

      urlParams.data.Crm === '1'
        ? setName(collection.tokenData.decode.costumerName)
        : setName(collection.tokenData.decode.userName);

      setDecoded(collection.tokenData.decode);

      if (user?.displayName) {
        setStep(Steps.deviceSelectionStep);
      }

      fetch('https://videochat-7252.twil.io/delmedia');

      return;
    }
  }, [user, collection, urlParams]);

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
        window.encodeURI(`/room/${roomName}/${urlParams.data.Crm}${window.location.search || ''}`)
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
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
