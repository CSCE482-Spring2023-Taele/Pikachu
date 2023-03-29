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
import GetRoute from './route';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

export default function HomeScreen({navigation, route}) {
    const token = route.params.token;

	const [accessibilityEntrances, setAccessibilityEntrances] = useState([]);
    const [destinationCoord, setDestinationCoord] = useState([]);
    const [path, setPath] = useState([]);

	useEffect(() => {
		console.log("hi1")
		let accessibilityEntrances = []
		// AccessibilityEntrances(0,1000).then(resp => resp.features).then(features => {
		//   features.forEach((entrance: { geometry: any; }) => {
		//     accessibilityEntrances.push(entrance.geometry)
		//   });
		// }).catch(err => console.log(err));

		AccessibilityEntrances(1000,22).then(resp => resp.features).then(features => {
			features.forEach((entrance: { geometry: any; }) => {
				accessibilityEntrances.push(entrance.geometry)
			});
			setAccessibilityEntrances(accessibilityEntrances)
		}).catch(err => console.log(err));

        if (destinationCoord.length > 0) {
            GetRoute(-96.34156349159862,30.617461341278755,		// start lat, start long
			 destinationCoord[0], destinationCoord[1], token)		// end lat, end long, token
			.then(resp => resp.features)
			.then(features => {
				setPath(features[0].geometry.coordinates)
                console.log("right here", destinationCoord);
			}).catch(err => console.log(err));
        }

        console.log("path: ", path);
        console.log("destination: ", destinationCoord);
    	
	}, [destinationCoord])

    const getBoundingBox = (feature) => {
		const bounds = feature.properties.visibleBounds;
		const topRight = bounds[0];
		const bottomLeft = bounds[1];
		console.log("bounds", bounds)
	}

    const getSpot = (feature) => {
        console.log("click: ", feature.geometry.coordinates);
        setDestinationCoord(feature.geometry.coordinates);
        console.log("destination coord: ", destinationCoord);



        GetRoute(-96.34156349159862,30.617461341278755,		// start lat, start long
			 destinationCoord[0], destinationCoord[1], token)		// end lat, end long, token
			.then(resp => resp.features)
			.then(features => {
				setPath(features[0].geometry.coordinates)
                console.log("right here", destinationCoord);
			}).catch(err => console.log(err));
    }

    return (
		<View style={styles.page}>
			<View style={styles.container}>
				<MapLibreGL.MapView style={styles.map} styleURL={"mapbox://styles/mapbox/streets-v12"} onPress={getSpot}>
					<MapLibreGL.Camera
						zoomLevel={16}
						centerCoordinate={[-96.3365, 30.6187]}
					/>
					{
						path.length > 0 &&
						<MapLibreGL.ShapeSource
							id="routetest"
							lineMetrics={true}
							shape={{
								type: 'Feature',
								geometry: {
									type: 'LineString',
									coordinates: path,
								},
							}}
						>
							<MapLibreGL.LineLayer id="layer1" style={styles.lineLayer} />
						</MapLibreGL.ShapeSource>
					}
					<MapLibreGL.PointAnnotation
						key={"square-obstruction"}
						id={"square-obstruction"}
						coordinate={[-96.34027547415353,30.618426650474873]}
						anchor={{x: 0, y: 0}} >
						<View style={styles.obstruction}>
						</View>
					</MapLibreGL.PointAnnotation>
					<MapLibreGL.PointAnnotation
						key={"square-obstruction2"}
						id={"square-obstruction2"}
						coordinate={[-96.34125079989082,30.61932832736686]}
						anchor={{x: 0, y: 0}} >
						<View style={styles.obstruction}>
						</View>
					</MapLibreGL.PointAnnotation>
					<MapLibreGL.PointAnnotation
						key={"square-start"}
						id={"square-start"}
						coordinate={[-96.34156349159862,30.617461341278755]}
						anchor={{x: 0, y: 0}} >
						<View style={styles.test}>
						</View>
					</MapLibreGL.PointAnnotation>
					<MapLibreGL.PointAnnotation
						key={`square-end`}
						id={`square-end`}
						coordinate={[-96.34093271645857,30.621243030403335]}
						anchor={{x: 0, y: 0}} >
						<View style={styles.test}>
						</View>
					</MapLibreGL.PointAnnotation>
					{accessibilityEntrances.map((p, i) => {
						return (
							<MapLibreGL.PointAnnotation
								key={`square-${i}`}
								id={`square-${i}`}
								coordinate={[p.x, p.y]}
								anchor={{x: 0, y: 0}}
								onSelected={() => console.log("here", i)}
								onDeselected={() => console.log("here2", i)} >
									<View style={styles.small}>
									</View>
							</MapLibreGL.PointAnnotation>
						)
					}
				)} 
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
	small: {
		backgroundColor: 'blue',
		height: 10,
		justifyContent: 'center',
		width: 10,
		flex: 1,
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
		height: 15,
		justifyContent: 'center',
		width: 15,
		flex: 1,
	},
	lineLayer: {
		lineColor: 'green',
		lineCap: 'round',
		lineJoin: 'round',
		lineWidth: 14
	},
});