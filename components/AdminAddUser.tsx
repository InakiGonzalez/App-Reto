import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, Alert } from 'react-native';
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

      await setDoc(doc(firestore, 'users', newUser.uid), {
        email: newUser.email,
        role: 'user',
      });

      Alert.alert('Success', 'New user added successfully.');
      navigation.navigate('MainMenu');
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View>
      {isAdmin ? (
        <>
          <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
          <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
          <Button title="Add new user" onPress={handleSignUp} />
          {error ? <Text>{error}</Text> : null}
        </>
      ) : (
        <Text>You do not have permission to access this screen.</Text>
      )}
    </View>
  );
}
