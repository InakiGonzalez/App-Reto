import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);

  const handleSave = async () => {
    const db = getFirestore();
    const productRef = doc(db, 'inventory-item', product.id);

    try {
      await updateDoc(productRef, { name, description });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async () => {
    const db = getFirestore();
    const productRef = doc(db, 'inventory-item', product.id);

    try {
      await deleteDoc(productRef);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
