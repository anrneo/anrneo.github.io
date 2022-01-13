import firebase from 'firebase';
require('firebase/firestore');
var jwt = require('jsonwebtoken');
if (firebase.apps.length) {
  firebase.app(); // if already initialized, use that one
} else {
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
}

export default function FirebaseApp() {
  const tokenDataCrm = async (URLRoomName: any) => {
    let doc = await firebase
      .firestore()
      .collection('servicehubcrmvideocallFb')
      .doc(URLRoomName)
      .get();
    if (doc.exists) {
      let data = doc.data();
      let decode = jwt.decode(doc.data()?.token);
      return { data: data, decode: decode };
    } else {
      return false;
    }
  };

  const update = async (URLRoomName: any, data: {}) => {
    firebase
      .firestore()
      .collection('servicehubcrmvideocallFb')
      .doc(URLRoomName)
      .update(data);
  };

  return { tokenDataCrm, update };
}
