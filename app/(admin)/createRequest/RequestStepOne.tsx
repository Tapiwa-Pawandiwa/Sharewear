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


const RequestStepOne: React.FC = () => {
  const router = useRouter();
  const { formData, updateFormData, clearFormData } = useFormContext();

  const arrowIcon = <AntDesign name="arrowright" size={24} color="white" />;
  const [headline, onChangeHeadline] = useState(formData.headline || '');
  const [city, onChangeCity] = useState(formData.city || '');
  const [suburb, onChangeSuburb] = useState(formData.suburb || '');
  

  useEffect(() => {
    clearFormData();
    console.log(formData, 'formData Step 1')
  }
    ,[])
  
  useEffect(() => {
 
    updateFormData('headline', headline);
    updateFormData('city', city);
    updateFormData('suburb', suburb);
  }, [headline,city,suburb]);
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
        <Text style={styles.heading}>City</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeCity}
          value={formData.city}
        />
        <Text style={styles.heading}>Suburb</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeSuburb}
          value={formData.suburb}
        />
        <Text style={styles.heading}>Select Tags associated with your situation</Text>
<View style={styles.tagBox}>
          <TagSelector />
        </View>
 

        <RoundedButton title="Next" link="/createRequest/RequestStepTwo" icon={arrowIcon} buttonStyle={styles.nextButton} textStyle={styles.nextText} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
  header: {
    fontSize: 24,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 20,
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