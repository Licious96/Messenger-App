import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const LoginScreen = ({ navigation }) => {
    const [userId, setUserId] = useState(null)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('')
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`

    const loginFunc = async() => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)

        try {
            const res = await axios.post(`${url}/login`, formData)
            const jsonValue = JSON.stringify(res.data.id)
            await AsyncStorage.setItem('@user_id', jsonValue)
            navigation.navigate("Messages")
        } catch (error) {
            console.log(error.response.data)
            setErrors(error.response.data)
        }
    }

    useEffect(async()=>{
        const user_idd = await AsyncStorage.getItem("@user_id")
        const id = JSON.parse(user_idd)
        if (id !== null) {
            navigation.navigate('Messages');
        }
    },[userId])

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <FontAwesome5 name='rocketchat' size={50} color='#000' />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email/Phone number"
                    placeholderTextColor="#e5e5e5"
                    autoCapitalize='none'
                    onChangeText={(value) => setUsername(value)}
                />
            </View>
            {errors?.username ? <Text style={styles.errorMsg}>{errors.username}</Text>:  null}
            {errors?.usernameError ? <Text style={styles.errorMsg}>{errors.usernameError}</Text>: null}

            <View style={[styles.inputView, { marginTop: 20,}]}>
                <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="#e5e5e5"
                secureTextEntry={true}
                onChangeText={(value) => setPassword(value)}
                />
            </View>
            {errors?.password ? <Text style={styles.errorMsg}>{errors.password}</Text>:  null}
            {errors?.passwordError ? <Text style={styles.errorMsg}>{errors.passwordError}</Text>: null}

            <TouchableOpacity>
                <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={loginFunc}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerBtn} onPress={()=> navigation.navigate('Register')}>
                <Text>REGISTER</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    icon: {
        marginBottom: 40,
    },

    inputView: {
        backgroundColor: "#2D4DF4",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: -3,
        alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        color: '#fff',
        alignItems: 'center',
    },

    forgot_button: {
        height: 30,
        marginTop: 5,
        marginBottom: 30,
        color: 'blue'
    },

    loginBtn: {
        width: "70%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#F57045",
    },

    loginText: {
        color: '#fff'
    },

    registerBtn: {
        width: "70%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        backgroundColor: "#FFF",
        borderWidth: 1
    },

    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        marginBottom: 10,
        marginTop: 3
    },
});