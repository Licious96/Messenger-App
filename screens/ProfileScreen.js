import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Text, ScrollView, ToastAndroid } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const ProfileScreen = ({route, navigation}) => {

    let {userObj} = route.params
    const userId = userObj.id
    const [image, setImage] = useState(userObj.image !== null ? userObj.image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
    const [username, setUsername] = useState(userObj.username)
    const [email, setEmail] = useState(userObj.email)
    const [contacts, setContacts] = useState(userObj.contacts)
    const [password, setPassword] = useState(userObj.password)
    const [errors, setErrors] = useState('')
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
    const webUrl = `https://messenger.stokoza.co.za/public/api`
    
    const pickImage = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (granted === true) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: false,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })
            if (!result.cancelled) {
                setImage(result.uri)
            }

            //const filename = result.uri.split('/').pop();
        }

    }

    const saveProfile = async() => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('image', image)
        try {
            const res = await axios.post(`${url}/updateProfile/${userId}`, formData)
            ToastAndroid.show("Your profile was updated", ToastAndroid.SHORT);
        } catch (error) {
            setErrors(error.response.data)
        }
    }

    const moveImage = async() => {
        try {
            // const fileInfo = await FileSystem.copyAsync({
            //     from: image,
            //     to: `file://C:/Users/Leago/Desktop/Projects/Messenger/assets/${image.split('/').pop()}`,
            // })
            await moveFile('source/unicorn.png', 'destination/unicorn.png');
            console.log('The file has been moved');
        } catch (error) {
            console.log(error)
        }
        
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profilePhoto}>
                <View style={{ marginTop: 15 }}>
                    <ImageBackground
                        source={{
                            uri: image
                        }}
                        style={{ height: 150, width: 150 }}
                        imageStyle={{ borderRadius: 75 }}
                    >
                        <View style={styles.cameraIconView}>
                            <TouchableOpacity onPress={pickImage}>
                                <FontAwesome5 name="camera" size={35} color="#fff" style={styles.cameraIcon} />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </View>
            <ScrollView >

                <View style={styles.userDetails}>
                    <View style={styles.userItem}>
                        <FontAwesome5 name="user-circle" color="#777777" size={25} />
                        <TextInput style={styles.userItemText}
                            placeholder="Username"
                            placeholderTextColor="#666666"
                            defaultValue={userObj.username}
                            onChangeText={(value) => setUsername(value)}
                        />
                    </View>
                    {errors?.username ? <Text style={styles.errorMsg}>{errors.username}</Text>:  null}

                    <View style={styles.userItem}>
                        <FontAwesome5 name="envelope" color="#777777" size={25} />
                        <TextInput style={styles.userItemText}
                            placeholder="Email address"
                            placeholderTextColor="#666666"
                            autoCapitalize='none'
                            keyboardType='email-address'
                            defaultValue={userObj.email}
                            editable={false}
                            onChangeText={(value) => setEmail(value)}
                        />
                    </View>
                    {errors?.email ? <Text style={styles.errorMsg}>{errors.email}</Text>:  null}

                    <View style={styles.userItem}>
                        <FontAwesome5 name="mobile-alt" color="#777777" size={25} />
                        <TextInput style={styles.userItemText}
                            placeholder="Phone numbers"
                            placeholderTextColor="#666666"
                            defaultValue={userObj.contacts}
                            editable={false}
                            onChangeText={(value) => setContacts(value)}
                        />
                    </View>
                    {errors?.contacts ? <Text style={styles.errorMsg}>{errors.contacts}</Text>:  null}

                    <View style={styles.userItem}>
                        <FontAwesome5 name="lock" color="#777777" size={25} />
                        <TextInput style={styles.userItemText}
                            placeholder="Password"
                            placeholderTextColor="#666666"
                            defaultValue="******"
                            editable={false}
                            onChangeText={(value) => setPassword(value)}
                        />
                    </View>
                    {errors?.password ? <Text style={styles.errorMsg}>{errors.password}</Text>:  null}

                    <View style={styles.userItem} >
                        <TouchableOpacity style={styles.saveButton} onPress={moveImage}>
                            <Text style={styles.saveTitle}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    profilePhoto: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    userDetails: {
        marginTop: 10,
    },
    userItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,

    },
    userItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        borderBottomWidth: 1,
        width: '80%',
        borderBottomColor: '#2D4DF4'
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#F57045',
        alignItems: 'center',
        marginTop: 10,
        width: '100%'
    },
    saveTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    cameraIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        padding: 5,
        borderRadius: 10,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        marginLeft: 73,
        marginTop: -12
    },
});
