import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyD7U6DtCbxe1ndVrtfysu9QifGeSHlYbbg',
//   authDomain: 'meetyourmentor-8ad17.firebaseapp.com',
//   projectId: 'meetyourmentor-8ad17',
//   storageBucket: 'meetyourmentor-8ad17.appspot.com',
//   messagingSenderId: '631177748461',
//   appId: '1:631177748461:web:8d5141a6ff4dfcba0651e4',
//   measurementId: 'G-WR6KYQH8S9',
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
