import React from 'react'
import { View, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MessagesScreen from './MessagesScreen';
import Group from './Group';

const Tab = createMaterialTopTabNavigator()

const TabStack = ({navigation}) => {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                headerShadowVisible: false,
                tabBarActiveTintColor: '#F57045',
                tabBarInactiveTintColor: '#F57045',
                labelStyle: {
                    textAlign: 'center',
                },
                tabBarIndicatorStyle: {
                    borderBottomColor: '#F57045',
                    borderBottomWidth: 2,
                },
            }}>
            <Tab.Screen name="FirstPage" component={MessagesScreen} options={{ tabBarLabel: 'Chats', }} />
            <Tab.Screen name="Group" component={Group} options={{ tabBarLabel: 'Groups', }} />
        </Tab.Navigator>
    )
}

export default TabStack
