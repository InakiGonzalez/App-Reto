//Se creo una confiruación de firebase para poder utilizar la base de datos en tiempo real de firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmIgzgxUO5ZMcZEOic7bsNQgoqKIvxXY4",
  authDomain: "foodbankds.firebaseapp.com",
  projectId: "foodbankds",
  storageBucket: "foodbankds.appspot.com",
  messagingSenderId: "729077541683",
  appId: "1:729077541683:web:be1be0635cb043dae8ec46"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db }
