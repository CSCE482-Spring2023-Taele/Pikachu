import React, { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { attemptLogin } from './functions.js';
import { Platform } from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements'

const logo = require('./assets/pave.png')

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const tryLogin = async() => {
        let response = await attemptLogin(email);
        console.log(response.message);
        if(response.message === "user logged in") {
            const tkn = response.token;
            navigation.navigate("Tabs", {token: tkn});
        }
    }

    const height = useHeaderHeight();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "android"}
            style={{flex: 1}}
            keyboardVerticalOffset={height + 47}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, {flex: 1,}]}>
                <View style={{flex: 0.33, }}>
                    <Image source={logo} style={styles.image}/>
                </View>

                <View style={[styles.inputsContainer, {flex:0.1, }]}>
                    <View style={styles.inputBox}>
                    <Icon name = "account-circle" style={{fontSize: 22, marginLeft: 17, marginRight: 8, paddingTop: 13}}/>
                    <TextInput
                        autoCorrect={false}
                        secureTextEntry={false}
                        style={{flex: 1, fontFamily: 'lucida grande'}}
                        placeholder = "E-mail"
                        placeholderTextColor="#9F9F9F"
                        onChangeText={newText => setEmail(newText)}
                    />
                    </View>
                </View>

                <View style={[styles.inputsContainer, {flex:0.1, }]}>
                    <View style={styles.inputBox}>
                    <Icon name = "lock" style={{fontSize: 22, marginLeft: 17, marginRight: 8, paddingTop: 13}}/>
                    <TextInput
                        autoCorrect={false}
                        secureTextEntry={true}
                        style={{flex: 1, fontFamily: 'lucida grande'}}
                        placeholder = "Password"
                        placeholderTextColor="#9F9F9F"
                        onChangeText={newText => setPassword(newText)}
                    />
                    </View>
                </View>

                <View style={{flex: 0.25, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => tryLogin()} style={[styles.buttons, {marginRight: 10}]}>
                        <Text style={{fontFamily: 'lucida grande'}}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={[styles.buttons, {marginLet: 10}]}>
                        <Text style={{fontFamily: 'lucida grande'}}>Register</Text>
                    </TouchableOpacity>
                </View>

                {/* <StatusBar style="auto" /> */}
            </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
  
const styles = StyleSheet.create({
container: {
    backgroundColor: '#C8D5B9',
    alignItems: 'center',
    justifyContent: 'center',
},
image: {
    marginBottom: 25,
    resizeMode: "contain",
    height: 400,
    width: 400
  },
buttons: {
    display: 'flex',
    justifyContent: 'center',
    width: 80,
    height: (deviceHeight/100)*6,
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#d6e0cb',
    borderRadius: 22,
    marginBottom: 10,
  },
inputsContainer: {
    zIndex: 3,
},
inputBox: {
    marginBottom: 30,
    width: 300,
    height: (deviceHeight/100)*6,
    borderRadius: 22,
    backgroundColor: '#d6e0cb',
    textAlign: 'left',
    textAlignVertical: 'center',
    flexDirection: 'row',
    fontFamily: '',
  }
});