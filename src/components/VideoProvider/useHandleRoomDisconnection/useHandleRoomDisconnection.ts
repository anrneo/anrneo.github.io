import { Room, TwilioError } from 'twilio-video';
import { useEffect } from 'react';

import { Callback } from '../../../types';

export default function useHandleRoomDisconnection(
  room: Room | null,
  onError: Callback,
  removeLocalAudioTrack: () => void,
  removeLocalVideoTrack: () => void,
  isSharingScreen: boolean,
  toggleScreenShare: () => void
) {
  useEffect(() => {
    if (room) {
      const onDisconnected = (_: Room, error: TwilioError) => {
        if (error) {
          onError(error);
        }

        removeLocalAudioTrack();
        removeLocalVideoTrack();
        if (isSharingScreen) {
          toggleScreenShare();
        }
      };

      room.on('disconnected', onDisconnected);
      return () => {
        room.off('disconnected', onDisconnected);
        if (window.localStorage.getItem('hostCrm')) {
          window.location.assign(window.localStorage.getItem('hostCrm')!);
        }
      };
    }
  }, [room, onError, removeLocalAudioTrack, removeLocalVideoTrack, isSharingScreen, toggleScreenShare]);
}
