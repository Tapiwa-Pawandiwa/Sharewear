import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable , FlatList, KeyboardAvoidingView, Platform} from "react-native";
import RoundedButton from "@/components/RoundedButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import StepCounter from "@/components/StepCounter";
import Colors from "@/constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import TagSelector from "@/components/TagSelectors";
import { TextInput } from "react-native";
import { useFormContext } from "@/app/providers/Form";
import CustomRadioButton from "@/components/CustomRadioButton";
import { supabase } from "@/lib/supabase";
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import * as SecureStore from 'expo-secure-store';


const RequestStepOne: React.FC = () => {
  const router = useRouter();
  const { formData, updateFormData, clearFormData } = useFormContext();
  const arrowIcon = <AntDesign name="arrowright" size={24} color="white" />;
  const [headline, onChangeHeadline] = useState(formData.headline || '');
  let [locationInfo, setLocationInfo] = useState({} as any);

 


  useEffect(() => {    
    clearFormData();
    console.log(formData, 'formData Step 1')
  }
  ,[])
//i should figure out how i should store address in the database so that a user can just put "drop_off_location" for the items they need - then 
  /*
 LOG  {"description": "Berlin, Germany", "matched_substrings": [{"length": 6, "offset": 0}], "place_id": "ChIJAVkDPzdOqEcRcDteW0YgIQQ", "reference": "ChIJAVkDPzdOqEcRcDteW0YgIQQ", "structured_formatting": {"main_text": "Berlin", "main_text_matched_substrings": [[Object]], "secondary_text": "Germany"}, "terms": [{"offset": 0, "value": "Berlin"}, {"offset": 8, "value": "Germany"}], "types": ["locality", "political", "geocode"]} {"address_components": [{"long_name": "Berlin", "short_name": "Berlin", "types": [Array]}, {"long_name": "Kreisfreie Stadt Berlin", "short_name": "Kreisfreie Stadt Berlin", "types": [Array]}, {"long_name": "Berlin", "short_name": "BE", "types": [Array]}, {"long_name": "Germany", "short_name": "DE", "types": [Array]}], "adr_address": "<span class=\"locality\">Berlin</span>, <span class=\"country-name\">Germany</span>", "formatted_address": "Berlin, Germany", "geometry": {"location": {"lat": 52.52000659999999, "lng": 13.404954}, "viewport": {"northeast": [Object], "southwest": [Object]}}, "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png", "icon_background_color": "#7B9EB0", "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet", "name": "Berlin", "photos": [{"height": 716, "html_attributions": [Array], "photo_reference": "AelY_Csc55Nn4cRGbCILjQRA3uVf8-rFLCYsRoNULLj1P2HwR2A6DkqorOOE2Q_tUPLty33i_WrhFCZnE_QaiWWCgiNewDzXIMqIUjmgDj1v0NFLsTJ5ChNQuKueoCDALJrWrq5EUUCBOxYI7sszs9uISflofcY-tKIyl4dvIBzGk0DXX9Ru", "width": 1079}, {"height": 4032, "html_attributions": [Array], "photo_reference": "AelY_CsyZtpuwd_fxW0GhrU-98o0BwEpdFuW5DHA18I9mlaDFnjjRD56UI1SkRohIgivMiZw8OExtj5NvPh8IZvojTJOseNl0kAObDyLUnhHQrqpX9kSVmT3mp1Q8XGxRv5Wq1TfXmAetpftPTx1sOBNI-0ti9qRJbaMi7QHiVAVtzSQStBJ", "width": 2268}, {"height": 1217, "html_attributions": [Array], "photo_reference": "AelY_CvVCufd9KpNt2p6N7DtQl6rOet_6pX9Ld20Nv8RPyU4UP2jU0L5yDhEX4jn8Ay5J5aQC_QlGSESkVeWSSNJ76iYdprInj2NPRT-4uoxB7uV9kIuMHG2FBeSjZRcjNPly0QS48TFxNTT65E9veHilOsFHfaH_9Wmrchz_dyihMXe8-eY", "width": 1623}, {"height": 4032, "html_attributions": [Array], "photo_reference": "AelY_Cu-R6-PfzJJhzp-DtvO8dmIiqSnaLwCKIE4zPnpQG9bhVUjwOXeNvCCdnCs87gc2PmcnVaP9QrIopYCWMR_9M8eeYqyQ6a2CmPaU-JLb3YQNNuQHx2BhPZDm1CF6I8qB3DCzxWiTafzKWhqof31D3GJgzF59DUNQ1nHaSBZ-0WiMwD8", "width": 2268}, {"height": 4608, "html_attributions": [Array], "photo_reference": "AelY_CvzBRtXEiUFsbS3cH7rF3_stoHRpPY_HOH_06qBh-CSgz87fqys7inSFAg1h7tFneFR0Ui19CaWJZTdda0e0UaRwX8MzBBiwHkgTyyygHAKmIDnbyffSmVNNA1UslWEhDX18Jj5p0cw_vedxcZD86v1lW0sNxuvXWRZWMd53dWLI2rm", "width": 2592}, {"height": 4032, "html_attributions": [Array], "photo_reference": "AelY_CtOL4lJR5xHh8lX9KbGzKpnjMmDy-eNEvWKnVtTIjjYttJBBs6_0Td6TikEDpur68RJdd1dswjn5TBOecMvmLtY7t5pDfbadaDM2Cesp18sOV0d_yaIBqoDNTWWwU4Np8G59SQEjObndiI19rvJm1GicNgeNeERN5OxgADRWMZY2Zdk", "width": 2268}, {"height": 4032, "html_attributions": [Array], "photo_reference": "AelY_Cs-_IhXtUXN6GX9ga0uRdr1B3-y5kCqhKXJZX0aA-BbYxfPWwwHLZQ01dJECbOu-X_X9NMcpFZpFWc238YVjmgF6X08DBQHxGRUe-BlSWoo-JvJhYokNyr7kj7uPR2Hd_g6hu0w3r8g4h9w6mYf8ohayOKJatMDIephS-7LipFYjlsb", "width": 2268}, {"height": 1960, "html_attributions": [Array], "photo_reference": "AelY_CuaDixvvdcCwr4QjpGEu28zSjaZ3NwvkgJwllOBVJ7OBM_T_J3Kc18XeUXHl2lZR-wk6MCstu7tCf36_URWqdvMZ75aFWYP0ptbYCUJTxnLFOup8i66VmvidApngiQPUWhGeCyjIqeydnqhDCIxKOirxywYF1qDpCcw44yZNYdCIeTj", "width": 4032}, {"height": 1800, "html_attributions": [Array], "photo_reference": "AelY_CuiRaE17SKOWWcpen7mOXE0YJe9gy9F3A-bexLTDqC1Eob7pEV2Tl7RDMbjGerKbp2esLVV2Gl08vUjv4VZcCoKXqXFJPEghvbH2kzAQiqd9N_e336dXOsOJiNhHQt2Oqfx2U_zj_XQ7S39JZHdw0g6A20uAfc7oI6mACZ1wG8CO4WO", "width": 4000}, {"height": 4032, "html_attributions": [Array], "photo_reference": "AelY_CtCqNeut2UBwyjuGM93Y8kcjA9U5mVRdTS4r07loSpepKew0qhNGFGTw_qXp90Foa1-6yr59r5oyFs1q7yZRnSmkruh9_xOaPcjop7MHBaZgLkpEJ-2ePsMNj5P0q2QnEDBtX8SyoK881WAxwF_3yEReabvaZxg6eM0u7Ax-KTjSZgQ", "width": 2268}], "place_id": "ChIJAVkDPzdOqEcRcDteW0YgIQQ", "reference": "ChIJAVkDPzdOqEcRcDteW0YgIQQ", "types": ["locality", "political"], "url": "https://maps.google.com/?q=Berlin,+Germany&ftid=0x47a84e373f035901:0x42120465b5e3b70", "utc_offset": 120, "vicinity": "Berlin"}

  */
  useEffect(() => {
 
    updateFormData('headline', headline);
    updateFormData('latitude', locationInfo.latitude);
    updateFormData('longitude', locationInfo.longitude);
    updateFormData('place_id', locationInfo.place_id);
    updateFormData('main_location', locationInfo.main_text);
    updateFormData('secondary_location', locationInfo.secondary_text);
    updateFormData('formatted_address', locationInfo.formatted_address);


  }, [headline,locationInfo]);
  const renderContent = () => {
    return (
      <View>
        <Image style={styles.headBox} source={require("../../../assets/images/birdbox.png")} />
        <Text style={styles.header}>Request Form</Text>
        <StepCounter currentStep={1} totalSteps={3} />

        <Text style={styles.heading}>What is your request Headline?</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeHeadline}
          value={formData.headline}
          placeholder="Help me with.."
        />
        <Text style={styles.heading}>Select the pickup location for your request</Text>
      <View style={styles.googleContainer}>
              <GooglePlacesAutocomplete
        placeholder='Drop off location'
        query={{key:'AIzaSyA11amKpXti4LiFqwOidmgQ8FmJDaARqVM'}}
        fetchDetails={true}
        styles={{
          textInput:{
            fontSize: 14,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: 'greyB',
            height: 42,
          },
        }}
        onPress={(data,details=null)=>{
          if(details){
            setLocationInfo({
              place_id: details.place_id,
              formatted_address: details.formatted_address,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              main_text: data.structured_formatting.main_text,
              secondary_text: data.structured_formatting.secondary_text,
            })
          }
        }}
        onFail={error => console.log(error)}
        onNotFound={() => console.log('no results')}
        listEmptyComponent={() => (
          <View style={{flex: 1}}>
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
    width: 100,
    height: 100,
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
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
    width: 300,
    alignSelf: 'center',
    marginBottom: 20,
  },
   tagContainer:{
    width: 100,
    height: 30,
    backgroundColor: Colors.grey.background,
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 15,
  
  }

});