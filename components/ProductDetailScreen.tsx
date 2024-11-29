import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params; // Now only receiving productId

  const [product, setProduct] = useState(null); // State to store product data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expiration, setExpiration] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for fetch

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          console.log('Product ID is missing');
          return;
        }

        const db = getFirestore();
        const productRef = doc(db, 'inventory-item', productId); // Use the productId to get the product document
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          console.log('Product data:', productData); // Log the product data
          setProduct(productData); // Set the product state
          setName(productData.name);
          setDescription(productData.description || '');
          setExpiration(
            productData.expiration instanceof Date
              ? productData.expiration.toISOString().split('T')[0]
              : productData.expiration?.toDate().toISOString().split('T')[0]
          );
          setQuantity(String(productData.quantity));
          setImageUrl(productData.imageUrl);
        } else {
          console.log('No product found');
          Alert.alert('Error', 'Product not found.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('Error', 'Failed to fetch product data.');
      } finally {
        setLoading(false); // Stop loading after fetch attempt
      }
    };

    fetchProduct();
  }, [productId]); // Fetch product only when productId changes

  // If still loading, show a loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If no product exists after fetch, show error message
  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  // Save updated product details
  const handleSave = async () => {
    const db = getFirestore();
    const productRef = doc(db, 'inventory-item', productId);

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
    const productRef = doc(db, 'inventory-item', productId);

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

      {/* Description Text (Read-Only) */}
      <TextInput
        style={[styles.input, styles.descriptionInput]} // Style for description input
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline // Allow multi-line input for description
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
      <Button title="Guardar Cambios" onPress={handleSave} color="blue" />
      <View style={styles.buttonSpacing} /> 
      <Button title="Eliminar Producto" onPress={handleDelete} color="red" />
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
  descriptionInput: {
    height: 100, // Make description input larger for multi-line text
    textAlignVertical: 'top', // Start text from the top of the input box
  },
    button: {
    // your button styles here
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    marginBottom: 15,  // Add space below the "Save changes" button
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
