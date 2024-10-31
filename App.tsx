// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import {getAuth, 
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword} from 'firebase/auth';
// import {initializeApp} from 'firebase/app';
// import { firebaseConfig } from './firebase-config';
// import { NavigationContainer,useNavigation } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>HomeScreen</Text>
//     </View>
//   );
// }
//   function LoginScreen() {
//       const [email, setEmail] = React.useState('');
//       const [password, setPassword] = React.useState('');
//       const navigation = useNavigation();

//       const app = initializeApp(firebaseConfig);
//       const auth = getAuth(app);

//       const handleLogin = () => {
//         signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//           // Signed in
//           const user = userCredential.user;
//           console.log('Usuario logueado', user);
//           navigation.navigate('Home');
//         })
//         .catch((error) => {
//           const errorCode = error.code;
//           const errorMessage = error.message;
//           console.log('Error al loguear', errorCode);
//           Alert.alert(error.message);
//         });
//       }
//     return (
//       <View style={styles.maincontainer}>
//         <Text style={styles.title}>Hola !!</Text>
//         <Text style={styles.subtitle}>Inicia Sesión con tu cuenta </Text>
//         <TextInput onChangeText={(text) => setEmail(text)}  
//           style={styles.textInput}
//           placeholder="foodbank@gmail.com"
//         />
        
//         <TextInput onChangeText={(text) => setPassword(text)} 
//           style={styles.textInput}
//           placeholder="********"
//         />

//         <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => alert('Recuperación de contraseña')}>
//           <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleLogin} style={styles.button}>
//           <LinearGradient
//             colors={['#E20429', '#FABB01']}
//             start={{ x: 1, y: 0 }}
//             end={{ x: 0, y: 1 }}
//             style={styles.gradientButton}
//           >
//             <Text style={styles.textButton}>Iniciar Sesión</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//         <StatusBar style="auto" />
//       </View>
//     );
//   }

// export default function App() {
//   const Stack = createNativeStackNavigator();
//   return (
//   <NavigationContainer>
//     <Stack.Navigator>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Home" component={HomeScreen} />
//     </Stack.Navigator>
//   </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   maincontainer: {
//     flex: 1,
//     backgroundColor: '#f1f1f1',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 70,
//     color: '#3434D',
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 18,
//     color: 'gray',
//   },
//   textInput: {
//     padding: 10,
//     paddingStart: 30,
//     width: '80%',
//     height: 50,
//     marginTop: 20,
//     borderRadius: 30,
//     backgroundColor: 'white',
//   },
//   textButton: {
//     color: 'white',
//     fontSize: 15,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   button: {
//     width: '50%',
//     height: 40,
//     borderRadius: 20,
//     overflow: 'hidden',
//     marginTop: 40,
//   },
//   gradientButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   forgotPasswordButton: {
//     marginTop: 10,
//   },
//   forgotPasswordText: {
//     color: 'gray',
//     fontSize: 15,
//     textDecorationLine: 'underline', // Para dar apariencia de enlace
//   },
// });

// src/App.tsx
// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';

// Crear el stack de navegación
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
