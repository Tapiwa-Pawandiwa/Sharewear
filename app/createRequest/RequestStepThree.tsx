import React,{useState} from 'react';
import { View, Text, StyleSheet, Image,TextInput } from 'react-native';
import RoundedButton from '@/components/RoundedButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepCounter from '@/components/StepCounter';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

const RequestStepThree:React.FC = () => {
  const [text, onChangeText] = useState("I am in need of...because...");
  const [images, setImages] = useState([] as string[]);
  const uploadIcon = <Feather name="upload" size={18} color="black" />;
  return (
    <View style={styles.container}>
    <Image style={styles.headBox} source={require("../../assets/images/birdbox.png")}/>
      <Text style={styles.header}>Request Form </Text>
    <StepCounter currentStep={3} totalSteps={3}/>

  <View style={styles.instructionContainer}>
    <Text style={styles.instructionText}>Add a description to motivate your donors</Text>
    <Text style={styles.subtitleText}>Describe your need and how it will help you or your community. This will be visible in addition to your profile bio</Text>
  </View>
  <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        multiline={true}
        textAlignVertical='top'
        selectionColor={Colors.green.alt}
      />
        <Text style={styles.instructionText}> Upload at least one Image</Text> 
<View>
<RoundedButton title="Upload Image" icon={uploadIcon} iconStyle={styles.iconStyle}   buttonStyle={styles.uploadButton} textStyle={styles.uploadText}/>
</View>
<View style={styles.imageSummaryContainer}>
    
</View>
<View style={styles.buttonBox}>
    <RoundedButton title="Preview"   buttonStyle={styles.previewButton} textStyle={styles.previewText}/>
    <RoundedButton title="Publish"   buttonStyle={styles.publishButton} textStyle={styles.publishText}/>
</View>
  </View>
)
}

export default RequestStepThree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headBox:{
    width: 50,
    marginTop: 60,
    height: 50,
    alignSelf: 'center',
  },
  header: {
    fontSize: 24,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  instructionContainer:{
    marginLeft: 20,
    marginRight: 20,
  },
  instructionText:{
    fontSize: 20,
    fontFamily: "LeagueSpartan-Regular",
    marginBottom: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  subtitleText:{
    fontSize: 16,
    fontFamily: "LeagueSpartan-Regular",
    textAlign: 'center',
    lineHeight: 20,
    color: Colors.grey.dark,
    alignSelf: "center",
  },
  input :{
    height: 150,
    margin: 12,
    width: 300,
    alignSelf: 'center',
    borderWidth: 10,
    borderColor: Colors.grey.card,
    padding: 10,
    borderRadius: 20,
     textAlignVertical: 'top'
  },
  uploadButton:{
    backgroundColor: Colors.green.alt,
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  uploadText:{
    color:'white',
    textAlign: 'left',
    lineHeight: 30,
    fontSize: 16,
  },
  iconStyle:{
    marginLeft: 10,
  },
  previewButton: {
    width: 100,
    backgroundColor: Colors.beige.main,
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: 15,  
  },
  publishButton: {
    width: 100,
    backgroundColor: Colors.green.main,
    alignContent: 'center',
    alignSelf: 'center',
   
  },
  previewText: {
    color:'black',
    textAlign: 'left',
    lineHeight: 30,
   
  },
  publishText: {
    color:'white',
    textAlign: 'left',
    lineHeight: 30,
  },
  buttonBox:{
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 20,
    padding: 10,
  },
  imageSummaryContainer:{
    backgroundColor: Colors.grey.background,
    height: 110,
    width: 300,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 25,
  }
})