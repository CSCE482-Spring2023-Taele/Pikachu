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
	FlatList,
	KeyboardAvoidingView
} from 'react-native';

import MapLibreGL from '@maplibre/maplibre-react-native';
import { useEffect, useState } from 'react';
import { GetObstructions, GetPath } from './path';
import SearchBar from './SearchBar';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Geolocation from '@react-native-community/geolocation'; // for location
import { geocodingAPI, saveLocation, getSavedLocations, reverseGeocodingAPI } from './functions';
// import { KeyboardAvoidingView } from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

export default function HomeScreen({navigation, route}) {
	const token = route.params.token;

	//const accessTokenPromise = MapLibreGL.getAccessToken().then((promise) => {return promise})
	const mapboxToken = "pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA"
	
	const [selected, setSelected] = useState('')
	const [currentLongitude, setCurrentLongitude] = useState(0);
	const [currentLatitude, setCurrentLatitude] = useState(0);
	const [locationStatus, setLocationStatus ] = useState('');

	// request location of phone
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

	// current location of phone
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
	
	// current location of phone
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

	// obstructions
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

	// routing
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
	const [searchData, setSearchData] = useState([])
	const [searchQuery, setSearchQuery] = useState("");
	const [listVisible, setListVisible] = useState(false);
	const [mapVisible, setMapVisible] = useState(true);
	const [savedLocationListVisible, setSavedLocationListVisible] = useState(false)
	const [savedLocationData, setSavedLocationData] = useState([])

	useEffect(() => {

		if(searchQuery != "" && searchQuery.length > 4) {
			const fetchData = async () => {
				const temp = await geocodingAPI(searchQuery, mapboxToken);;
				setSearchData(temp.features)
			}
			fetchData().catch(console.error);
			setListVisible(true)
			setMapVisible(false)
			setSavedLocationListVisible(false)
		}
		else if(searchQuery != "" && searchQuery.length <= 4) {
			setListVisible(false)
			setMapVisible(false)
			setSavedLocationListVisible(true)
		}
		else {
			setMapVisible(true);
			setListVisible(false);
			setSavedLocationListVisible(false);
		}
	},[searchQuery, listVisible]);
	
	// makes search list visible/invisible
	function listStyle() {
		if (listVisible == true) {
			return {
				flex: 1,
				display:'flex',
				// position: "absolute",
				// top: "5%"
			}
		}
		else {
			return {
				display:'none'
			}
		}
	}
	
	// makes map visible/invisible
	function mapStyle() {
		if(mapVisible == true) {
			return {
				flex: 1,
				display: "flex",
			}
		}
		else {
			return {
				display:'none'
			}
		}
	}

	// sets name of icon next to search bar
	function searchIconName() {
		if (listVisible == true || savedLocationListVisible == true) {
			return "arrow-left"
		}
		else {
			return "map-marker"
		}
	}

	function routeToSelectedSearch(searchCoordinates) {
		setDestinationCoord(searchCoordinates)
		setSelected("route")
	}


	// get data for saved locations
	// updates when the map becomes visible/invisible
	useEffect(() => {
		const fetchData = async () => {
			const databaseSavedLocations = await getSavedLocations(token);
			console.log(databaseSavedLocations[0])
			let tempArray = []
			
			for (location of databaseSavedLocations) {
				const response = await reverseGeocodingAPI(location.longitude, location.latitude, mapboxToken);
				console.log("features:",response.features[0])
				tempArray.push(response.features[0])
			}
			console.log("REVERSE GEO",tempArray)
			setSavedLocationData(tempArray)
		}
		fetchData().catch(console.error);
	}, [mapVisible])

	// make saved locations visible
	function savedLocationStyle() {
		if (savedLocationListVisible == true) {
			return {
				flex: 1,
				display:'flex',
				
				// position: "absolute",
				// top: "5%"
			}
		}
		else {
			return {
				display:'none'
			}
		}
	}

	const [showObstructionDescription, setShowObstructionDescription] = useState(false);
	const [obstructionDescription, setObstructionDescription] = useState({"description": ""});
	const handleShowObstructionDescription = () => setShowObstructionDescription(() => !showObstructionDescription);

	useEffect(() => {
		console.log("obstructionDescription", obstructionDescription)
	}, [showObstructionDescription, obstructionDescription])


	console.log(mapVisible, savedLocationListVisible, listVisible)
	return (

		<View style={styles.page}>

				<KeyboardAvoidingView>
				
				<View style={styles.inputBox}>
					<TouchableOpacity
						onPress={() => {setSearchQuery(""),Keyboard.dismiss(),setListVisible(false), setSavedLocationListVisible(false), setMapVisible(true)}}>

						<Icon name = {searchIconName()} style={{fontSize: 25, justifyContent:"center", padding: 10}}/>
					</TouchableOpacity>
					<TextInput
						autoFocus={false}
						onFocus={() => {setSavedLocationListVisible(true)}}
						autoCorrect={false}
						secureTextEntry={false}
						style={{flex: 1, fontFamily: 'lucida grande', fontSize: 20,}}
						placeholder = "Where to?"
						placeholderTextColor="#686969"
						onChangeText={(searchQuery) => {
							setSearchQuery(searchQuery)
						}}
						value={searchQuery}
						
					/>
				</View>
				

				<FlatList
					style={listStyle()}
					data={searchData}
					keyExtractor={(item, index) => String(index)}
					renderItem={({item, index}) =>
						<View>
							<TouchableOpacity onPress={() => {routeToSelectedSearch(item.geometry.coordinates), setListVisible(false), setSavedLocationListVisible(false), setSearchQuery(""), Keyboard.dismiss()}}>
								<Text style={{paddingTop:20,
								paddingBottom:3, 
								marginHorizontal: 10,
								fontSize: 20, borderBottomWidth: 1}}>{item.place_name}</Text>
							</TouchableOpacity>
						</View>
				}/>

				<View style={savedLocationStyle()}>
					<View>
						<Text style={{paddingTop: 10, paddingLeft: 5}}>Saved Locations</Text>
					</View>
					<FlatList
						
						data={savedLocationData}
						renderItem={({item}) =>
							<View>
								<TouchableOpacity onPress={() => {routeToSelectedSearch(item.geometry.coordinates), setListVisible(false), setSavedLocationListVisible(false), setSearchQuery(""), Keyboard.dismiss()}}>
									<Text style={{paddingTop:20,
									paddingBottom:3, 
									marginHorizontal: 10,
									fontSize: 20, borderBottomWidth: 1}}>{item.place_name}</Text>
								</TouchableOpacity>
							</View>
					}/>
				</View>
				</KeyboardAvoidingView>

				<View style={styles.map_container}>
					<MapLibreGL.MapView 
						style={mapStyle()}
						styleURL={"mapbox://styles/potato797/clfvkdirb000701ryajzh870m"}
						onPress={getSpot}
						visible={true}
					>
					{
						(modalVisible || path.length > 0) &&
						<MapLibreGL.PointAnnotation
							key={"user-marker"}
							id={"user-marker"}
							coordinate={[parseFloat(destinationCoord[0]),parseFloat(destinationCoord[1])]}
							anchor={{x: 0, y: 0}} >
							<View style={[styles.obstruction, {width: 30, height: 30}]}>
							</View>
						</MapLibreGL.PointAnnotation>
					}
						<MapLibreGL.Camera
							zoomLevel={16}
							centerCoordinate={[currentLongitude, currentLatitude]}
						/>
						<MapLibreGL.UserLocation
							visible={true}
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
										anchor={{x: 0, y: 0}}
										onSelected={() => {
											setObstructionDescription((obstruction));
											setShowObstructionDescription(true);
										}}
										onDeselected={() => {
											console.log("DESELECTED");
											setShowObstructionDescription(false);
										}} >
										<View style={styles.obstruction}>
										</View>
									</MapLibreGL.PointAnnotation>
								)
							})
						}
					</MapLibreGL.MapView>
				</View>
				
				<Modal 
					animationType="slide"
					transparent={true}
					visible={showObstructionDescription}
				>
					<TouchableOpacity
						style={{flex:1}}
						onPress={() => {
							setShowObstructionDescription(false)
						}
					}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text>{obstructionDescription["description"]}</Text>
						</View>
					</View>
					</TouchableOpacity>
				</Modal>

				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
				>
					<TouchableOpacity
						style={{flex:1}}
						onPress={() => {
							setModalVisible(false)
						}
					}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => {setSelected("route"); setModalVisible(!modalVisible)}}>
									<Text style={styles.textStyle}>Route</Text>
								</Pressable>
								
								<Pressable
								onPress={() => {navigation.navigate('Report', {lat: destinationCoord[0], long: destinationCoord[1], token: token}), setModalVisible(!modalVisible)}}
								style={[styles.buttons, {marginRight: 10}]}>
									<Text>Report</Text>
								</Pressable>
								
								<Pressable
								onPress={() => {navigation.navigate('Profile', {lat: destinationCoord[0], long: destinationCoord[1], token: token}), setModalVisible(!modalVisible), saveLocation(destinationCoord, token)}}
								style={[styles.button, styles.buttonClose, styles.mbottom]}>
									<Text style={styles.textStyle}>Favorite</Text>
							</Pressable>
							</View>
						</View>
					</TouchableOpacity>
				</Modal>
				
			</View>
	);
}

const styles = StyleSheet.create({
	inputsContainer: {
		elevation: 4,
	},
	inputBox: {
		
		elevation: 5,
		width: "100%",
        height: (deviceHeight/100)*6,
        
        backgroundColor: '#b3c7f7',
        textAlign: 'left',
        textAlignVertical: 'center',
        flexDirection: 'row',
        fontFamily: '',
		alignItems:'center'
	  },
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
        backgroundColor: "#0073e6",
		width: 80,
	  },
	  mbottom: {
		marginBottom: 3,
	  },
	  buttonOpen: {
		backgroundColor: '#F194FF',
	  },
	  buttonClose: {
		backgroundColor: '#0073e6',
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
	map_container: {
		height: "100%",
		width: "100%",
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
		backgroundColor: '#f57600',
		height: 10,
		justifyContent: 'center',
		width: 10,
		flex: 1,
	},
	lineLayer: {
		lineColor: '#0073E6',
		lineCap: 'round',
		lineJoin: 'round',
		lineWidth: 10
	},
});