import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
            {/* <StatusBar style="auto" /> */}
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
});