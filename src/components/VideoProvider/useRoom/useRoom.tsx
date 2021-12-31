import { Callback } from '../../../types';
import { isMobile } from '../../../utils';
import Video, { ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { VideoRoomMonitor } from '@twilio/video-room-monitor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase';
// Required for side-effects
require('firebase/firestore');
// TODO: Replace the following with your app's Firebase project configuration

firebase.initializeApp(
  {
    apiKey: 'AIzaSyCaPei14v0aK2d2eHI52edQprnESNYTg6c',
    authDomain: 'servicehub-crm-web.firebaseapp.com',
    databaseURL: 'https://servicehub-crm-web.firebaseio.com',
    projectId: 'servicehub-crm-web',
    storageBucket: 'servicehub-crm-web.appspot.com',
    messagingSenderId: '638969901476',
    appId: '1:638969901476:web:df906c852aa9138434d131',
    measurementId: 'G-4ZV0C6QKFV',
  },
  'roomDb'
);
var db = firebase.app('roomDb').firestore();
var servicehubcrmvideocallFb = db.collection('servicehubcrmvideocallFb');

// @ts-ignore
window.TwilioVideo = Video;

export default function useRoom(localTracks: LocalTrack[], onError: Callback, options?: ConnectOptions) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const optionsRef = useRef(options);
  const { URLRoomName } = useParams();
  useEffect(() => {
    // This allows the connect function to always access the most recent version of the options object. This allows us to
    // reliably use the connect function at any time.
    optionsRef.current = options;
  }, [options]);

  const connect = useCallback(
    token => {
      setIsConnecting(true);
      return Video.connect(token, { ...optionsRef.current, tracks: localTracks }).then(
        newRoom => {
          fetch(`https://videochat-7252.twil.io/mediavideo?rm=${newRoom.sid}`)
            .then(response => {
              return response.json();
            })
            .then(datavideo => {
              const link = `https://SK9f831e2b412d713de37cfc55a8cea11b:qTjghG0SSdH5qU0joh5H8lFA993KugZm@${
                datavideo.result.links.media.split('//')[1]
              }`;
              servicehubcrmvideocallFb.doc(URLRoomName).update({
                rm: newRoom.sid,
                link: link,
              });
            });
          setRoom(newRoom);
          VideoRoomMonitor.registerVideoRoom(newRoom);
          const disconnect = () => newRoom.disconnect();

          // This app can add up to 13 'participantDisconnected' listeners to the room object, which can trigger
          // a warning from the EventEmitter object. Here we increase the max listeners to suppress the warning.
          newRoom.setMaxListeners(15);

          newRoom.once('disconnected', () => {
            // Reset the room only after all other `disconnected` listeners have been called.
            setTimeout(() => setRoom(null));
            window.removeEventListener('beforeunload', disconnect);

            if (isMobile) {
              window.removeEventListener('pagehide', disconnect);
            }
          });

          // @ts-ignore
          window.twilioRoom = newRoom;

          newRoom.localParticipant.videoTracks.forEach(publication =>
            // All video tracks are published with 'low' priority because the video track
            // that is displayed in the 'MainParticipant' component will have it's priority
            // set to 'high' via track.setPriority()
            publication.setPriority('low')
          );

          setIsConnecting(false);

          // Add a listener to disconnect from the room when a user closes their browser
          window.addEventListener('beforeunload', disconnect);

          if (isMobile) {
            // Add a listener to disconnect from the room when a mobile user closes their browser
            window.addEventListener('pagehide', disconnect);
          }
        },
        error => {
          onError(error);
          setIsConnecting(false);
        }
      );
    },
    [localTracks, URLRoomName, onError]
  );

  return { room, isConnecting, connect };
}
