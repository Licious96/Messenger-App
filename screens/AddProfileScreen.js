import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, ImageBackground, Image, StyleSheet, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const AddProfileScreen = ({ navigation }) => {
    const [userId, setUserId] = useState(null)
    const [image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
    const webUrl = `https://messenger.stokoza.co.za/public/api`

    useEffect(async () => {
        const user_id = await AsyncStorage.getItem("@user_id")
        const id = JSON.parse(user_id)
        setUserId(id)
    }, [userId])


    const permisson = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted') {
                alert("Permission denied!")
            }
        }
    }

    const pickImage = async () => {
        permisson()
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })
        if (!result.cancelled) {
            setImage(result.uri)
        }
    }

    const saveUserProfile = async () => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('image', image)

        try {
            const res = await axios.post(`${webUrl}/addProfile/${userId}`, formData)
            console.log(res.data)
            navigation.navigate("Messages")
        } catch (error) {
            setError(error.response.data)
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headerText}>Profile info</Text>
            <Text style={styles.smallText}>Please enter your username and an optional profile picture</Text>
            <View style={{ alignItems: 'center', marginBottom: 25 }}>
                <TouchableOpacity onPress={pickImage}>
                    <View
                        style={{
                            height: 100,
                            width: 100,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <ImageBackground
                            source={{
                                uri: image,
                            }}
                            style={{ height: 100, width: 100 }}
                            imageStyle={{ borderRadius: 15 }}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <FontAwesome5
                                    name="camera"
                                    size={35}
                                    color="#fff"
                                    style={{
                                        opacity: 0.7,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: '#fff',
                                        borderRadius: 10,
                                    }}
                                />
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.textInput}>
                <TextInput onChangeText={(value) => setUsername(value)} placeholder="Username" placeholderTextColor="#666666" />
            </View>
            {error?.username ? <Text style={styles.errorMsg}>{error.username}</Text> : <Text style={styles.errorMsg}></Text>}

            <TouchableOpacity style={styles.nextBtn} onPress={saveUserProfile}>
                <Text style={styles.nextText}>NEXT</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default AddProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },

    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#F57045',
        width: '70%',
        color: '#05375a',
        alignItems: 'center',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },

    headerText: {
        fontSize: 25,
        color: '#F57045',
        marginTop: '20%',
        marginBottom: 20
    },

    smallText: {
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
    },

    nextBtn: {
        width: "70%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#F57045",
    },

    nextText: {
        color: '#fff'
    },
});
