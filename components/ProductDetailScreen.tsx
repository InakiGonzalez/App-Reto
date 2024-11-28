import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;

  // Initialize state for each field
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [expiration, setExpiration] = useState(product.expiration?.toDate().toISOString().split('T')[0]); // Format as YYYY-MM-DD
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  
  console.log(product);

  // Save updated product details
  const handleSave = async () => {
    const db = getFirestore();
    const productRef = doc(db, 'inventory-item', product.id);

    try {
      await updateDoc(productRef, {
        name,
        description,
        expiration: new Date(expiration), // Convert back to timestamp
        quantity: parseInt(quantity, 10),
        imageUrl,
      });
      Alert.alert('Success', 'Product updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product.');
    }
  };

  // Delete product
  const handleDelete = async () => {
    const db = getFirestore();
    const productRef = doc(db, 'inventory-item', product.id);

    try {
      await deleteDoc(productRef);
      Alert.alert('Success', 'Product deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Failed to delete product.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Name Input */}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      {/* Description Input */}
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />

      {/* Expiration Date Input */}
      <TextInput
        style={styles.input}
        value={expiration}
        onChangeText={setExpiration}
        placeholder="Expiration (YYYY-MM-DD)"
        keyboardType="default"
      />

      {/* Quantity Input */}
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Quantity"
        keyboardType="numeric"
      />

      {/* Image URL Input */}
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="Image URL"
      />

      {/* Save and Delete Buttons */}
      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Delete Product" onPress={handleDelete} color="red" />
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
