import React from 'react';
import { useEffect, useState, } from 'react';
import {StyleSheet, View, TextInput, Dimensions, Text} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchBar = () => {
    const styles = StyleSheet.create({
        inputsContainer: {
            zIndex: 3,
        },
        inputBox: {
            width: 350,
            height: (deviceHeight/100)*6,
            borderRadius: 22,
            backgroundColor: '#d6e0cb',
            textAlign: 'left',
            textAlignVertical: 'center',
            flexDirection: 'row',
            fontFamily: '',
            marginLeft: 30,
            marginTop: 10,
          },
    })

    let deviceHeight = Dimensions.get('window').height;
    const [searchQuery, setSearchQuery] = useState(searchQuery);

  // If you type something in the text box that is a color, the background will change to that
  // color.
  return (
    <View style={[styles.inputsContainer, {flex:0.1, }]}>
                    <View style={styles.inputBox}>
						<Icon name = "map-marker" style={{fontSize: 25, marginLeft: 17, marginRight: 8, paddingTop: 13}}/>
						<TextInput
							autoCorrect={false}
							secureTextEntry={false}
							style={{flex: 1, fontFamily: 'lucida grande', fontSize: 20}}
							placeholder = "Where to?"
							placeholderTextColor="#9F9F9F"
							onChangeText={(searchQuery) => setSearchQuery(searchQuery)}
							value={searchQuery}
						/>
                        <Text>HELLLO</Text>
                    </View>
                </View>
  );
};


export default SearchBar;