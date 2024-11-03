import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import AdminAddUser from './components/AdminAddUser';
import InventoryScreen from './components/InventoryScreen';
import AddProductScreen from './components/AddProductScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="AdminAddUser" component={AdminAddUser}/>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="InventoryScreen" component={InventoryScreen}/>
            <Stack.Screen name="AddProductScreen" component={AddProductScreen}/>
        </Stack.Navigator>
    );
}