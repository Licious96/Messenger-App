import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image, Alert, ToastAndroid } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from '../styles/MessagesStyles';
import { MenuProvider } from 'react-native-popup-menu';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import moment from 'moment';

const MessagesScreen = ({ navigation }) => {
    const [userObj, setUserObj] = useState({})
    const [friends, setFriends] = useState([])
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
    const webUrl = `https://messenger.stokoza.co.za/public/api`

    useEffect(async () => {
        const user_idd = await AsyncStorage.getItem("@user_id")
        const id = JSON.parse(user_idd)
        if (id === null) {
            navigation.navigate('Login');
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                const user_id = await AsyncStorage.getItem("@user_id")
                const id = JSON.parse(user_id)
                try {
                    const res = await axios.get(`${webUrl}/getUser/${id}`)
                    setUserObj(res.data)
                } catch (e) {
                    console.log(e)
                }
            };
            fetchUser();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                const user_id = await AsyncStorage.getItem("@user_id")
                const id = JSON.parse(user_id)
                try {
                    const res = await axios.get(`${webUrl}/getFriends/${id}`)
                    setFriends(res.data)
                } catch (e) {
                    console.log(e)
                }
            };
            fetchUser();
        }, [])
    );

    const logout = async () => {
        const id = await AsyncStorage.removeItem('@user_id')
        if (id === null) {
            navigation.navigate("Login")
        }
    }

    const emptyScreen = () => {
        return (
            <View style={styles.emptyContainer}>
                <FontAwesome5 name="comments" size={80} color="#666" />
                <Text style={styles.text}>Chats empty, please press the plus button to add new contacts to chat with</Text>
            </View>
        )
    }

    const alert = (userOne, userTwo) => {
        Alert.alert(
            "Remove chat",
            "Are you sure you want to delete this chat?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteContact(userOne, userTwo),
                    style: "cancel",
                },
            ],
            {
                cancelable: true,
            }
        );
    }

    const getNewChats = async() => {
        const user_id = await AsyncStorage.getItem("@user_id")
        const id = JSON.parse(user_id)
        try {
            const res = await axios.get(`${url}/getFriends/${id}`)
            setFriends(res.data)
        } catch (e) {
            console.log(e)
        }
    }

    const deleteContact = async(userOne, userTwo) => {
        try {
            await axios.post(`${url}/deleteContact/${userOne}/${userTwo}`)
            ToastAndroid.show("Chat deleted", ToastAndroid.SHORT);
            getNewChats()
        } catch (error) {
            console.log(error.response.data)
        }
    }

    return (
        <MenuProvider>
            <SafeAreaView style={styles.container}>

                <View style={styles.headerBar}>
                    <View>
                        <Text style={styles.headerText}>Messenger</Text>
                    </View>
                    <View >
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
                                <MenuOption onSelect={() => alert(`Save`)} >
                                    <Text style={{ fontSize: 18, padding: 7, }}>Create group</Text>
                                </MenuOption>
                                <MenuOption onSelect={logout} >
                                    <Text style={{ fontSize: 18, padding: 7, }}>Logout</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>

                <Container >
                    <FlatList
                        data={friends.sort((a,b)=> b.created_at - a.created_at)}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={emptyScreen}
                        renderItem={({ item }) => (
                            <Card
                                onLongPress={()=>alert(userObj.id, item.id)}
                                onPress={() => navigation.navigate('Chats', { userTwoObj: item, userOneObj: userObj, userName: item.username })}
                            >
                                <UserInfo>
                                    <UserImgWrapper>
                                        <UserImg source={{ uri: item.image }} />
                                    </UserImgWrapper>
                                    <TextSection>
                                        <UserInfoText>
                                            <UserName numberOfLines={1}>{item.username}</UserName>
                                            <PostTime>{moment(item.created_at).fromNow()}</PostTime>
                                        </UserInfoText>
                                        <MessageText numberOfLines={2}>{item.email}</MessageText>
                                    </TextSection>
                                </UserInfo>
                            </Card>
                        )}
                    />
                </Container>
                <TouchableOpacity style={styles.floatingActionBtn} onPress={() => navigation.navigate('AddContact', { userId: userObj.id })}>
                    <FontAwesome5 name="plus" size={25} color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        </MenuProvider>
    )
}

export default MessagesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    headerBar: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        width: '100%',
    },

    headerText: {
        fontSize: 25,
        color: '#F57045',
        marginTop: '20%',
        marginBottom: 20
    },

    headerIcons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },

    msgContainer: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

    floatingActionBtn: {
        backgroundColor: "#F57045",
        width: 55,
        height: 55,
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyContainer: {
        marginTop: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },

    text: {
        color: '#666',
        fontSize: 25,
        marginHorizontal: 25,
        textAlign: 'center'
    }
});
