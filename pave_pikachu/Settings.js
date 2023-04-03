import React, { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { attemptReport } from './functions.js';


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;


export default function SettingsScreen() {
    const [description, setDescription] = useState("");
    const [reportLocation, setReportLocation] = useState("");

    const report = async() => {
        let response = await attemptReport(12, 12, "puddle", description);
        console.log(response.message);
    }
    
    return (
        <View style={[styles.container]}>
            <View style={{flex: 1 }}>
                <Text style={[styles.titleText]}>Report</Text>
            </View>

            <View style={[styles.inputsContainer, {flex: 3 }]}>
                <Text>Description</Text>
                <View style={[styles.inputBox, {textAlignVertical: "top"}]}>
                <TextInput
                    multiline={true}
                    autoCorrect={false}
                    numberOfLines={5}
                    secureTextEntry={false}
                    style={{flex: 1, fontFamily: 'lucida grande', textAlignVertical: 'top'}}
                    placeholderTextColor="#9F9F9F"
                    onChangeText={newText => setDescription(newText)}
                />
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex: 1 }]}>
                <TouchableOpacity onPress={() => report()} style={[styles.buttons, {marginRight: 10}]}>
                    <Text style={{fontFamily: 'lucida grande'}}>Report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
  
const styles = StyleSheet.create({
container: {
    backgroundColor: '#C8D5B9',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: "column",
    padding: 20
},
titleText: {
    backgroundColor: '#C8D5B9',
    alignItems: 'center',
    fontSize: 32,
    fontWeight: '700',
    // lineHeight: '43.58px',
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
    marginBottom: 15,
    marginTop: 15,
},
inputBox: {
    marginBottom: 30,
    width: 300,
    // height: (deviceHeight/100)*6,
    height: "100%",
    borderRadius: 22,
    backgroundColor: '#d6e0cb',
    textAlign: 'left',
    // textAlignVertical: 'center',
    flexDirection: 'row',
    fontFamily: '',
    textAlignVertical: "top"
},
inputDescription: {
    marginBottom: 30,
    width: 300,
    height: (deviceHeight/100)*18,
    borderRadius: 22,
    backgroundColor: '#d6e0cb',
    textAlign: 'left',
    textAlignVertical: 'top',
    flexDirection: 'row',
    fontFamily: '',
},
inputsContainer: {
    zIndex: 3,
    padding: 20
},
map: {
    flex: 1,
}
});