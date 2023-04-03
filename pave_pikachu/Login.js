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
        webClientId: '99909288202-frnld5j1beior6spugv29em5in4t8atg.apps.googleusercontent.com', 
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
        // user signed in and now we redirect
        const response = await attemptLogin(userInfo);
        if(response.message === "user logged in") {
            navigation.navigate("Tabs", {token: response.token});
        }
        
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
        console.log(userInfo)
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
        // found user signed in and now we redirect
        const response = await attemptLogin(userInfo);
        if(response.message === "user logged in") {
            navigation.navigate("Tabs", {token: response.token});
        }
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

                {!user.idToken ? 
                    <GoogleSigninButton 
                    style={{ width: 192, height: 48, }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signIn}
                    
                    /> :
                    <TouchableOpacity onPress={signOut}>
                    <Text>button</Text>
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