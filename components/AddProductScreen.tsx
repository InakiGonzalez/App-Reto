import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { db } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [expiration, setExpiration] = useState(''); // e.g., "2024-12-01"

  const handleAddProduct = async () => {
    if (name === '' || quantity === '' || description === '' || expiration === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    // Convert expiration to a Firestore-compatible timestamp
    const expirationDate = new Date(expiration);
    if (isNaN(expirationDate.getTime())) {
      Alert.alert('Error', 'Invalid expiration date format. Use YYYY-MM-DD.');
      return;
    }

    try {
      await addDoc(collection(db, 'inventory-item'), {
        name,
        imageUrl,
        quantity: parseInt(quantity, 10),
        description,
        expiration: {
          seconds: Math.floor(expirationDate.getTime() / 1000),
          nanoseconds: 0,
        },
      });
      Alert.alert('Success', 'Product added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Spacer */}
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Producto</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Nombre del Producto</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Descripción del producto"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Fecha de Expiración (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Fecha de expiración"
          value={expiration}
          onChangeText={setExpiration}
        />

        <Text style={styles.label}>URL de la Imagen</Text>
        <TextInput
          style={styles.input}
          placeholder="URL de la imagen"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#47A025',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#47A025',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#E20429',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
