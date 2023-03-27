import React, { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//const [description, setDescription] = useState("");
//const [reportLocation, setReportLocation] = useState("");

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;


export default function SettingsScreen() {

    return (
        <View style={[styles.container, {flex: 1}]}>
            <View style={{flex: 0.15, }}>
                <Text style={[styles.titleText]}>Report</Text>
            </View>

            <View style={[styles.inputsContainer]}>
                <Text style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 15, paddingBottom: 8, fontWeight: '500', fontSize: 17}}>Description</Text>
                <View style={styles.inputDescription}>
                <TextInput
                    autoCorrect={false}
                    secureTextEntry={false}
                    style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 20}}
                    //onChange={(e) => setDescription(e.currentTarget.value)}
                />
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex:0.1, }]}>
                <View style={styles.inputBox}>
                {<Icon name = "google-maps" style={{fontSize: 22, marginLeft: 17, marginRight: 8, paddingTop: 13}}/>}
                <TextInput
                    autoCorrect={false}
                    secureTextEntry={false}
                    style={{flex: 1, fontFamily: 'lucida grande'}}
                    placeholder = "Location"
                    placeholderTextColor="#9F9F9F"
                    //onChange={(e) => setReportLocation(e.currentTarget.value)}
                />
                </View>
            </View>

            <View style={{flex: 0.25, flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Tabs')} style={[styles.buttons, {marginRight: 10}]}>
                    <Text style={{fontFamily: 'lucida grande'}}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Tabs')} style={[styles.buttons, {marginLet: 10}]}>
                    <Text style={{fontFamily: 'lucida grande'}}>Delete</Text>
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
    height: (deviceHeight/100)*6    ,
    borderRadius: 22,
    backgroundColor: '#d6e0cb',
    textAlign: 'left',
    textAlignVertical: 'center',
    flexDirection: 'row',
    fontFamily: '',
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
},
map: {
    flex: 1,
}
});