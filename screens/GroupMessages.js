import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image, Alert, ToastAndroid } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from '../styles/MessagesStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import moment from 'moment';

const GroupMessages = ({ navigation }) => {
    const [userObj, setUserObj] = useState({})
    const [groups, setGroups] = useState([])
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
    const webUrl = `https://messenger.stokoza.co.za/public/api`

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                const user_id = await AsyncStorage.getItem("@user_id")
                const id = JSON.parse(user_id)
                try {
                    const res = await axios.get(`${url}/getUser/${id}`)
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
                    const res = await axios.get(`${url}/getGroups/${id}`)
                    setGroups(res.data)
                } catch (e) {
                    console.log(e)
                }
            };
            fetchUser();
        }, [])
    );

    const emptyScreen = () => {
        return (
            <View style={styles.emptyContainer}>
                <FontAwesome5 name="comments" size={80} color="#666" />
                <Text style={styles.text}>Chats empty, please create a new group to chat</Text>
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
        <SafeAreaView style={styles.container}>
            <Container >
                <FlatList
                    data={groups}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={emptyScreen}
                    renderItem={({ item }) => (
                        <Card
                            onLongPress={()=>alert(userObj.id, item.id)}
                            onPress={() => navigation.navigate('GroupChat', { userTwoObj: item, userOneObj: userObj, userName: item.name, convId: item.conv_id })}
                        >
                            <UserInfo>
                                <UserImgWrapper>
                                    <UserImg source={{ uri: item.image !== '' ? item.image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }} />
                                </UserImgWrapper>
                                <TextSection>
                                    <UserInfoText>
                                        <UserName numberOfLines={1}>{item.name}</UserName>
                                        <PostTime>{moment(item.created_at).fromNow()}</PostTime>
                                    </UserInfoText>
                                </TextSection>
                            </UserInfo>
                        </Card>
                    )}
                />
            </Container>
        </SafeAreaView>
    )
}

export default GroupMessages

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
