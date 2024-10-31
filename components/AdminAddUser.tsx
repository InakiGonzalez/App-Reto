import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
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
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        }
      }
      setLoading(false);
    };

    onAuthStateChanged(auth, (user) => {
      if (user) checkAdmin();
      else setLoading(false);
    });
  }, []);

  const handleSignUp = async () => {
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Create user document in Firestore with 'role' set to 'user'
      await setDoc(doc(firestore, 'users', newUser.uid), {
        email: newUser.email,
        role: 'user',  // Default role for new users
      });

      // Navigate to the main menu or other screen
      navigation.navigate('MainMenu');
    } catch (error) {
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
