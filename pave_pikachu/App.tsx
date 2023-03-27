/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useEffect, useState } from 'react';
import AccessibilityEntrances from './ada';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './Home.js';
import SettingsScreen from './Settings.js';
import ProfileScreen from './Profile.js';
import LoginScreen from './Login.js';
import RegisterScreen from './Register.js';
import RegisterSuccessScreen from './RegisterSuccess.js'

// MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

const Tab = createBottomTabNavigator();

function MyTabs({navigation, route}) {
//   const temp = route.params.token;

  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{headerShown: false, tabBarStyle: { backgroundColor: '#C8D5B9', borderTopWidth: 1, borderTopColor: '#EEF1EA',}}}>
      
      <Tab.Screen name="Settings" component={SettingsScreen}  options={{
            headerShown: false,
            tabBarIcon:  ({color}) => {
              return (
                <Icon name = "flag" style={{fontSize: 25}}/>
              );},
            tabBarShowLabel: false,
            }}/>
      <Tab.Screen name="Home" component={HomeScreen}  options={{
            headerShown: false,
            tabBarIcon:  ({color}) => {
              return (
                <Icon name = "map-search-outline" style={{fontSize: 25}}/>
              );},
            tabBarShowLabel: false,
            }}/>

      <Tab.Screen name="Profile" component={ProfileScreen}  options={{
            headerShown: false,
            tabBarIcon:  ({color}) => {
              return (
                <Icon name = "account" style={{fontSize: 25}}/>
              );},
            tabBarShowLabel: false,
            }}/>
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

const App = () => {
	
	// const [accessibilityEntrances, setAccessibilityEntrances] = useState([]);
	// useEffect(() => {
	// 	console.log("hi1")
	// 	let accessibilityEntrances = []
	// 	AccessibilityEntrances(0,1000).then(resp => resp.features).then(features => {
	// 	  features.forEach((entrance: { geometry: any; }) => {
	// 	    accessibilityEntrances.push(entrance.geometry)
	// 	  });
	// 	  console.log("length1", accessibilityEntrances.length)
	// 	}).catch(err => console.log(err));

	// 	AccessibilityEntrances(1000,1522).then(resp => resp.features).then(features => {
	// 		features.forEach((entrance: { geometry: any; }) => {
	// 			accessibilityEntrances.push(entrance.geometry)
	// 		});
	// 		console.log("length2", accessibilityEntrances.length)
	// 		setAccessibilityEntrances(accessibilityEntrances)
	// 	}).catch(err => console.log(err));
	// }, [])

	// const getBoundingBox = (feature) => {
	// 	const bounds = feature.properties.visibleBounds;
	// 	const topRight = bounds[0];
	// 	const bottomLeft = bounds[1];
	// 	console.log("bounds", bounds)
	// }

	// return (
	// 	<View style={styles.page}>
	// 		<View style={styles.container}>
	// 			<MapLibreGL.MapView style={styles.map} styleURL={"mapbox://styles/mapbox/streets-v12"} onRegionDidChange={getBoundingBox}>
	// 				<MapLibreGL.Camera
	// 					zoomLevel={16}
	// 					centerCoordinate={[-96.3365, 30.6187]}
	// 				/>
	// 				{accessibilityEntrances.map((p, i) => {
	// 					return (
	// 						<MapLibreGL.PointAnnotation
	// 							key={`square-${i}`}
	// 							id={`square-${i}`}
	// 							coordinate={[p.x, p.y]}
	// 							anchor={{x: 0, y: 0}}
	// 							onSelected={() => console.log("here", i)}
	// 							onDeselected={() => console.log("here2", i)} >
	// 								<View style={styles.small}>
	// 								</View>
	// 						</MapLibreGL.PointAnnotation>
	// 					)
	// 				}
	// 			)} 
	// 			</MapLibreGL.MapView>
	// 		</View>
	// 	</View>
	// );

	return (
		<NavigationContainer>
		  <Stack.Navigator initialRouteName={'Login'} screenOptions={{headerShown: false}}>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Tabs" component={MyTabs} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
		  </Stack.Navigator>
		</NavigationContainer>
	  );
}

export default App;

const styles = StyleSheet.create({
	page: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1, 
		height: "100%",
		width: "100%",
	},
	map: {
		flex: 1
	},
	small: {
		backgroundColor: 'blue',
		height: 10,
		justifyContent: 'center',
		width: 10,
		flex: 1,
	}
});