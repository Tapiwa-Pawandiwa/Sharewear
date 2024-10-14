import React, { useState,useEffect,useCallback } from "react";
import { View, Text, StyleSheet, Image, Pressable , FlatList, KeyboardAvoidingView, Platform, Alert} from "react-native";
import RoundedButton from "@/components/RoundedButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import StepCounter from "@/components/StepCounter";
import Colors from "@/constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import { Keyboard } from "react-native";
import TagSelector from "@/components/TagSelectors";
import { TextInput } from "react-native";
import { useFormContext } from "@/app/providers/Form";
import CustomRadioButton from "@/components/CustomRadioButton";
import { supabase } from "@/lib/supabase";
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import * as Location from "expo-location"; // Importing expo-location


const RequestStepOne: React.FC = () => {
  const router = useRouter();
  const { formData, updateFormData, clearFormData } = useFormContext();
  const arrowIcon = <AntDesign name="arrowright" size={24} color="white" />;
  const [headline, setHeadline] = useState(formData.headline || '');
  let [locationInfo, setLocationInfo] = useState({} as any);

 


  // Update formData whenever headline changes
  useEffect(() => {
    updateFormData('headline', headline);
  }, [headline]);

  const handleChangeText = (text: string) => {
    setHeadline(text);
  };

  useEffect(() => {
    updateFormData('latitude', locationInfo.latitude);
    updateFormData('longitude', locationInfo.longitude);
    updateFormData('place_id', locationInfo.place_id);
    updateFormData('main_location', locationInfo.main_text);
    updateFormData('secondary_location', locationInfo.secondary_text);
    updateFormData('formatted_address', locationInfo.formatted_address);
  }, [locationInfo]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature."
        );
      }
    };

    requestLocationPermission();
  }, []);

  const renderContent = () => {
    return (
      <View>
        <Image style={styles.headBox} source={require("../../../assets/images/birdbox.png")} />
        <Text style={styles.header}>Request Form</Text>
        <StepCounter currentStep={1} totalSteps={3} />
        <Text style={styles.heading}>What is your request Headline?</Text>
        <TextInput
        style={styles.input}
        onChangeText={handleChangeText}
        value={headline}
        placeholder="Help me with.."
        autoCorrect={false}
      />
        <Text style={styles.heading}>Select the pickup location for your request</Text>
      <View style={styles.googleContainer}>
      <GooglePlacesAutocomplete
  placeholder='Pickup location for items'
  query={{key:'AIzaSyA11amKpXti4LiFqwOidmgQ8FmJDaARqVM',    language: 'en',}}
  fetchDetails={true}
  styles={{
    textInput:{
      fontSize: 14,
      borderRadius: 25,
      backgroundColor: Colors.grey.alt,
      width: 350,
    
    },
  }}
  onPress={(data, details = null) => {
    // Dismiss the keyboard before handling the selection
    Keyboard.dismiss();

    if (details) {
      setLocationInfo({
        place_id: details.place_id,
        formatted_address: details.formatted_address,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        main_text: data.structured_formatting.main_text,
        secondary_text: data.structured_formatting.secondary_text,
      });
    }
  }}
  onFail={error => console.log(error)}
  onNotFound={() => console.log('no results')}
keyboardShouldPersistTaps="handled"
  listEmptyComponent={(
    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
      <Text>No results were found</Text>
    </View>
  )}
/>

     
      </View>
        <Text style={styles.heading}>Select Tags associated with your situation</Text>
<View style={styles.tagBox}>
          <TagSelector />
      </View>
 

        <RoundedButton title="Next" link="/createRequest/RequestStepTwo" icon={arrowIcon} buttonStyle={styles.nextButton} textStyle={styles.nextText} />
      </View>
    );
  };

  return (
    <SafeAreaView  style={styles.mainContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={renderContent}
          keyExtractor={item => item.key}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RequestStepOne;

const styles = StyleSheet.create({ 
  mainContainer:{
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  googleContainer:{
    marginLeft: 20,
    marginRight: 20,
    width: 300,
    alignSelf: 'center',
  },

  headBox:{
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  heading:{
    fontSize: 20,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  input: {
    height: 40,
    margin: 12,
    backgroundColor: Colors.grey.alt,
    padding: 10,
    borderRadius: 25,
    width: 350,
    alignSelf: 'center',
    marginBottom: 20,
  },
  nextButton: {
    width: 150,
    backgroundColor: Colors.green.main,
    alignContent: 'center',
    alignSelf: 'center',
  },
  nextText: {
    color:'white',
    textAlign: 'left',
    lineHeight: 30,
  },
  tagBox:{
    padding: 10,
  
  }

});