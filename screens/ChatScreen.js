import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, Image } from 'react-native';
import { Bubble, GiftedChat, Send, Composer, Actions } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Constants from 'expo-constants';
import {LocationView} from '../components/LocationView'
import * as Location from 'expo-location';

const ChatScreen = ({route, navigation}) => {

    const {userOneObj} = route.params
    const {userTwoObj} = route.params
    const [messages, setMessages] = useState([]);
    const [location, setLocation] = useState(null);
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
    const webUrl = `https://messenger.stokoza.co.za/public/api`

    const locationPersmission = async() => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

    const sendLocation = async(messages = []) => {
        locationPersmission()
        const location = await Location.getCurrentPositionAsync({});
        const cusText = null;
        const latitude = JSON.stringify(location.coords.latitude)
        const longitude = JSON.stringify(location.coords.longitude)
        try {
            await axios.get(`${webUrl}/sendLocation/${userOneObj.id}/${userTwoObj.id}/${cusText}/${latitude}/${longitude}`)
        } catch (error) {
            console.log(error.response.data)
        }
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
        );
    }

    useEffect(async() => {
        try {
            const res = await axios.get(`${webUrl}/getMessages/${userOneObj.id}/${userTwoObj.id}`);
            let msg = res.data.map((msg)=> ({
                _id: msg.id,
                text: msg.text,
                createdAt: msg.created_at,
                location: {
                    latitude: msg.latitude,
                    longitude: msg.longitude,
                },
                user: {
                    _id: msg.user_one,
                    name: userOneObj.id == msg.user_one ? userOneObj.username : userTwoObj.username,
                    avatar: userOneObj.id == msg.user_one ? userOneObj.image : userTwoObj.image,
                }
            }))
            const sorted = msg.reverse()
            setMessages(sorted)
        } catch (error) {
            console.log(error.response.data)
        }

    }, [messages])


    const onSend = useCallback(async(messages = []) => {
        const cusText = messages[0].text;
        try {
            await axios.get(`${webUrl}/sendMsg/${userOneObj.id}/${userTwoObj.id}/${cusText}`)
        } catch (error) {
            console.log(error.response.data)
        }
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [{
                _id: 9999,
                text: cusText,
                createdAt: new Date(),
                location: {
                    latitude: null,
                    longitude: null,
                },
                user: {
                  _id: userOneObj.id,
                },
            }]),
        );
    }, []);

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons
                        name="send-circle"
                        style={{ marginBottom: 5, marginRight: 5 }}
                        size={32}
                        color="#2e64e5"
                    />
                </View>
            </Send>
        );
    };

    const renderBubble = (props) => {
        const {currentMessage} = props
        if (currentMessage.location.latitude !== null) {
            return <LocationView location={currentMessage.location} />
        }
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2e64e5',
                    },
                    left: {
                        backgroundColor: '#fff',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                }}
            />
        );
    };

    const scrollToBottomComponent = () => {
        return (
            <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
    }
    
    const renderComposer = (props) => {
        return (
            <Composer
            {...props}
            textInputStyle={{
                color: '#222B45',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#E4E9F2',
                paddingTop: 8.5,
                paddingBottom: 8.5,
                paddingHorizontal: 12,
                marginLeft: 5,
                marginTop: 5,
                marginBottom: 5,
            }}
            
            />
        )
    }

    const renderActions = (props) => (
        <Actions
          {...props}
          icon={() => (
            <MaterialCommunityIcons
                name="paperclip"
                style={{ marginBottom: -5, marginLeft: -5, marginTop: -5 }}
                size={32}
                color="#899499"
            />
          )}
          options={{
            'Share live location': () => {
                sendLocation()
            },
            Cancel: () => {
              console.log('Cancel');
            },
          }}
          optionTintColor="#222B45"
        />
      );

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: userOneObj.id,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            renderComposer={renderComposer}
            renderActions={renderActions}
        />
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});