import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBtLEpO0AAJilQOc-qtUUqIRz5Zc7gayMM",
    authDomain: "staffgigbox.firebaseapp.com",
    databaseURL: "https://staffgigbox.firebaseio.com",
    projectId: "staffgigbox",
    storageBucket: "",
    messagingSenderId: "259666695833"
  };

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;

