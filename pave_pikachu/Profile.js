import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Platform } from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements'

import { useIsFocused } from "@react-navigation/native";

import { getSavedLocations, reverseGeocodingAPI, deleteSavedLocation, deleteAccount } from './functions.js';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;


export default function ProfileScreen({navigation, route}) {

    const mapboxToken = "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA"
    const token = route.params.token;
    const temp2 = route.params.user;

    const [savedLocationData, setSavedLocationData] = useState([]);

    const isFocused = useIsFocused();

	useEffect(() => {
        console.log("in profile")
        console.log(mapboxToken);
		const fetchData = async () => {
			const databaseSavedLocations = await getSavedLocations(token);
			console.log(databaseSavedLocations[0])
			let tempArray = []
			
			for (location of databaseSavedLocations) {
				const response = await reverseGeocodingAPI(location.longitude, location.latitude, mapboxToken);
				console.log("features:",response.features[0])
				tempArray.push(response.features[0])
			}
			console.log("REVERSE GEO PROFILE",tempArray)
			setSavedLocationData(tempArray)
		}
		fetchData().catch(console.error);
	}, [isFocused])
    
    

    return (
        <View style={[styles.container, {flex: 1}]}>
            <View style={{flex: 0.1}}>
                <Text style={[styles.titleText]}>Profile</Text>
            </View>

            <View style={{flex: 0.21, }}>
                <Image source={{uri: temp2.photo}} style={styles.image}/>
            </View>


            <View style={[styles.inputsContainer, {flex:0.14, }]}>
            <Text style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 15, paddingBottom: 0, fontWeight: '500', fontSize: 17}}>First Name</Text>
                <View style={styles.inputBox}>
                    <Text style={{flex: 1, fontFamily: 'lucida grande', fontWeight: '500', paddingTop: 13, fontSize: 17, paddingLeft: 20}}>{temp2.givenName}</Text>
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex:0.14, }]}>
                <Text style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 15, paddingBottom: 0, fontWeight: '500', fontSize: 17}}>Last Name</Text>
                <View style={styles.inputBox}>
                    <Text style={{flex: 1, fontFamily: 'lucida grande', fontWeight: '500', paddingTop: 13, fontSize: 17, paddingLeft: 20}}>{temp2.familyName}</Text>
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex:0.29,}]}>
                <Text style={{flex: 1, fontFamily: 'lucida grande', paddingLeft: 15, paddingBottom: 5, fontWeight: '500', fontSize: 17}}>Saved Location(s)</Text>
                <View style={[styles.locationBox,]}>
                    <FlatList
                            data={savedLocationData}
                            renderItem={({item}) =>
                            <View style={{flexDirection: 'row', borderBottomWidth: 1}}>
                                <View style={{width: 250}}>
                                    <Text style={{paddingTop:20,
                                        paddingBottom:3, 
                                        marginHorizontal: 10,
                                        fontSize: 17, }}>{item.place_name}</Text>
                                </View>
                                <TouchableOpacity style = {{alignSelf: 'flex-end'}}>
                                    <View style={{display: 'flex', justifyContent: 'center', marginBottom: 10}}>
                                        <Icon onPress={ () => {deleteSavedLocation(item.geometry.coordinates[0], item.geometry.coordinates[1], token), navigation.navigate('Home', {token: token, user: temp2})}} name = "delete" style={{fontSize: 25, justifyContent:"center", padding: 10}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }/>
                </View>
            </View>

            <View style={[styles.inputsContainer, {flex: .1 }]}>
                <TouchableOpacity onPress={() => {deleteAccount(token), navigation.navigate('Login')}} style={[styles.buttons, {marginRight: 10}]}>
                    <Text style={{fontFamily: 'lucida grande'}}>Delete Account</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}
  
const styles = StyleSheet.create({
container: {
    backgroundColor: '#b3c7f7',
    alignItems: 'center',
    justifyContent: 'center',
},
titleText: {
    backgroundColor: '#b3c7f7',
    alignItems: 'center',
    fontSize: 32,
    fontWeight: '700',
    // lineHeight: '43.58px',
},
buttons: {
    display: 'flex',
    justifyContent: 'center',
    width: 150,
    height: (deviceHeight/100)*6,
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#d1daf0',
    borderRadius: 22,
    marginBottom: 15,
    marginTop: 15,
},
image: {
    resizeMode: "contain",
    height: 130,
    width: 130,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 1,
},
inputBox: {
    marginBottom: 30,
    width: 300,
    height: (deviceHeight/100)*6,
    borderRadius: 22,
    backgroundColor: '#d1daf0',
    textAlign: 'left',
    textAlignVertical: 'center',
    flexDirection: 'row',
    fontFamily: '',
},
locationBox: {
    marginBottom: 30,
    width: 300,
    height: (deviceHeight/100)*20,
    borderRadius: 22,
    backgroundColor: '#d1daf0',
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