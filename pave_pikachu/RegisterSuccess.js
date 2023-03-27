import React, { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const logo = require('./assets/pave.png')
const logo_text_black = require('./assets/pave_text_black.png')

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default function RegisterSuccessScreen({navigation,route}) {
    const token = route.params.token;

    return ( 
        <View style={[styles.container, {flex: 1}]}>
            <View style={{flex: 0.3, fontFamily: 'lucia grande', }}>
                {/* <Text style={{fontSize: 30}}> Register</Text> */}
                <Image source={logo_text_black} style={styles.image}/>
            </View>

            <View style={{flex: 0.25,}}>
                <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate("Tabs", {token})}>
                    <Text style={{fontFamily: 'lucida grande'}}>Login</Text>
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