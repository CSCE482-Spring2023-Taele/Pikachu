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
	LogBox
} from 'react-native';

LogBox.ignoreLogs(['Possible']);
LogBox.ignoreLogs(['View']);

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './Home.js';
import ReportScreen from './Report.js';
import ProfileScreen from './Profile.js';
import LoginScreen from './Login.js';
import RegisterScreen from './Register.js';
import RegisterSuccessScreen from './RegisterSuccess.js';

// MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

const Tab = createBottomTabNavigator();

function MyTabs({navigation, route}) {
  const temp = route.params.token;
  const temp2 = route.params.user;

  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{headerShown: false, tabBarStyle: { backgroundColor: '#b3c7f7', borderTopWidth: 1, borderTopColor: '#EEF1EA',}}}>
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{token: temp, user: temp2}} options={{
            headerShown: false,
            tabBarIcon:  ({color}) => {
              return (
                <Icon name = "map-search-outline" style={{fontSize: 25}}/>
              );},
            tabBarShowLabel: false,
            }}/>

      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{token: temp, user: temp2}} options={{
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
	return (
		<NavigationContainer>
		  <Stack.Navigator initialRouteName={'Login'} screenOptions={{headerShown: false}}>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Tabs" component={MyTabs} />
			<Stack.Screen name="Report" component={ReportScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
		  </Stack.Navigator>
		</NavigationContainer>
	  );
}

export default App;