// requerimientos de la aplicación
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
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





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
