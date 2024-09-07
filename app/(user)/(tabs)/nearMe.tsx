import React, { useState ,useEffect} from 'react'
import { View, Text, StyleSheet, Alert,Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from "expo-location";
import { useDonationRequests, useDonationRequestsWithCategory } from '@/app/hooks/useDonation';
import { useRouter } from 'expo-router';
import CustomMarker from '@/components/CustomMarker';


const nearMe = () => {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {data: donationRequests} = useDonationRequestsWithCategory()
  const router = useRouter() // Using router for navigation

  



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  if (errorMsg) {
    Alert.alert("Error", errorMsg);
  }
  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
      <Text style={styles.instructionText}>Select a donation request near you</Text>
      </View>

    {location ? (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922, // You can adjust the zoom level
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true} // Show the user's current location on the map
      >
       {donationRequests
            ?.filter(
              (donationRequest) =>
                donationRequest.latitude !== null && donationRequest.longitude !== null // Ensure latitude and longitude are not null
            )
            .map((donationRequest) => (
              <CustomMarker
                key={donationRequest.donation_request_id}
                coordinates={{
                  latitude: donationRequest.latitude as number, // Cast to number as we are sure it's not null
                  longitude: donationRequest.longitude as number,
                }}
                onPress={() =>
                  router.push({
                    pathname: `/donationRequest/[id]`,
                    params: { id: donationRequest.donation_request_id },
                  })
                }
              />
            ))}
      </MapView>
    ) : (
      <Text>Loading map...</Text>
    )}
  </View>
  )
}

export default nearMe;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  
  instructionText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'LeagueSpartan-Regular',
    textAlign: 'center',
  },
  instructionContainer: {
    position: 'absolute', // Absolute positioning to overlay on the map
    top: 80, // Adjust this value to move the text down from the top
    zIndex: 1, // Ensure the text is displayed above the map
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background for readability
    padding: 10,
    borderRadius: 30,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',

  }
});