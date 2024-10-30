import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola !!</Text>
      <Text style={styles.subtitle}>Inicia Sesión con tu cuenta </Text>
      <TextInput
        style={styles.textInput}
        placeholder="foodbank@gmail.com"
      />
      <TextInput
        style={styles.textInput}
        placeholder="********"
      />
      <TouchableOpacity style={styles.button}>
        <LinearGradient
          colors={['#E20429', '#FABB01']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.textButton}>Iniciar Sesión</Text>
        </LinearGradient>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
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
    fontSize: 15, // Tamaño del texto reducido para adaptarse al botón más pequeño
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    width: '50%', // Ancho reducido
    height: 40,   // Altura reducida
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
