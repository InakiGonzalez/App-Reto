import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  // Get the current user details from Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        name: user.displayName || 'No name available',
        email: user.email,
      });
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);  // Reference to user's document
      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserRole(userData.role || 'User'); // fetch the role field from Firestore
          setUserName(userData.name || 'No name available');  
        } else {
          console.log('User document not found');
        }
      }).catch((error) => {
        console.error('Error fetching user role:', error);
      });
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.title}>Account Information</Text>
          <Text style={styles.info}>Name: {userName}</Text>
          <Text style={styles.info}>Email: {userInfo.email}</Text>
          <Text style={styles.info}>Role: {userRole}</Text>

          <Button title="Log Out" onPress={handleLogout} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AccountScreen;
