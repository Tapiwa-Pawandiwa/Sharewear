import { View, Text ,StyleSheet,Image, SafeAreaView} from 'react-native'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider';
import Link from '@react-navigation/native';
import { router } from 'expo-router'; 
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './providers/Auth';


/*
    Onboarding Screen
    1. Purpose : Welcome screen for new users
    2. Shows what they are able to do with the app and the steps to do so
*/


const buttonLabel = (label:string) => {
    return (
      <View style={{padding: 12}}>
        <Text style={{color: 'black', fontFamily: 'Inter-Regular', fontSize: 18}}>{label}</Text>
      </View>
    );
};

const slides = [
    {
      id: 1,
      title: 'Welcome to Sharewear',
      description: 'Experience a unique way to donate and receive donations',
      image: require('../assets/images/save-earth.png'),
    },
    {
      id: 2,
      title: 'As a beneficiary',
      description: ' Simply create a request by filling in a form, Sharewear ensures donations are made in a timely manner',
      image: require('../assets/images/save-earth.png'),
    },
    {
      id: 3,
      title: 'Once you receive a donation',
      description:
        'Confirm the items you have received',
      image: require('../assets/images/save-earth.png'),
    },
    {
      id: 4,
      title: 'As a donnee ',
      description:
        'Select from a variety of people, organizations and communities in need',
      image: require('../assets/images/save-earth.png'),
    },
    {
        id: 5,
        title: 'Once you commit to a donation',
        description:
          'Once you commit , you have 48 hours to deliver the items to the beneficiary',
        image: require('../assets/images/save-earth.png'),
      },
      {
        id: 6,
        title: 'Try it out',
        description:
          'Once you commit , you have 48 hours to deliver the items to the beneficiary',
        image: require('../assets/images/save-earth.png'),
      },
  ];
  

const Onboarding = () => {
const {session, profile, loading,isAdmin} = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      if (hasSeenOnboarding) {
        if (session) {
          if (isAdmin) {
            router.navigate('/(admin)');
          } else {
            router.navigate('/(user)');
          }
        } else {
          router.navigate('/(auth)/sign-in');
        }
      }
    };
    checkOnboardingStatus();
  }, [session, isAdmin]);

  const handleDone = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.navigate('/(auth)/sign-in')
  }
  return (
    <AppIntroSlider
    data={slides}
    renderItem={({item}) => {
      return (
        <SafeAreaView
          style={{flex: 1,alignItems: 'center', justifyContent: 'center',backgroundColor:'white'}}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.sliderImg} />
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionDescription}>
              {item.description}
            </Text>
          </View>
        </SafeAreaView>
      );
    }}
    activeDotStyle={{backgroundColor: Colors.green.main,width: 30}}
    showSkipButton
    renderNextButton={() => buttonLabel('Next')}
    renderSkipButton={() => buttonLabel('Skip')}
    renderDoneButton={() => buttonLabel('Done')}
    onDone={handleDone}
  />
);
}

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