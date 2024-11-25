import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Linking, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

const BarcodeScannerScreen = () => {
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
    alert(`Type: ${type}\nData: ${data}`);

    // Check if the scanned data is a URL
    if (data.startsWith('http://') || data.startsWith('https://')) {
      // Ask the user if they want to open the URL
      Alert.alert(
        "Open this URL?",
        `Do you want to open this website?\n${data}`,
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
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BarcodeScannerScreen;
