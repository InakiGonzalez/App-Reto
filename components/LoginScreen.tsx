// src/components/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase-config'; // Ensure this points to your firebaseConfig.js
import { useNavigation } from '@react-navigation/native';

// Initialize Firebase Auth
const auth = getAuth(app);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario logueado:', userCredential.user);
        navigation.navigate('HomeScreen');  // Navigate to Home on successful login
      })
      .catch((error) => {
        console.log('Error al iniciar sesión:', error.code);
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Hola !!</Text>
      <Text style={styles.subtitle}>Inicia Sesión con tu cuenta</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.textInput}
        placeholder="foodbank@gmail.com"
        value={email} // Add value to keep the input controlled
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textInput}
        placeholder="********"
        secureTextEntry
        value={password} // Add value to keep the input controlled
      />
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => Alert.alert('Recuperación de contraseña')}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <LinearGradient colors={['#E20429', '#FABB01']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientButton}>
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
