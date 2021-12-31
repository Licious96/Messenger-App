import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddProfileScreen from './screens/AddProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddContact from './screens/AddContact';
const Stack = createNativeStackNavigator()

export default function App({route}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Messages'>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false}} />
        <Stack.Screen name="AddProfile" component={AddProfileScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Chats" component={ChatScreen} options={({route}) => ({title: route.params.userName})} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{title: 'Profile'}} />
        <Stack.Screen name="AddContact" component={AddContact} options={{title: 'Add Contact'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
