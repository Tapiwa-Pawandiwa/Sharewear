import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RoundedButton from '@/components/RoundedButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import StepCounter from '@/components/StepCounter';
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ItemAdder from '@/components/ItemAdder';
import { useFormContext } from '@/app/providers/Form';
const RequestStepTwo:React.FC = () => {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();

  const arrowIcon = <AntDesign name="arrowright" size={24} color="white" />;
useEffect(() => {
  console.log(formData, 'formData Step 2')
  }
  ,[])
  return (
    <View style={styles.container}>
      <Image style={styles.headBox} source={require("../../../assets/images/birdbox.png")}/>
        <Text style={styles.header}>Request Form </Text>
      <StepCounter currentStep={2} totalSteps={3}/>
      <ItemAdder/>
      <RoundedButton title="Next" link="/createRequest/RequestStepThree" icon={arrowIcon} buttonStyle={styles.nextButton} textStyle={styles.nextText}/>
    </View>
)
}

export default RequestStepTwo; 

const styles = StyleSheet.create({
  container: {
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
  headBox:{
    width: 50,
    marginTop: 60,
    height: 50,
    alignSelf: 'center',
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
  }
});