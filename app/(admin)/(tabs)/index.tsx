import { StyleSheet, Image } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import RoundedButton from "@/components/RoundedButton";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/app/providers/Auth";
import { useFormContext } from "@/app/providers/Form";
import { useEffect, useState } from "react";
import { CustomAlertModal } from "@/components/CustomAlertModal";
import Assets from "@/assets/Assets";
import FilterChip from "@/components/FilterChip";
import FilterChipList from "@/components/FilterChipList";

export default function TabOneScreen() {
  const router = useRouter();
  const {profile,isAdmin,loading} = useAuth();
  const {clearFormData}= useFormContext();
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state
  const params = useLocalSearchParams();


 
  useEffect(() => {
    if (params.showModal === 'true') {
      setModalVisible(true);
      
      // Remove the query parameter without causing a navigation
      router.setParams({ showModal: undefined });
    }
  }, [params, router]);

 
  const handleModal = () => {
    console.log('Starting handleModal');
    setModalVisible(true);
    setIsUploading(true);
    setProgress(0); // Reset progress to 0 at the start
  
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 0.1;
      setProgress(currentProgress);
      if (currentProgress >= 1) {
        clearInterval(interval);
        setProgress(1); // Ensure progress is exactly 1 at the end
        setIsUploading(false);
        setModalVisible(false); // Close modal when progress completes
      }
    }, 500);
  };


  return (
    <SafeAreaView style={styles.container}>
        <CustomAlertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        image={Assets.icons.HighFive}
        message='Congrats, your request is live!'
      />
      <Text style={styles.title}>
        Welcome, <Text style={styles.name}>{profile?.first_name}</Text>
      </Text>
      <Image
        source={require("../../../assets/images/save-earth.png")}
        style={styles.image}
      />
      <View style={styles.bubble}>
        <View style={styles.innerbubble}>
        <Text style={styles.bubbleSubtitle}>
            Are you in need of something ?
          </Text>
          <Image
            source={require("../../../assets/images/birdbox.png")}
            resizeMode="cover"
            style={styles.birdbox}
          />
        </View>
        <RoundedButton link="/createRequest/RequestStepOne" onPress={ clearFormData} title="Create Request"  buttonStyle={styles.homeButton} textStyle={styles.buttonText}/>
        <RoundedButton onPress={handleModal} title="Test" buttonStyle={styles.homeButton} textStyle={styles.buttonText}/>
        {


        }
   
        {/*
        <CustomAlertModal
                visible={modalVisible}
                loading={isUploading}

                progress={progress}
                message='Uploading images and posting request...'
                onClose={() => setModalVisible(false)} // Pass the progress value to the modal
        />
*/}
      
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  bubble: {
    backgroundColor: Colors.grey.background,
    height: 155,
    width: 350,

    borderRadius: 35,
    marginLeft: 20,
    marginTop: 40,
    padding: 10,
  },
  homeButton:{
    backgroundColor: Colors.green.main,
    marginLeft: 15,
  
  },
  innerbubble: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.grey.background,
    marginLeft: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
    fontFamily: "LeagueSpartan-Bold",
    marginLeft: 20,
    textAlign: "center",
  },
  name: {
    color: Colors.green.main,
  },
  bubbleSubtitle: {
    fontSize: 25,
    width: 200,
    marginLeft: 10,
    marginTop: 15,
    fontFamily: "LeagueSpartan-Regular",
  },
  image: {
    width: 350,
    height: 350,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  birdbox: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 25, 
    marginTop: 5,
  },
  buttonText: {
    color: 'white',

  },

});
