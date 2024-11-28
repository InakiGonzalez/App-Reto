// src/components/HomeScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Spacer for Status Bar */}
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <LinearGradient colors={['#47A025', '#47A025']} style={styles.header}>
        <Text style={styles.headerText}>Menú</Text>
      </LinearGradient>

      {/* Logo */}
      <Image
        source={require('../assets/file.png')} // Cambia la ruta a tu logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Botones en cuadrícula */}
      <View style={styles.buttonGrid}>
        {/* Escanear */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('BarcodeScannerScreen')}
        >
          <Image
            source={require('../assets/scanner.jpg')} // Reemplaza con tu ícono de escáner
            style={styles.icon}
          />
          <Text style={styles.iconButtonText}>Escanear</Text>
        </TouchableOpacity>

        {/* Inventario */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('InventoryScreen')}
        >
          <Image
            source={require('../assets/inventory.jpg')} // Reemplaza con tu ícono de inventario
            style={styles.icon}
          />
          <Text style={styles.iconButtonText}>Inventario</Text>
        </TouchableOpacity>

        {/* Caducidades */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('ExpirationScreen')}
        >
          <Image
            source={require('../assets/calendar.jpg')} // Reemplaza con tu ícono de calendario
            style={styles.icon}
          />
          <Text style={styles.iconButtonText}>Caducidades</Text>
        </TouchableOpacity>

        {/* Cuenta */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AccountScreen')}
        >
          <Image
            source={require('../assets/account.jpg')} // Reemplaza con tu ícono de cuenta
            style={styles.icon}
          />
          <Text style={styles.iconButtonText}>Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adds space for Android
    backgroundColor: '#47A025', // Matches the header color
    width: '100%',
  },
  header: {
    width: '100%',
    height: 80, // Tamaño del header
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF', // Texto blanco
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 150, // Más grande
    height: 150, 
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 120, // Tamaño uniforme
    height: 120,
    backgroundColor: '#F9F9F9', // Fondo gris claro
    margin: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 60, // Ajuste para íconos
    height: 60,
    marginBottom: 5,
  },
  iconButtonText: {
    color: '#4A4A4A', // Texto gris oscuro
    fontSize: 14,
    fontWeight: 'bold',
  },
});