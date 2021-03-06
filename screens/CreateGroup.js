import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Text, ToastAndroid} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';

const CreateGroup = ({route, navigation}) => {

    const userId = route.params.userId
    const [errors, setErrors] = useState('')
    const [name, setName] = useState('')
    const [image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    const [msgError, setMsgError] = useState('')
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
    const webUrl = `https://messenger.stokoza.co.za/public/api`

    const createGroup = async() => {
        const formData = new FormData();
        formData.append('name', name)
        formData.append('image', image)
        try {
            const res = await axios.post(`${webUrl}/createGroup/${userId}`, formData)
            ToastAndroid.show("Group created", ToastAndroid.SHORT);
            navigation.navigate('Home')
            setMsgError('')
        } catch (error) {
           setErrors(error.response.data)
            setMsgError(error.response.data.msg)
        }
        
    }
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.userDetails}>
                <View style={styles.userItem}>
                    <FontAwesome5 name="users" color="#777777" size={25} />
                    <TextInput 
                        onChangeText={(value) => setName(value)} 
                        style={styles.userItemText} 
                        placeholder="Enter group name" 
                        placeholderTextColor="#666666" 
                    />
                </View>
                {errors?.name ? <Text style={styles.errorMsg}>{errors.name}</Text>:  null}
                {msgError ? <Text style={styles.errorMsg}>{msgError}</Text>:  null}
                <View style={styles.userItem} >
                    <TouchableOpacity style={styles.saveButton} onPress={createGroup}>
                        <Text style={styles.saveTitle}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default CreateGroup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        marginLeft: 73,
        marginRight: 30,
        marginTop: -12
    },
});