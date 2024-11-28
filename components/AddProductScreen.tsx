// src/screens/AddProductScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [expiration, setExpiration] = useState('');

  const handleAddProduct = async () => {
    if (name === '' || imageUrl === '' || quantity === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    try {
      await addDoc(collection(db, 'inventory-item'), {
        name,
        imageUrl,
        quantity: parseInt(quantity, 10),
        description,
        expiration: new Date(expiration),

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
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiration Date (e.g., 2025-01-01T00:00:00)"
        value={expiration}
        onChangeText={setExpiration}
      />
      <Button title="Add Product" onPress={handleAddProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
});
