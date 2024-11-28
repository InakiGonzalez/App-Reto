import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase-config'; // Asegúrate de que apunte a tu firebase-config.js

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Authenticated User UID:', user.uid);

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        console.log('Firestore Document Data:', userDoc.data());
        navigation.navigate('HomeScreen');
      } else {
        console.log('No Firestore document found for UID:', user.uid);
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#f9f9f9']} style={styles.mainContainer}>
      <Image
        source={require('../assets/file.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}><Text style={{ fontWeight: 'bold' }}>Iniciar Sesión</Text></Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.textInput}
        placeholder="Correo electrónico"
        placeholderTextColor="#8e8e8e" // Placeholder color
        keyboardType="email-address"
        value={email}
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textInput}
        placeholder="Contraseña"
        placeholderTextColor="#8e8e8e"
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  logo: {
    height: 200, 
    marginBottom: 20, 
  },
  subtitle: {
    fontSize: 24,
    color: '#4A4A4A',
    marginBottom: 20,
  },
  textInput: {
    width: '90%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: '90%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});