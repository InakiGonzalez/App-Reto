import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const InventoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const db = getFirestore();
        const storage = getStorage();
        const inventoryCollection = collection(db, 'inventory-item');
        const inventorySnapshot = await getDocs(inventoryCollection);
  
        if (inventorySnapshot.empty) {
          console.log('No documents found in inventory collection.');
        }
  
        const inventoryList = await Promise.all(
          inventorySnapshot.docs.map(async (doc) => {
            const data = doc.data();
  
            // Ensure imageURL exists in document data
            if (!data.imageUrl) {
              console.log(`Document ${doc.id} missing imageURL field.`);
              return null;
            }
  
            const imageRef = ref(storage, data.imageUrl);
            const imageUrl = await getDownloadURL(imageRef);
  
            return {
              id: doc.id,
              name: data.name,
              //description: data.description,
              quantity: data.quantity,
              imageUrl: imageUrl,
            };
          })
        );
  
        // Filter out null entries in case of missing data
        const filteredInventoryList = inventoryList.filter(item => item !== null);
  
        setInventory(filteredInventoryList);
        setFilteredInventory(filteredInventoryList);
  
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
  
    fetchInventory();
  }, []);
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setFilteredInventory(
        inventory.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredInventory(inventory);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <Text style={styles.itemQuantity}>{item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search inventory..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('AddProductScreen')}>
        <Text style={styles.editButtonText}>Add Product</Text>
      </TouchableOpacity>
      
      {filteredInventory.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No items found.</Text>
      ) : (
        <FlatList
          data={filteredInventory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );  
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  editButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
  },
  listContainer: {
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
