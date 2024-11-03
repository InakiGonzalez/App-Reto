// src/components/HomeScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a la pantalla de inicio</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InventoryScreen')}>
        <LinearGradient colors={['#E20429','#FABB01']} style={styles.gradientButton}>
          <Text style={styles.buttonText}> View Inventory </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminAddUser')}>
      <LinearGradient colors={['#E20429', '#FABB01']} style={styles.gradientButton}>
          <Text style={styles.buttonText}>Add New User</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
