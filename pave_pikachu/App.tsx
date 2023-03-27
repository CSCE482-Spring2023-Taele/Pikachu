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
import GetRoute from './route';

MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

const App = () => {
	
	const [accessibilityEntrances, setAccessibilityEntrances] = useState([]);
	const [route, setRoute] = useState([]);
	useEffect(() => {
		console.log("hi1")
		let accessibilityEntrances = []
		AccessibilityEntrances(0,1000).then(resp => resp.features).then(features => {
		  features.forEach((entrance: { geometry: any; }) => {
		    accessibilityEntrances.push(entrance.geometry)
		  });
		}).catch(err => console.log(err));

		AccessibilityEntrances(1000,522).then(resp => resp.features).then(features => {
			features.forEach((entrance: { geometry: any; }) => {
				accessibilityEntrances.push(entrance.geometry)
			});
			setAccessibilityEntrances(accessibilityEntrances)
		}).catch(err => console.log(err));

    	GetRoute(-96.34156349159862,30.617461341278755,		// start lat, start long
			 -96.34093271645857,30.621243030403335, "abc")		// end lat, end long, token
			.then(resp => resp.features)
			.then(features => {
				setRoute(features[0].geometry.coordinates);
			}).catch(err => console.log(err));
	}, [])

	// const getBoundingBox = (feature) => {
	// 	const bounds = feature.properties.visibleBounds;
	// 	const topRight = bounds[0];
	// 	const bottomLeft = bounds[1];
	// 	console.log("bounds", bounds)
	// }

	return (
		<View style={styles.page}>
			<View style={styles.container}>
				<MapLibreGL.MapView style={styles.map} styleURL={"mapbox://styles/mapbox/streets-v12"}>
					<MapLibreGL.Camera
						zoomLevel={16}
						centerCoordinate={[-96.3365, 30.6187]}
					/>
					{
						route.length > 0 &&
						<MapLibreGL.ShapeSource
							id="routetest"
							lineMetrics={true}
							shape={{
								type: 'Feature',
								geometry: {
									type: 'LineString',
									coordinates: route,
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