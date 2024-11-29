import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
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
  const [selectedRange, setSelectedRange] = useState('all'); // Holds the selected date range
  const [selectedFilter, setSelectedFilter] = useState(null);
  
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
  const filterByDateRange = (range) => {
    setSelectedRange(range);
    
    const currentDate = new Date();
    let filtered = [];
  
    // Map date ranges to days in the future
    const weeksFromNow = {
      '0-4': { start: 0, end: 28 },
      '5-10': { start: 35, end: 70 },
      '11+': { start: 77 }, // This assumes 11+ weeks means more than 77 days from today
    };
  
    // Check if range exists in mapping
    const selectedRangeDetails = weeksFromNow[range];
  
    if (selectedRangeDetails) {
      const { start, end } = selectedRangeDetails;
  
      filtered = inventory.filter((item) => {
        const expirationDate = item.expiration;
        const timeDifference = (expirationDate - currentDate) / (1000 * 3600 * 24); // Convert ms to days
  
        // If there's an 'end', filter between start and end; otherwise, just filter after start
        return end ? (timeDifference >= start && timeDifference <= end) : timeDifference >= start;
      });
    } else {
      // No specific filter selected (show all inventory)
      filtered = inventory;
    }
  
    setFilteredInventory(filtered);
  };
  
  const handleFilterPress = (filter) => {
    setSelectedFilter(filter); // Set the selected filter on press
    filterByDateRange(filter);  // Apply the filter
  };



  const clearFilters = () => {
    setSelectedRange('all'); // Reset selected range filter
    setFilteredInventory(inventory); // Reset filtered inventory
  };


  const handleClearFilter = () => {
    setSelectedFilter(null); // Reset the selected filter
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
              navigation.navigate('ProductDetailScreen', {
                productId: item.id, // Pass only the productId
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
 
     {/* Filter Buttons */}
     <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedRange === '2-4' && styles.selectedFilter]}
          onPress={() => handleFilterPress('2-4')}
        >
          <Text style={styles.filterText}>2-4 semanas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton,{ width: 120 }, selectedRange === '5-10' && styles.selectedFilter]}
          onPress={() => handleFilterPress('5-10')}
        >
          <Text style={styles.filterText}>5-10 semanas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton,{ width: 120 }, selectedRange === '11+' && styles.selectedFilter]}
          onPress={() => handleFilterPress('11+')}
        >
          <Text style={styles.filterText}>11+ semanas</Text>
        </TouchableOpacity>

        {/* "Quitar filtro" button */}
        <TouchableOpacity
          style={[styles.filterButton, styles.clearFilterButton]} 
          onPress={clearFilters}
        >
          <Text style={styles.filterText}>Quitar filtro</Text>
        </TouchableOpacity>
      </ScrollView>

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
  filterContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 2,
  },
  filterButton: {
    backgroundColor: '#E20429',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    margin: 5, // Add a small margin between buttons
    minWidth: 120, // Ensure each button has a minimum width
    maxWidth: 120, // Limit the button width so it doesn't grow too large
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Enforce the minimum width
    flex: 0, // En
  },
  selectedFilter: {
    backgroundColor: '#388E3C',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  clearFilterButton: {
    backgroundColor: '#0000FF',  // Same background as other filter buttons
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    margin: 1,
    justifyContent: 'center',
  },
});
