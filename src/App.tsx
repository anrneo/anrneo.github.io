import React, { useEffect } from 'react';
import { styled, Theme } from '@material-ui/core/styles';
import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import { useParams } from 'react-router-dom';
import FirebaseApp from './state/useFirebaseAuth/FirebaseApp';
import { useAppDispatch } from './redux/hooks';
import { getColl, getParams } from './redux/firebaseSlice';
import useRoomState from './hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

interface Params {
  URLRoomName: string;
  Crm: string;
}

export default function App() {
  const height = useHeight();
  const params = useParams<Params>();
  const dispatch = useAppDispatch();
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.

  useEffect(() => {
    (async () => {
      const tokenData = await FirebaseApp().tokenDataCrm(params.URLRoomName);
      if (tokenData === false) return window.alert('You do not have permission to make video call');
      if (tokenData?.data?.closed) return window.location.assign(`/disconnect?logo=${tokenData.decode.urlLogo}`);
      dispatch(getColl({ tokenData }));
      dispatch(getParams({ data: params }));
    })();
  }, [params, dispatch]);

  if (window.localStorage.getItem('hostCrm')) {
    const hostCrm = window.localStorage.getItem('hostCrm');
    window.localStorage.removeItem('hostCrm');

    if (hostCrm?.includes(`/disconnect`)) {
      window.history.replaceState(null, '', window.encodeURI(`/disconnect${window.location.search || ''}`));
    }
    window.location.assign(hostCrm!);
  }

  const roomState = useRoomState();
  return (
    <Container style={{ height }}>
      {roomState === 'disconnected' ? (
        <PreJoinScreens />
      ) : (
        <Main>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MobileTopMenuBar />
          <Room />
          <MenuBar />
        </Main>
      )}
    </Container>
  );
}
