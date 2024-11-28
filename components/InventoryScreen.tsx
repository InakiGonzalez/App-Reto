import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const InventoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const sidebarWidth = screenWidth * 0.7;
  const sidebarAnimation = useRef(new Animated.Value(-sidebarWidth)).current;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const db = getFirestore();
        const storage = getStorage();
        const inventoryCollection = collection(db, 'inventory-item');

        const currentDate = new Date();
        const inventorySnapshot = await getDocs(
          query(
            inventoryCollection,
            where('expiration', '>', currentDate),
            orderBy('expiration', 'asc')
          )
        );

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
              quantity: data.quantity,
              expiration: data.expiration.toDate(),
              imageUrl,
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

  const handleExpand = (itemId) => {
    setExpandedProduct(expandedProduct === itemId ? null : itemId);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.itemCard, expandedProduct === item.id && styles.expandedCard]}
      onPress={() => handleExpand(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
        <Text style={styles.itemExpiration}>
          Caducidad: {item.expiration.toLocaleDateString()}
        </Text>
      </View>
      {expandedProduct === item.id && (
        <View style={styles.expandedSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('EditProductScreen', {
                product: item,
              })
            }
          >
            <Text style={styles.editButtonText}>Editar Producto</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar Spacer */}
      <View style={styles.statusBarSpacer} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar inventario..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Sidebar */}
      {isSidebarVisible && (
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: sidebarAnimation }] },
          ]}
        >
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✖</Text>
          </TouchableOpacity>
          <View style={styles.sidebarHeader}>
            <Image
              source={require('../assets/file.png')}
              style={styles.sidebarLogoImage}
            />
          </View>
          {/* Sidebar Navigation Items */}
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeScreen')}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarItemText}>Menú</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('InventoryScreen')}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarItemText}>Inventario</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('BarcodeScannerScreen')}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarItemText}>Escanear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AccountScreen')}
            style={styles.sidebarItem}
          >
            <Text style={styles.sidebarItemText}>Cuenta</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Add Product Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProductScreen')}
      >
        <Text style={styles.addButtonText}>Agregar Producto</Text>
      </TouchableOpacity>

      {filteredInventory.length === 0 ? (
        <Text style={styles.emptyMessage}>No se encontraron elementos.</Text>
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#4CAF50',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  expandedCard: {
    backgroundColor: '#F9F9F9',
    paddingBottom: 20,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#007BFF',
  },
  itemExpiration: {
    fontSize: 14,
    color: '#FF0000',
  },
  expandedSection: {
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#E20429',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#E20429',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    margin: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#4CAF50',
    padding: 20,
    zIndex: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  sidebarHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarLogoImage: {
    width: 160,
    height: 155,
  },
  sidebarItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#388E3C',
    borderRadius: 8,
  },
  sidebarItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
