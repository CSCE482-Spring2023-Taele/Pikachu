import React, { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { attemptRegister } from './functions.js';

const logo = require('./assets/pave.png')
const logo_text_black = require('./assets/pave_text_black.png')

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState("");
    const [firstName, setFirst] = useState("");
    const [lastName, setLast] = useState("");

    const tryRegister = async() => {
        let response = await attemptRegister(email, firstName, lastName);
        if(response.message === "user created") {
            const tkn = response.token;
            navigation.navigate("RegisterSuccess", {token: tkn});
        }
    }

    return ( 
        <View style={[styles.container, {flex: 1,}]}>
            <View style={{flex: 0.3, fontFamily: 'lucia grande', }}>
                {/* <View style={{flex: 0.1, justifyContent: 'flex-end', marginLeft: deviceWidth/2.0, backgroundColor: 'red'}}>
                    <Text style={{fontSize: 30}}> Register</Text>
                </View> */}
                <View style={{flex: 0.5, justifyContent: 'flex-start', paddingBottom: 100}}>
                    <Image source={logo_text_black} style={styles.image}/>
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex:0.1, }]}>
                <View style={styles.inputBox}>
                {/* <Icon name = "email-outline" style={{fontSize: 22, marginLeft: 17, marginRight: 8, paddingTop: 13}}/> */}
                <TextInput
                    autoCorrect={false}
                    secureTextEntry={false}
                    style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 20}}
                    placeholder = "E-mail"
                    placeholderTextColor="#9F9F9F"
                    onChangeText={newText => setEmail(newText)}
                />
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex:0.1, }]}>
                <View style={styles.inputBox}>
                {/* <Icon name = "pencil" style={{fontSize: 22, marginLeft: 17, marginRight: 8, paddingTop: 13}}/> */}
                <TextInput
                    autoCorrect={false}
                    secureTextEntry={false}
                    style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 20}}
                    placeholder = "First Name"
                    placeholderTextColor="#9F9F9F"
                    onChangeText={newText => setFirst(newText)}
                />
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex:0.1, }]}>
                <View style={styles.inputBox}>
                {/* <Icon name = "pencil" style={{fontSize: 22, marginLeft: 17, marginRight: 8, paddingTop: 13}}/> */}
                <TextInput
                    autoCorrect={false}
                    secureTextEntry={false}
                    style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 20}}
                    placeholder = "Last Name"
                    placeholderTextColor="#9F9F9F"
                    onChangeText={newText => setLast(newText)}
                />
                </View>
            </View>

            <View style={{flex: 0.25,}}>
                <TouchableOpacity style={styles.buttons} onPress={() => tryRegister()}>
                    <Text style={{fontFamily: 'lucida grande'}}>Register</Text>
                </TouchableOpacity>
            </View>

            {/* <StatusBar style="auto" /> */}
        </View>
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