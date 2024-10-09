import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import { useAuth } from "../providers/Auth";

const slides = [
  {
    id: 1,
    title: "Welcome to ShareWhere",
    description: "Experience a unique way to donate and receive donations",
    image: require("../../assets/images/save-earth.png"),
  },
  {
    id: 2,
    title: "As a beneficiary",
    description: "Simply create a request by filling in a form, Sharewear ensures donations are made in a timely manner",
    image: require("../../assets/images/save-earth.png"),
  },
  // Add the rest of your slides here
];

const Onboarding = () => {
  const { session, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      if (hasSeenOnboarding) {
        if (session) {
          router.replace(isAdmin ? "/(admin)" : "/(user)");
        } else {
          router.replace("/(auth)/sign-in");
        }
      } else {
        setIsLoading(false);
      }
    };
    checkOnboardingStatus();
  }, [session, isAdmin]);

  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/sign-in");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AppIntroSlider
      data={slides}
      renderItem={({ item }) => (
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.sliderImg} />
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionDescription}>{item.description}</Text>
          </View>
        </SafeAreaView>
      )}
      activeDotStyle={{ backgroundColor: Colors.green.main, width: 30 }}
      showSkipButton
      renderNextButton={() => <Text>Next</Text>}
      renderSkipButton={() => <Text>Skip</Text>}
      renderDoneButton={() => <Text>Done</Text>}
      onDone={handleDone}
    />
  );
};

export default Onboarding;

const styles= StyleSheet.create({
  sectionDescription: {
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Now-Light',
    color: 'black',
  },
  highlight: {
    fontWeight: 'bold',
  },
  sliderImg: {
    width: 400,
    height: 450,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Now-Bold',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  descriptionContainer: {
    width: 370,
    height: 100,
    padding: 15,
    backgroundColor: Colors.grey.background,
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: 'grey',
    borderWidth: 0.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

})