import { useAuth } from '@/app/providers/Auth';
import DonationCard from '@/components/user/DonationCard';
import { Redirect } from 'expo-router';
import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  const {session, loading, profile} = useAuth();

  if(loading) {
    return <ActivityIndicator/>
  }
  if (!session) {
    console.log(profile, 'profile')
    return <Redirect href="/(auth)/sign-in" />

  }

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.mainName}>Hi, <Text>{profile?.first_name} </Text></Text>
        <DonationCard/>
    </SafeAreaView>
  )
}

export default index;
const styles = StyleSheet.create({
  container:{
    backgroundColor: 'white',
    flex: 1
  },
  mainName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 20
  }
})