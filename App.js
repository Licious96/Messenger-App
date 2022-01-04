import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddProfileScreen from './screens/AddProfileScreen';
import ChatScreen from './screens/ChatScreen';
import GroupChat from './screens/GroupChats';
import ProfileScreen from './screens/ProfileScreen';
import AddContact from './screens/AddContact';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import TabStack from './screens/TabStack';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateGroup from './screens/CreateGroup';
import { TouchableOpacity} from 'react-native';
import AddParticipant from './screens/AddParticipant';

export default function App() {

  const Stack = createNativeStackNavigator()
  const [userObj, setUserObj] = useState({})
  const { manifest } = Constants
  const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
  const webUrl = `https://messenger.stokoza.co.za/public/api`


  useEffect(async () => {
    const user_id = await AsyncStorage.getItem("@user_id")
    const id = JSON.parse(user_id)
    try {
      const res = await axios.get(`${webUrl}/getUser/${id}`)
      setUserObj(res.data)
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
          <Stack.Screen name='Home' component={TabStack}
            options={({ navigation }) => ({
              title: 'Messenger',
              headerTintColor: '#F57045',
              headerRight: () => (
                <Menu>
                  <MenuTrigger>
                    <FontAwesome5 name='ellipsis-v' color='#000' size={25} style={{ padding: 10 }} />
                  </MenuTrigger>
                  <MenuOptions style={{ margin: 10 }}>
                    <MenuOption onSelect={() => navigation.navigate('Profile', { userObj: userObj })} >
                      <Text style={{ fontSize: 18, padding: 7, }}>My profile</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => navigation.navigate('AddContact', { userId: userObj.id })} >
                      <Text style={{ fontSize: 18, padding: 7, }}>Add contact</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => navigation.navigate('CreateGroup', { userId: userObj.id })} >
                      <Text style={{ fontSize: 18, padding: 7, }}>Create group</Text>
                    </MenuOption>
                    <MenuOption onSelect={async()=> {await AsyncStorage.removeItem('@user_id'), navigation.navigate("Login")}} >
                      <Text style={{ fontSize: 18, padding: 7, }}>Logout</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              )
            })}
          />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddProfile" component={AddProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Chats" component={ChatScreen} options={({ route }) => ({ title: route.params.userName })} />
          <Stack.Screen 
            name="GroupChat" 
            component={GroupChat} 
            options={({ route, navigation }) => ({ 
              title: route.params.userName,
              headerRight: () => (
                <TouchableOpacity onPress={()=> navigation.navigate('AddParticipant', {convId: route.params.convId})}>
                  <FontAwesome5 name='plus' color='#000' size={25} style={{ padding: 10 }} />
                </TouchableOpacity>
              )
              })} 
            />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="AddContact" component={AddContact} options={{ title: 'Add Contact' }} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ title: 'Create New Group' }} />
          <Stack.Screen name="AddParticipant" component={AddParticipant} options={{ title: 'Add Participant' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
