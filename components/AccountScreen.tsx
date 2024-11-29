import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';  // Importamos Ionicons
import { LinearGradient } from 'expo-linear-gradient';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');

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
      const userDocRef = doc(db, 'users', user.uid); // Reference to user's document
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserRole(userData.role || 'User'); // fetch the role field from Firestore
            setUserName(userData.name || 'No name available');
          } else {
            console.log('User document not found');
          }
        })
        .catch((error) => {
          console.error('Error fetching user role:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Clear all user-related states
        setUserInfo(null);
        setUserRole('');
        setUserName('');
        setEmail('');
        setPassword('');
        setEmployeeId('');
        
        // Navigate to the Login screen after successful logout
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Spacer */}
      <View style={styles.statusBarSpacer} />

      {/* Header with back button */}
      <LinearGradient colors={['#4CAF50', '#4CAF50']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Cuenta</Text>
      </LinearGradient>

      {userInfo ? (
        <View style={styles.content}>
          <Text style={styles.title}>Información de la cuenta</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{userName}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Correo:</Text>
            <Text style={styles.infoValue}>{userInfo.email}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Rol:</Text>
            <Text style={styles.infoValue}>{userRole}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient colors={['#E20429', '#FABB01']} style={styles.gradientButton}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loadingText}>Cargando...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#4CAF50', // Matches header color
    width: '100%',
  },
  header: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // We use flexDirection row to arrange the button and title
    paddingHorizontal: 20,
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
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A4A4A',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  infoValue: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  logoutButton: {
    marginTop: 30,
    width: '80%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#4A4A4A',
    textAlign: 'center',
  },
});

export default AccountScreen;
