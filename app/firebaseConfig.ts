// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlUvTnGDyVkP91_zPJVMEQhsskBp8d7dY",
  authDomain: "vegetablediseaseapp.firebaseapp.com",
  projectId: "vegetablediseaseapp",
  storageBucket: "vegetablediseaseapp.appspot.com",
  messagingSenderId: "246271761231",
  appId: "1:246271761231:web:454709de63aaa4abff033a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
