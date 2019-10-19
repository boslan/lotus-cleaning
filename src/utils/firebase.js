import * as firebase from 'firebase';
import 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
// Initialize Firebase
const config = {
    apiKey: "AIzaSyBJp5KGMsl7YKv3BcHzZGDIdDRoIZW8ToY",
    authDomain: "cleaning-project-ec4f1.firebaseapp.com",
    databaseURL: "https://cleaning-project-ec4f1.firebaseio.com",
    projectId: "cleaning-project-ec4f1",
    storageBucket: "cleaning-project-ec4f1.appspot.com",
    messagingSenderId: "1011241556609",
    appId: "1:1011241556609:web:3bf89b66bca2105004cb80",
    measurementId: "G-W9QJ7M570D"
};
firebase.initializeApp(config);
export { firebase };
