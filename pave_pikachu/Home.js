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
	Keyboard
} from 'react-native';

import MapLibreGL from '@maplibre/maplibre-react-native';
import { useEffect, useState } from 'react';
import { GetObstructions, GetPath } from './path';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

export default function HomeScreen({navigation, route}) {
	const token = route.params.token;

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
		if (destinationCoord.length > 0) {
			GetPath(-96.34156349159862,30.617461341278755,				// user location stuff goes here
					 destinationCoord[0], destinationCoord[1], polygons)
			.then(resp => resp.features)
			.then(features => {
				setPath(features[0].geometry.coordinates);
			})
			.catch(err => console.log(err));
		}
		console.log("destination: ", destinationCoord);    	
	}, [destinationCoord, obstructions, polygons])

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
	}

	return (
		<View style={styles.page}>
			<View style={styles.container}>
				<MapLibreGL.MapView style={styles.map} styleURL={"mapbox://styles/potato797/clfvkdirb000701ryajzh870m"} onPress={getSpot}>
					<MapLibreGL.Camera
						zoomLevel={16}
						centerCoordinate={[-96.3365, 30.6187]}
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
		</View>
	);
}

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