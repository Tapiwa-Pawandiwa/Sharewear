import { StyleSheet, Image } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import RoundedButton from "@/components/RoundedButton";
import { Link, useRouter } from "expo-router";
export default function TabOneScreen() {
  const router = useRouter();
 
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Welcome, <Text style={styles.name}>Olly</Text>
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
        <RoundedButton link="/createRequest/RequestStepOne" title="Create Request"  buttonStyle={styles.homeButton} textStyle={styles.buttonText}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
