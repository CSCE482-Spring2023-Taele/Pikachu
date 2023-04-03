import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default function MenuScreen({navigation, route}) {
    const lat = route.params.lat;
    const long = route.params.long;
    const token = route.params.token;

    return (
        <View style={{flex: 1, backgroundColor: '#C8D5B9', width: deviceWidth, padding: 30, borderTopLeftRadius: 22,borderTopRightRadius: 22, height: 600}}>
            
            <View style={{marginBottom: 90}}>
                <Text style={[styles.titleText]}>Report hazard or route?</Text>
            </View>

            <View style={{flex: 0.25, flexDirection: 'row', marginLeft: 90}}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings', {lat: lat, long: long, token: token})} style={[styles.buttons, {marginRight: 10}]}>
                    <Text style={{fontFamily: 'lucida grande'}}>Report</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Home', {lat: lat, long: long, token: token})} style={[styles.buttons, {marginLeft: 10}]}>
                    <Text style={{fontFamily: 'lucida grande'}}>Route</Text>
                </TouchableOpacity>
            </View>
           
        </View>
    );
}
  
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#C8D5B9',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 10,
  },
  titleText: {
    backgroundColor: '#C8D5B9',
    alignItems: 'center',
    fontSize: 32,
    fontWeight: '700',
    // lineHeight: '43.58px',
},
});