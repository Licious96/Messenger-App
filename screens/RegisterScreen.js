import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ( {navigation} ) => {
    const [email, setEmail] = useState('');
    const [contacts, setContacts] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({})
    const { manifest } = Constants
    const url = `http://${manifest.debuggerHost.split(':').shift().concat(':8000')}/api`
    const webUrl = `https://messenger.stokoza.co.za/public/api`

    const register = async() => {

        const formData = new FormData()
        formData.append('email', email)
        formData.append('contacts', contacts)
        formData.append('password', password)
        formData.append('password_confirmation', confirmPassword)

        try {
            const res = await axios.post(`${webUrl}/register`, formData)
            const jsonValue = JSON.stringify(res.data.id)
            await AsyncStorage.setItem('@user_id', jsonValue)
            navigation.navigate("AddProfile")
        } catch (error) {
            setErrors(error.response.data)
        }
        
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={30}>
                <View style={styles.icon}>
                    <FontAwesome5 name='rocketchat' size={50} color='black'/>
                </View>  
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Email"
                        placeholderTextColor="#e5e5e5"
                        keyboardType="email-address"
                        autoCapitalize='none'
                        onChangeText={(value) => setEmail(value)}
                    />
                </View>
                {errors?.email ? <Text style={styles.errorMsg}>{errors.email}</Text>:  <Text style={styles.errorMsg}></Text>}

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Phone number"
                        placeholderTextColor="#e5e5e5"
                        maxLength={10}
                        keyboardType="numeric"
                        onChangeText={(value) => setContacts(value)}
                    />
                </View>
                {errors?.contacts ? <Text style={styles.errorMsg}>{errors.contacts}</Text>:  <Text style={styles.errorMsg}></Text>}
                
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor="#e5e5e5"
                        secureTextEntry={true}
                        onChangeText={(value) => setPassword(value)}
                    />
                </View>
                {errors?.password ? <Text style={styles.errorMsg}>{errors.password}</Text>:  <Text style={styles.errorMsg}></Text>}

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="#e5e5e5"
                        secureTextEntry={true}
                        onChangeText={(value) => setConfirmPassword(value)}
                    />
                </View>
                {errors?.password ? <Text style={styles.errorMsg}>{errors.password}</Text>:  <Text style={styles.errorMsg}></Text>}

                <TouchableOpacity style={styles.registerBtn} onPress={register}>
                    <Text style={styles.loginText}>REGISTER</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
                    <Text style={styles.forgot_button}>Already have an account? Login</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 60
    },

    icon: {
        marginBottom: 40,
    },

    inputView: {
        flex: 1,
        backgroundColor: "#2D4DF4",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: -3,
        alignItems: "center",
        justifyContent: 'center'
    },

    TextInput: {
        flex: 1,
        height: 50,
        padding: 10,
        color: '#fff',
        textAlign: 'center'
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
        color: 'blue'
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
        backgroundColor: "#F57045",
        marginBottom: 10,
    },

    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        marginBottom: 20,
        marginTop: 3
    },
});