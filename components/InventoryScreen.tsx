import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const InventoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const sidebarWidth = screenWidth * 0.7; // Sidebar covers 70% of the screen width
  const sidebarAnimation = useRef(new Animated.Value(-sidebarWidth)).current;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const db = getFirestore();
        const storage = getStorage();
        const inventoryCollection = collection(db, 'inventory-item');
    
        // Example: Fetch items that expire after the current date
        const currentDate = new Date();
        const inventorySnapshot = await getDocs(
          query(
            inventoryCollection,
            where("expiration", ">", currentDate),  // Only fetch items with expiration date after now
            orderBy("expiration", "asc") // Sort by expiration date
          )
        );
    
        if (inventorySnapshot.empty) {
          console.log("No inventory items found.");
        }
    
        const inventoryList = await Promise.all(
          inventorySnapshot.docs.map(async (doc) => {
            const data = doc.data();
    
            if (!data.imageUrl) {
              return null;
            }
    
            const imageRef = ref(storage, data.imageUrl);
            const imageUrl = await getDownloadURL(imageRef);
    
            return {
              id: doc.id,
              name: data.name,
              description: data.description,
              quantity: data.quantity,
              expiration: data.expiration,
              imageUrl: imageUrl,
            };
          })
        );
    
        const filteredInventoryList = inventoryList.filter((item) => item !== null);
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

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      Animated.timing(sidebarAnimation, {
        toValue: -sidebarWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemExpiration}>
            Expiration: {item.expiration.toDate().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isSidebarVisible && (
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: sidebarAnimation }] },
          ]}
        >
          <TouchableOpacity onPress={toggleSidebar}>
            <Text style={styles.closeSidebar}> > </Text>
          </TouchableOpacity>
          <Button title="Inicio" onPress={() => navigation.navigate('HomeScreen')} />
          <Button title="Cuenta" onPress={() => navigation.navigate('Account')} />
          <Button title="Escanear" onPress={() => navigation.navigate('BarcodeScannerScreen')} />
        </Animated.View>
      )}

      {/* Top bar with sidebar toggle and search */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.sidebarToggle} onPress={toggleSidebar}>
          <Text style={styles.sidebarToggleText}>☰</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          placeholder="Search inventory..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AddProductScreen')}
      >
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sidebarToggle: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  sidebarToggleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
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
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    zIndex: 10,
    elevation: 5,
  },
  closeSidebar: {
    marginBottom: 20,
    fontSize: 18,
    color: 'red',
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
