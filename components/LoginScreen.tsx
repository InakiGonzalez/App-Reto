import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth,db } from '../firebase-config'; // Ensure this points to your firebase-config.js
import Navigation from '../Navigation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // When the screen is focused, clear email and password fields
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
    });

    // Cleanup the listener when the component is unmounted or focus changes
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Authenticated user object
  
      console.log('Authenticated User UID:', user.uid);
  
      const userDoc = await getDoc(doc(db, 'users', user.uid)); // Fetch Firestore document
      if (userDoc.exists()) {
        console.log('Firestore Document Data:', userDoc.data());
        navigation.navigate('HomeScreen');
      } else {
        console.log('No Firestore document found for UID:', user.uid);
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Hola !!</Text>
      <Text style={styles.subtitle}>Inicia Sesión con tu cuenta</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.textInput}
        placeholder="foodbank@gmail.com"
        value={email}
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textInput}
        placeholder="********"
        secureTextEntry
        value={password}
      />
      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => Alert.alert('Recuperación de contraseña')}
      >
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <LinearGradient
          colors={['#E20429', '#FABB01']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.textButton}>Iniciar Sesión</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 70,
    color: '#3434D',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
  textInput: {
    padding: 10,
    paddingStart: 30,
    width: '80%',
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    width: '50%',
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 40,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: 'gray',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});