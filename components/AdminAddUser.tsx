import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminAddUser({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();

    const checkAdmin = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          Alert.alert('Access Denied', 'You are not authorized to access this screen.');
          navigation.navigate('HomeScreen');
        }
      } else {
        Alert.alert('Error', 'No user is logged in. Please log in again.');
        navigation.navigate('LoginScreen');
      }
      setLoading(false);
    };

    onAuthStateChanged(auth, (user) => {
      if (user) checkAdmin();
      else {
        setLoading(false);
        navigation.navigate('LoginScreen');
      }
    });
  }, []);

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
      const firestore = getFirestore();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Create new user with 'user' role by default
      await setDoc(doc(firestore, 'users', newUser.uid), {
        email: newUser.email,
        role: 'user', // New users will be created as 'user' role
      });

      Alert.alert('Success', 'New user added successfully.');
      navigation.navigate('MainMenu');
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isAdmin ? (
        <>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Add New User</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button title="Add New User" onPress={handleSignUp} color="#4CAF50" />
        </>
      ) : (
        <Text style={styles.permissionText}>You do not have permission to access this screen.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
});
