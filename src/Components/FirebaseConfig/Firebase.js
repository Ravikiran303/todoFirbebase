import firebase from "firebase";

const settings = { timestampsInSnapshots: true };

var firebaseConfig = {
  apiKey: "12345",
  authDomain: "terracetask.firebaseapp.com",
  databaseURL: "https://terracetask.firebaseio.com",
  projectId: "terracetask",
  storageBucket: "terracetask.appspot.com",
  messagingSenderId: "739298815265",
  appId: "1:739298815265:web:e8909b33947197f7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings(settings);

export default firebase;
