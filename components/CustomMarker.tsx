import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps'
import { FontAwesome5 } from '@expo/vector-icons'
import Colors from '@/constants/Colors';

interface CustomMarkerProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  onPress:()=>void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ coordinates, onPress }) => {
    //will recieve co ordinates of locations 

  return (
    <Marker coordinate={coordinates} onPress={onPress} >
    <View style={styles.marker}>
      <Text style={styles.markerText}>

        {<FontAwesome5 name="box-open" size={24} color={Colors.theme.primary} />}
      </Text>
    </View>
    </Marker>
  )
}

export default CustomMarker;

const styles=StyleSheet.create({
    marker:{
        backgroundColor: 'white',
        padding: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
      },
      markerText:{
        color: 'black',
        fontFamily: 'Inter-Regular',
      }
})
