import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmIgzgxUO5ZMcZEOic7bsNQgoqKIvxXY4",
  authDomain: "foodbankds.firebaseapp.com",
  projectId: "foodbankds",
  storageBucket: "foodbankds.appspot.com",
  messagingSenderId: "729077541683",
  appId: "1:729077541683:web:be1be0635cb043dae8ec46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
