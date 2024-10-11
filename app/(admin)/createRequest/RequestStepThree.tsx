import React,{useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image,TextInput,FlatList, Alert, ActivityIndicator } from 'react-native';
import RoundedButton from '@/components/RoundedButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepCounter from '@/components/StepCounter';
import Colors from '@/constants/Colors';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import { useFormContext } from '@/app/providers/Form';
import { TouchableOpacity } from 'react-native';
import {FileObject} from '@supabase/storage-js';
import * as FileSystem from 'expo-file-system'
import { router, useLocalSearchParams } from 'expo-router';
import { Modal } from 'react-native';
import { Status } from '@/app/providers/Form';
import { CustomAlertModal } from '@/components/CustomAlertModal';
import SlideButton from '@/components/SlideButton';



const RequestStepThree:React.FC = () => {
  const [text, onChangeText] = useState("");
  const [localImages, setLocalImages] = useState<{ base64: string, contentType: string, uri: string }[]>([]); // Properly typed state
  const { formData,uploadImages, updateFormData,postFormData } = useFormContext();
  const uploadIcon = <Feather name="upload" size={18} color="black" />;
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state
  const [pickingImage, setPickingImage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const params = useLocalSearchParams();
  const pickImage = async() => {
   
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, 
      quality: 1,
    })
    setPickingImage(true);

    if (!result.canceled) {
      const newImages = await Promise.all(result.assets.map(async (asset) => {
          const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
          const contentType = asset.type === 'image' ? (asset.uri.endsWith('.png') ? 'image/png' : 'image/jpeg') : 'image/jpg';
          return { uri: asset.uri, base64, contentType }; // Ensure all properties are included
      }));
      setLocalImages([...localImages, ...newImages]);
      setPickingImage(false);
  }
  };


  const handleDeleteImage = (index: number) => {
    const updatedLocalImages = [...localImages];
    updatedLocalImages.splice(index, 1);
    setLocalImages(updatedLocalImages);
  };
  
  const handlePublish = async () => {
    if (localImages.length === 0) {
      Alert.alert('Error', 'Please upload at least one image before publishing.');
      return;
    }
  
    setIsUploading(true);
    try {
      // Navigate to the home page immediately with parameters to show progress and modal
      router.push({
        pathname: '/(tabs)',
        params: {
          showModal: 'true',    // Display the success modal on the home screen
          showProgress: 'true', // Show the horizontal progress bar
        },
      });
  
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 0.1;
        setProgress(currentProgress);
        if (currentProgress >= 1) clearInterval(interval);
      }, 1000);
  
      const uploadedFilePaths = await uploadImages(localImages);
  
      if (uploadedFilePaths.length === 0) {
        Alert.alert('Error', 'There was an error uploading your images. Please try again.');
        return;
      }
  
      const updatedFormData = {
        ...formData,
        images: [...formData.images, ...uploadedFilePaths],
        status: Status.AVAILABLE, // Use Status enum
      };
  
      const result = await postFormData(updatedFormData);
      if (result.success) {
        setProgress(1); // Update progress to 100% upon success
        setIsUploading(false);
      } else {
        Alert.alert('Error', 'There was an error posting your request. Please try again later.');
      }
    } catch (error) {
      console.error('Error posting form data:', error);
      Alert.alert('Error', 'There was an error uploading your images or posting your request. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <View style={styles.container}>
    <Image style={styles.headBox} source={require("../../../assets/images/birdbox.png")}/>
      <Text style={styles.header}>Request Form </Text>
    <StepCounter currentStep={3} totalSteps={3}/>

  <View style={styles.instructionContainer}>
    <Text style={styles.instructionText}>Add a description to motivate your donors</Text>
    <Text style={styles.subtitleText}>Describe your need and how it will help you or your community. This will be visible in addition to your profile bio</Text>
  </View>
  <TextInput
        style={styles.input}
        onChangeText={(text) => {
          onChangeText(text);
          updateFormData('description', text); // Update form data as user types
      }}
        value={text}
        multiline={true}
        textAlignVertical='top'
        selectionColor={Colors.green.alt}
        placeholder='Add a description...I am in need of...because...'
      />
        <Text style={styles.instructionText}> Upload at least one Image</Text> 
<View>
<RoundedButton title="Upload Image" icon={uploadIcon} onPress={pickImage} iconStyle={styles.iconStyle}   buttonStyle={styles.uploadButton} textStyle={styles.uploadText}/>
</View>
<View style={styles.imageSummaryContainer}>
  {pickingImage && <ActivityIndicator size="large" color={Colors.green.main} />}
<FlatList

          data={localImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.summaryItem}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <TouchableOpacity onPress={() => handleDeleteImage(index)}>
                <AntDesign name="close" size={20} color="red" style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
</View>
<View style={styles.buttonBox}>
<SlideButton title="Publish" onSlideComplete={handlePublish} buttonStyle={styles.publishButton} disabled={isUploading}/>

 

     {isUploading &&     <CustomAlertModal
                visible={modalVisible}
                progress={progress}
                loading={isUploading}
                message='Uploading images and posting request...'
                onClose={() => setModalVisible(false)} // Pass the progress value to the modal
            />}


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
  summaryItem: {
    marginRight: 10,
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 5,
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
 
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  publishButton: {
    width: 200,
    backgroundColor: Colors.green.main,
    alignContent: 'center',
    alignSelf: 'center',
   
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