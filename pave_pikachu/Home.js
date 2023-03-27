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

MapLibreGL.setAccessToken("pk.eyJ1IjoicG90YXRvNzk3IiwiYSI6ImNsZmRmcnJnNzB3dXIzd2xkb3BmMmJldXIifQ.l7JlC4101MBrzt5cLCh2CA");

export default function HomeScreen({navigation, route}) {
    // const token = route.params.token;

    const [accessibilityEntrances, setAccessibilityEntrances] = useState([]);
    useEffect(() => {
		console.log("hi1")
		let accessibilityEntrances = []
		AccessibilityEntrances(0,1000).then(resp => resp.features).then(features => {
		  features.forEach((entrance: { geometry: any; }) => {
		    accessibilityEntrances.push(entrance.geometry)
		  });
		  console.log("length1", accessibilityEntrances.length)
		}).catch(err => console.log(err));

		AccessibilityEntrances(1000,1522).then(resp => resp.features).then(features => {
			features.forEach((entrance: { geometry: any; }) => {
				accessibilityEntrances.push(entrance.geometry)
			});
			console.log("length2", accessibilityEntrances.length)
			setAccessibilityEntrances(accessibilityEntrances)
		}).catch(err => console.log(err));
	}, [])

    const getBoundingBox = (feature) => {
		const bounds = feature.properties.visibleBounds;
		const topRight = bounds[0];
		const bottomLeft = bounds[1];
		console.log("bounds", bounds)
	}

    return (
        <View style={styles.page}>
                    <View style={styles.container}>
                        <MapLibreGL.MapView style={styles.map} styleURL={"mapbox://styles/mapbox/streets-v12"} onRegionDidChange={getBoundingBox}>
                            <MapLibreGL.Camera
                                zoomLevel={16}
                                centerCoordinate={[-96.3365, 30.6187]}
                            />
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
	}
});