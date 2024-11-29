import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Linking, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

const BarcodeScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Corrected the alert statement with template literals
    alert(`Type: ${type}\nData: ${data}`);

    // Check if the scanned data is a URL
    if (data.startsWith('http://') || data.startsWith('https://')) {
      // Ask the user if they want to open the URL
      Alert.alert(
        "Open this URL?",
        `Do you want to open this website?\n${data}`, // Correctly use backticks here
        [
          {
            text: "No",
            onPress: () => console.log("User chose not to open the link"),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => Linking.openURL(data), // Open the URL if user confirms
          }
        ]
      );
    } else {
      // Handle other scanned data (e.g., non-URL barcode)
      alert('Scanned non-URL data: ' + data);
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.statusText}>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text style={styles.statusText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <View style={styles.scannedOverlay}>
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Optional Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Atrás</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Matching background
  },
  statusText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 20,
  },
  scannedOverlay: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  scanAgainButton: {
    backgroundColor: '#E20429',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarcodeScannerScreen;

