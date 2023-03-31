import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { attemptLogin } from './functions.js';
import { Platform } from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements'

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';

const logo = require('./assets/pave.png')

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default function LoginScreen({navigation}) {
    // start-google
    const [user, setUser] = useState({})
    useEffect(() => {
        GoogleSignin.configure({
        offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        });
        isSignedIn()
    }, [])
    const signIn = async () => {
        try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo)
        setUser(userInfo)
        } catch (error) {
        console.log('Message', error.message);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User Cancelled the Login Flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Signing In');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services Not Available or Outdated');
        } else {
            console.log('Some Other Error Happened');
        }
        }
    };
    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (!!isSignedIn) {
        getCurrentUserInfo()
        } else {
        console.log('Please Login')
        }
    };
    const getCurrentUserInfo = async () => {
        try {
        const userInfo = await GoogleSignin.signInSilently();
        setUser(userInfo);
        } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            alert('User has not signed in yet');
            console.log('User has not signed in yet');
        } else {
            alert("Something went wrong. Unable to get user's info");
            console.log("Something went wrong. Unable to get user's info");
        }
        }
    };
    const signOut = async () => {
        try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setUser({}); // Remember to remove the user from your app's state as well
        } catch (error) {
        console.error(error);
        }
    };

    // end-google


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
                {!user.idToken ? 
                    <GoogleSigninButton 
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signIn}
                    /> :
                    <TouchableOpacity onPress={signOut}>
                    <Text>Logout</Text>
                    </TouchableOpacity>
                }
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