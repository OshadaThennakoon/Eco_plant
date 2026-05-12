// firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Store auth instance in a global variable to survive Metro fast refreshes
const globalContext = global as any;

if (!globalContext.__FIREBASE_AUTH__) {
  try {
    globalContext.__FIREBASE_AUTH__ = initializeAuth(app, {
      persistence: Platform.OS === 'web' 
        ? browserLocalPersistence 
        : getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    try {
      globalContext.__FIREBASE_AUTH__ = getAuth(app);
    } catch (e) {
      console.error("Firebase auth initialization failed", e);
    }
  }
}

auth = globalContext.__FIREBASE_AUTH__;

export { app, auth };
