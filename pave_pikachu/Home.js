import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React from 'react';
// import type {PropsWithChildren} from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
    Dimensions,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
	PermissionsAndroid,
	Modal,
	Alert,
	Pressable,
} from 'react-native';

import MapLibreGL from '@maplibre/maplibre-react-native';
import { useEffect, useState } from 'react';
import { GetObstructions, GetPath } from './path';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Geolocation from '@react-native-community/geolocation'; // for location

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

export default function HomeScreen({navigation, route}) {
	const token = route.params.token;

	const [selected, setSelected] = useState('')
	const [currentLongitude, setCurrentLongitude] = useState(0);
	const [currentLatitude, setCurrentLatitude] = useState(0);
	const [locationStatus, setLocationStatus ] = useState('');

	useEffect(() =>{
		const requestLocationPermission = async () => {
			try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
				title: 'Location Access Required',
				message: 'This App needs to Access your location',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				//To Check, If Permission is granted
				getOneTimeLocation();
				subscribeLocationLocation();
			} else {
				setLocationStatus('Permission Denied');
			}
			} catch (err) {
			console.warn(err);
			}
		}
		requestLocationPermission();
		return () => {
			Geolocation.clearWatch(watchID);
		};
	}, []);

	const getOneTimeLocation = () => {
		setLocationStatus('Getting Location ...');
		Geolocation.getCurrentPosition(
		  //Will give you the current location
		  (position) => {
			setLocationStatus('You are Here');
	
			//getting the Longitude from the location json
			const currentLongitude = position.coords.longitude;
	
			//getting the Latitude from the location json
			const currentLatitude = position.coords.latitude;
	
			//Setting Longitude state
			setCurrentLongitude(currentLongitude);
			
			//Setting Longitude state
			setCurrentLatitude(currentLatitude);
		  },
		  (error) => {
			setLocationStatus(error.message);
		  },
		  {
			enableHighAccuracy: true,
			timeout: 30000,
			maximumAge: 1000
		  },
		);
	  };
	
	const subscribeLocationLocation = () => {
	watchID = Geolocation.watchPosition(
		(position) => {
		//Will give you the location on location change
		
		setLocationStatus('You are Here');
		console.log(position);

		//getting the Longitude from the location json        
		const currentLongitude = position.coords.longitude;

		//getting the Latitude from the location json
		const currentLatitude = position.coords.latitude;

		//Setting Longitude state
		setCurrentLongitude(currentLongitude);

		//Setting Latitude state
		setCurrentLatitude(currentLatitude);
		},
		(error) => {
		setLocationStatus(error.message);
		},
		{
		enableHighAccuracy: true,
		maximumAge: 1000
		},
	);
	};

	
	const [destinationCoord, setDestinationCoord] = useState([]);
	const [path, setPath] = useState([]);
	const [obstructions, setObstructions] = useState([]);
	const [polygons, setPolygons] = useState([]);

	useEffect(() => {

		const getObstructions = () => {
			GetObstructions(token)
			.then(resp => {
				setObstructions(resp.data);
				setPolygons(resp.polygons)
			})
			.catch(err => console.log(err));
		}

		getObstructions();
		const interval = setInterval(() => {
			getObstructions();
		}, 5 * 60000);				// runs every 5 mins
		
		return () => {
			clearInterval(interval);
		};	
	}, []);

	useEffect(() => {
		if (destinationCoord.length > 0 && selected === "route") {
			GetPath(currentLongitude, currentLatitude,				// user location stuff goes here
					 destinationCoord[0], destinationCoord[1], polygons)
			.then(resp => resp.features)
			.then(features => {
				setPath(features[0].geometry.coordinates);
			})
			.catch(err => console.log(err));

			setSelected("none")
		}
		console.log("destination: ", destinationCoord);    	
	}, [destinationCoord, obstructions, polygons, selected])

	// const getBoundingBox = (feature) => {
	// 	const bounds = feature.properties.visibleBounds;
	// 	const topRight = bounds[0];
	// 	const bottomLeft = bounds[1];
	// 	console.log("bounds", bounds)
	// }

	const getSpot = (feature) => {
		console.log("click: ", feature.geometry.coordinates);
		setDestinationCoord(feature.geometry.coordinates);
		console.log("destination coord: ", destinationCoord);
        //navigation.navigate("Menu", {lat: feature.geometry.coordinates[0], long: feature.geometry.coordinates[1], token: token});
		setModalVisible(true)
		console.log(modalVisible)
	}

	const [modalVisible, setModalVisible] = useState(false);

	return (
		<View style={styles.page}>
			<View style={styles.container}>
				<MapLibreGL.MapView style={styles.map} styleURL={"mapbox://styles/potato797/clfvkdirb000701ryajzh870m"} onPress={getSpot}>
					<MapLibreGL.Camera
						zoomLevel={16}
						centerCoordinate={[currentLongitude, currentLatitude]}
					/>
					{
						path.length > 0 &&
						<MapLibreGL.ShapeSource
							id="path"
							lineMetrics={true}
							shape={{
								type: 'Feature',
								geometry: {
									type: 'LineString',
									coordinates: path,
								},
							}}
						>
							<MapLibreGL.LineLayer id="path-layer" style={styles.lineLayer} />
						</MapLibreGL.ShapeSource>
					}
					{
						obstructions.map((obstruction) => {
							return (
								<MapLibreGL.PointAnnotation
									key={`obstruction-${obstruction.idObstructions}`}
									id={`obstruction-${obstruction.idObstructions}`}
									coordinate={[parseFloat(obstruction.latitude),parseFloat(obstruction.longitude)]}
									anchor={{x: 0, y: 0}} >
									<View style={styles.obstruction}>
									</View>
								</MapLibreGL.PointAnnotation>
							)
						})
					}
					<MapLibreGL.PointAnnotation
						key={"square-start"}
						id={"square-start"}
						coordinate={[-96.34156349159862,30.617461341278755]}
						anchor={{x: 0, y: 0}} >
						<View style={styles.test}>
						</View>
					</MapLibreGL.PointAnnotation>
				</MapLibreGL.MapView>
			</View>




			
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
				Alert.alert('Modal has been closed.');
				setModalVisible(!modalVisible);
				}}>
				<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Pressable
					style={[styles.button, styles.buttonClose, styles.mbottom]}
					onPress={() => {setSelected("route"); setModalVisible(!modalVisible)}}>
						<Text style={styles.textStyle}>Route</Text>
					</Pressable>
					<Pressable
					onPress={() => {navigation.navigate('Report', {lat: destinationCoord[0], long: destinationCoord[1], token: token}), setModalVisible(!modalVisible)}}
					style={[styles.button, styles.buttonClose, styles.mbottom]}>
						<Text style={styles.textStyle}>Report</Text>
					</Pressable>
					<Pressable
					onPress={() => {navigation.navigate('Profile', {lat: destinationCoord[0], long: destinationCoord[1], token: token}), setModalVisible(!modalVisible)}}
					style={[styles.button, styles.buttonClose, styles.mbottom]}>
						<Text style={styles.textStyle}>Favorite</Text>
					</Pressable>
				</View>
				</View>
			</Modal>
			
		</View>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	  },
	  modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	  },
	  button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	  },
	  mbottom: {
		marginBottom: 3,
	  },
	  buttonOpen: {
		backgroundColor: '#F194FF',
	  },
	  buttonClose: {
		backgroundColor: '#2196F3',
	  },
	  textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: 'center',
	  },

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
	test: {
		backgroundColor: 'yellow',
		height: 15,
		justifyContent: 'center',
		width: 15,
		flex: 1,
	},
	obstruction: {
		backgroundColor: 'red',
		height: 10,
		justifyContent: 'center',
		width: 10,
		flex: 1,
	},
	lineLayer: {
		lineColor: 'green',
		lineCap: 'round',
		lineJoin: 'round',
		lineWidth: 10
	},
});